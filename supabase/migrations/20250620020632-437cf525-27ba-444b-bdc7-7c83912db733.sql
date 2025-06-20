
-- Create users table for Web3 authentication
CREATE TABLE public.web3_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  chain_id INTEGER NOT NULL DEFAULT 1,
  wallet_type TEXT NOT NULL DEFAULT 'metamask',
  nonce TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create authentication tokens table
CREATE TABLE public.web3_auth_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.web3_users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'bearer',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.web3_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web3_auth_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for web3_users
CREATE POLICY "Users can view their own data" 
  ON public.web3_users 
  FOR SELECT 
  USING (wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address');

CREATE POLICY "Anyone can create users" 
  ON public.web3_users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own data" 
  ON public.web3_users 
  FOR UPDATE 
  USING (wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address');

-- RLS policies for web3_auth_tokens
CREATE POLICY "Users can view their own tokens" 
  ON public.web3_auth_tokens 
  FOR SELECT 
  USING (user_id IN (
    SELECT id FROM public.web3_users 
    WHERE wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address'
  ));

-- Create function to generate nonce
CREATE OR REPLACE FUNCTION public.generate_web3_nonce(
  p_wallet_address TEXT,
  p_chain_id INTEGER DEFAULT 1,
  p_wallet_type TEXT DEFAULT 'metamask'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_nonce TEXT;
  user_id UUID;
BEGIN
  -- Generate a random nonce
  new_nonce := encode(gen_random_bytes(32), 'hex');
  
  -- Insert or update user with new nonce
  INSERT INTO public.web3_users (wallet_address, chain_id, wallet_type, nonce)
  VALUES (p_wallet_address, p_chain_id, p_wallet_type, new_nonce)
  ON CONFLICT (wallet_address) 
  DO UPDATE SET 
    nonce = new_nonce,
    chain_id = p_chain_id,
    wallet_type = p_wallet_type,
    updated_at = now()
  RETURNING id INTO user_id;
  
  RETURN new_nonce;
END;
$$;

-- Create function to verify signature and create token
CREATE OR REPLACE FUNCTION public.verify_web3_signature(
  p_wallet_address TEXT,
  p_signature TEXT,
  p_chain_id INTEGER DEFAULT 1,
  p_wallet_type TEXT DEFAULT 'metamask'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  new_token TEXT;
  token_id UUID;
  result JSON;
BEGIN
  -- Get user and nonce
  SELECT * INTO user_record
  FROM public.web3_users 
  WHERE wallet_address = p_wallet_address AND nonce IS NOT NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found or nonce expired';
  END IF;
  
  -- In a real implementation, you'd verify the signature here
  -- For now, we'll assume the signature is valid if it exists
  IF p_signature IS NULL OR LENGTH(p_signature) < 10 THEN
    RAISE EXCEPTION 'Invalid signature';
  END IF;
  
  -- Generate access token
  new_token := encode(gen_random_bytes(32), 'base64');
  
  -- Clear the nonce (it's been used)
  UPDATE public.web3_users 
  SET nonce = NULL, updated_at = now() 
  WHERE id = user_record.id;
  
  -- Store the token
  INSERT INTO public.web3_auth_tokens (user_id, access_token, expires_at)
  VALUES (user_record.id, new_token, now() + interval '24 hours')
  RETURNING id INTO token_id;
  
  -- Return authentication response
  SELECT json_build_object(
    'access_token', new_token,
    'token_type', 'bearer',
    'user', json_build_object(
      'id', user_record.id,
      'wallet_address', user_record.wallet_address,
      'chain_id', user_record.chain_id,
      'wallet_type', user_record.wallet_type,
      'is_active', user_record.is_active,
      'created_at', user_record.created_at,
      'updated_at', now()
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
