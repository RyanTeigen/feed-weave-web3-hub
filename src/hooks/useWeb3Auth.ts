
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Web3AuthState {
  isConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  user: any | null;
}

interface Web3AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    wallet_address: string;
    chain_id: number;
    wallet_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export const useWeb3Auth = () => {
  const [authState, setAuthState] = useState<Web3AuthState>({
    isConnected: false,
    walletAddress: null,
    isConnecting: false,
    user: null,
  });
  const { toast } = useToast();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('web3_access_token');
    const user = localStorage.getItem('web3_user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setAuthState({
        isConnected: true,
        walletAddress: userData.wallet_address,
        isConnecting: false,
        user: userData,
      });
    }
  }, []);

  const connectWallet = async (): Promise<boolean> => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return false;
    }

    setAuthState(prev => ({ ...prev, isConnecting: true }));

    try {
      console.log('Starting wallet connection process...');
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts.length) {
        throw new Error('No accounts found');
      }

      const walletAddress = accounts[0];
      console.log('Wallet address obtained:', walletAddress);

      // Get nonce from Supabase function
      console.log('Requesting nonce from Supabase...');
      const { data: nonceData, error: nonceError } = await supabase.rpc('generate_web3_nonce', {
        p_wallet_address: walletAddress,
        p_chain_id: 1,
        p_wallet_type: 'metamask'
      });

      if (nonceError) {
        console.error('Nonce request failed:', nonceError);
        throw new Error(`Failed to get nonce: ${nonceError.message}`);
      }

      const nonce = nonceData as string;
      console.log('Nonce received, requesting signature...');

      // Sign the nonce
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [nonce, walletAddress],
      });

      console.log('Signature obtained, verifying with Supabase...');

      // Verify signature and authenticate
      const { data: authData, error: authError } = await supabase.rpc('verify_web3_signature', {
        p_wallet_address: walletAddress,
        p_signature: signature,
        p_chain_id: 1,
        p_wallet_type: 'metamask'
      });

      if (authError) {
        console.error('Authentication failed:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      console.log('Authentication successful!');

      // Cast the response to our expected type
      const authResponse = authData as Web3AuthResponse;

      // Store authentication data
      localStorage.setItem('web3_access_token', authResponse.access_token);
      localStorage.setItem('web3_user', JSON.stringify(authResponse.user));

      setAuthState({
        isConnected: true,
        walletAddress: authResponse.user.wallet_address,
        isConnecting: false,
        user: authResponse.user,
      });

      toast({
        title: "Wallet Connected! 🎉",
        description: "Your wallet has been successfully connected and authenticated.",
      });

      return true;
    } catch (error) {
      console.error('Web3 authentication error:', error);
      setAuthState(prev => ({ ...prev, isConnecting: false }));
      
      let errorMessage = "Failed to connect wallet";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  };

  const disconnect = () => {
    localStorage.removeItem('web3_access_token');
    localStorage.removeItem('web3_user');
    
    setAuthState({
      isConnected: false,
      walletAddress: null,
      isConnecting: false,
      user: null,
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('web3_access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return {
    ...authState,
    connectWallet,
    disconnect,
    getAuthHeaders,
  };
};
