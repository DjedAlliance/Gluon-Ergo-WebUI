import { createContext } from 'react';

export interface AccountType {
  avatar?: string;
  name?: string;
  msig_address: string;
  balance?: number;
}

export interface AppContextType {
  walletAssets: any;
  setWalletAssets: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialAppContext: AppContextType = {
  walletAssets: undefined,
  setWalletAssets: () => {},
};

const AppContext = createContext<AppContextType>(initialAppContext);

export default AppContext;
