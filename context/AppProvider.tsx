import React, { useState, ReactNode } from 'react';
import AppContext, { AppContextType } from './AppContext';
import { Asset } from '@/types/nodeApi';

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
  const jsonData = `[]`;
  const initialData: Asset[] = JSON.parse(jsonData).map((asset: Asset) => ({
    ...asset,
    price: 0, // Set the initial price to 0
  }));

  const [walletAssets, setWalletAssets] = useState<Token[]>([]);
  const [assets, setAssets] = useState<Asset[]>(initialData);


  const contextValue: AppContextType = {
    walletAssets,
    setWalletAssets,
    assets,
    setAssets,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
