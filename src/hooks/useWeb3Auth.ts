
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

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

      // Get nonce from FastAPI backend
      console.log('Requesting nonce from backend...');
      const nonceResponse = await fetch(API_ENDPOINTS.nonce, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          chain_id: 1, // Ethereum mainnet
          wallet_type: 'metamask'
        }),
      });

      console.log('Nonce response status:', nonceResponse.status);
      
      if (!nonceResponse.ok) {
        const errorText = await nonceResponse.text();
        console.error('Nonce request failed:', errorText);
        throw new Error(`Failed to get nonce: ${nonceResponse.status} ${errorText}`);
      }

      const { nonce } = await nonceResponse.json();
      console.log('Nonce received, requesting signature...');

      // Sign the nonce
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [nonce, walletAddress],
      });

      console.log('Signature obtained, verifying with backend...');

      // Verify signature and authenticate
      const authResponse = await fetch(API_ENDPOINTS.verify, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          signature: signature,
          chain_id: 1,
          wallet_type: 'metamask'
        }),
      });

      console.log('Auth response status:', authResponse.status);

      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.error('Authentication failed:', errorText);
        throw new Error(`Authentication failed: ${authResponse.status} ${errorText}`);
      }

      const authData: Web3AuthResponse = await authResponse.json();
      console.log('Authentication successful!');

      // Store authentication data
      localStorage.setItem('web3_access_token', authData.access_token);
      localStorage.setItem('web3_user', JSON.stringify(authData.user));

      setAuthState({
        isConnected: true,
        walletAddress: authData.user.wallet_address,
        isConnecting: false,
        user: authData.user,
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
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "Cannot connect to backend server. Please check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
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
