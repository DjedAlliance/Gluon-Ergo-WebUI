import { createContext } from 'react';

export interface AccountType {
  avatar?: string;
  name?: string;
  msig_address: string;
  balance?: number;
}

export interface AppContextType {
  walletAssets: any;
  setWalletAssets: any;
  assets: any;
  setAssets: any;
}

const initialAppContext: AppContextType = {
  walletAssets: undefined,
  setWalletAssets: () => {},
  assets: undefined,
  setAssets: () => {},
};

const AppContext = createContext<AppContextType>(initialAppContext);

export default AppContext;
