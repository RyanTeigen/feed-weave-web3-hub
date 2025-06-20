
import React, { createContext, useContext, ReactNode } from 'react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

interface Web3AuthContextType {
  isConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  user: any | null;
  connectWallet: () => Promise<boolean>;
  disconnect: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const useWeb3AuthContext = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3AuthContext must be used within a Web3AuthProvider');
  }
  return context;
};

interface Web3AuthProviderProps {
  children: ReactNode;
}

export const Web3AuthProvider: React.FC<Web3AuthProviderProps> = ({ children }) => {
  const web3Auth = useWeb3Auth();

  return (
    <Web3AuthContext.Provider value={web3Auth}>
      {children}
    </Web3AuthContext.Provider>
  );
};
