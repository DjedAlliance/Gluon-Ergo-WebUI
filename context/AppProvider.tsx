import React, { useState, ReactNode } from 'react';
import AppContext, { AppContextType } from './AppContext';

interface AppProviderProps {
  children: ReactNode;
}

interface Token {
  tokenId: string;
  amount: number;
  decimals: number;
  name: string;
  tokenType: string;
  usdValue: number;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [walletAssets, setWalletAssets] = useState<Token[]>([]);

  const contextValue: AppContextType = {
    walletAssets,
    setWalletAssets,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
