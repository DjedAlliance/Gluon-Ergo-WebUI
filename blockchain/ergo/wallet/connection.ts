import { walletLocalStorage } from '@/components/wallet/ConnectWallet';
import React from 'react';
import { toast } from 'react-toastify';
import { noti_option_close } from '@/components/Notifications/Toast';
import assert from 'assert';
import { ErgoAddress, Network } from '@fleet-sdk/core';


export class WrongNetworkException extends Error {}



export async function connectNautilusWallet(setWalletConnected: React.Dispatch<React.SetStateAction<boolean | undefined>>, walletName: string | undefined, setWalletName: React.Dispatch<React.SetStateAction<string | undefined>>, setWalletAddress: React.Dispatch<React.SetStateAction<string[] | undefined>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, isMainnet: boolean): Promise<void> {
  setIsLoading(true);

  if(!ergoConnector){
    setIsLoading(false);
    toast.warn('Click me to get nautilus!', noti_option_close);
    return;
  }

  if(!(ergoConnector!.nautilus)){
    setIsLoading(false);
    toast.warn('Click me to get nautilus!', noti_option_close);
    return;
  }

  disconnectWallet(setWalletConnected, walletName, setWalletName, setWalletAddress);

  try {
    const res: boolean = await ergoConnector!.nautilus!.connect();
    if(res){
      assert(ergo !== undefined)

      const address: string = await ergo.get_change_address();
      if (
          ErgoAddress.getNetworkType(address) !==
          (isMainnet ? Network.Mainnet : Network.Testnet)
      ) {
        throw new WrongNetworkException();
      }

      const addresses: string[] = await ergo.get_used_addresses();
      addresses.unshift(address) // adds change address to the beginning of the array of used wallet addresses
      const uniqueAddresses = [...new Set(addresses)]; // removes any duplicates in case the change address is already in the array of used addresses

      const walletStorageConf: walletLocalStorage = {
        walletConnected: true,
        walletName: 'nautilus',
        walletAddress: uniqueAddresses
      }

      localStorage.setItem("walletConfig", JSON.stringify(walletStorageConf));
      setWalletConnected(true);
      setWalletName('nautilus');
      setWalletAddress(uniqueAddresses);

      window.document.documentElement.classList.remove(
          'overflow-hidden',
      );

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  } catch (error) {
    if (error instanceof WrongNetworkException) {
      console.log('wrong network!');
      disconnectWallet(setWalletConnected, walletName, setWalletName, setWalletAddress);
      setIsLoading(false);
      throw error;
    } else {
      // Handle other errors
    }
  }
}

export function connectErgoPayWallet(address: string, setWalletConnected: React.Dispatch<React.SetStateAction<boolean | undefined>>, walletName: string | undefined, setWalletName: React.Dispatch<React.SetStateAction<string | undefined>>, setWalletAddress: React.Dispatch<React.SetStateAction<string[] | undefined>>, isMainnet: boolean): void {

  disconnectWallet(setWalletConnected, walletName, setWalletName, setWalletAddress);

  const walletStorageConf: walletLocalStorage = {
    walletConnected: true,
    walletName: 'ergopay',
    walletAddress: [address]
  }

  localStorage.setItem("walletConfig", JSON.stringify(walletStorageConf));
  setWalletConnected(true);
  setWalletName('ergopay');
  setWalletAddress([address]);

  window.document.documentElement.classList.remove(
    'overflow-hidden',
  );

}



export function disconnectWallet(setWalletConnected: React.Dispatch<React.SetStateAction<boolean | undefined>>, walletName: string | undefined, setWalletName: React.Dispatch<React.SetStateAction<string | undefined>>, setWalletAddress: React.Dispatch<React.SetStateAction<string[] | undefined>>): void {
  localStorage.removeItem('walletConfig');
  sessionStorage.removeItem('uuid');

  setWalletConnected(false);
  setWalletName(undefined);
  setWalletAddress(undefined);

  if(walletName && walletName === 'nautilus'){
    ergoConnector!.nautilus!.disconnect();
  }

}