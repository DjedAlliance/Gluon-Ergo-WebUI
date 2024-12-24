import { walletLocalStorage } from '@/components/wallet/ConnectWallet';
import React from 'react';
import { toast } from 'react-toastify';
import { noti_option_close } from '@/components/shared/Notifications/Toast';
import assert from 'assert';
import { ErgoAddress, Network } from '@fleet-sdk/core';


export class WrongNetworkException extends Error { }



export async function connectNautilusWallet(setWalletConnected: React.Dispatch<React.SetStateAction<boolean | undefined>>, walletName: string | undefined, setWalletName: React.Dispatch<React.SetStateAction<string | undefined>>, setWalletAddress: React.Dispatch<React.SetStateAction<string[] | undefined>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, isMainnet: boolean): Promise<void> {
  setIsLoading(true);

  if (!ergoConnector) {
    setIsLoading(false);
    toast.warn('Click me to get nautilus!', noti_option_close);
    return;
  }

  if (!(ergoConnector!.nautilus)) {
    setIsLoading(false);
    toast.warn('Click me to get nautilus!', noti_option_close);
    return;
  }

  disconnectWallet(setWalletConnected, walletName, setWalletName, setWalletAddress);

  try {
    const res: boolean = await ergoConnector!.nautilus!.connect();
    if (res) {
      assert(ergo !== undefined)

      const address: string = await ergo.get_change_address();

      try {
        if (
          ErgoAddress.getNetworkType(address) !==
          (isMainnet ? Network.Mainnet : Network.Testnet)
        ) {
          throw new WrongNetworkException();
        }

        // Retrieve used addresses and handle the case where it might not return anything
        let addresses: string[] = [];
        try {
          addresses = await ergo.get_used_addresses() || [];
        } catch (err) {
          console.log("Error fetching used addresses:", err);
        }

        console.log("addresses", addresses);

        // Ensure the change address is added, and deduplicate the list
        addresses.unshift(address);
        const uniqueAddresses = [...new Set(addresses)];

        // Wallet configuration object
        const walletStorageConf: walletLocalStorage = {
          walletConnected: true,
          walletName: 'nautilus',
          walletAddress: uniqueAddresses.length > 0 ? uniqueAddresses : [address] // Default to change_address if empty
        };

        // Save the wallet configuration to localStorage
        localStorage.setItem("walletConfig", JSON.stringify(walletStorageConf));

        // Update the state
        setWalletConnected(true);
        setWalletName('nautilus');
        setWalletAddress(uniqueAddresses);
      } catch (error) {
        console.log("There is some issue with the addresses:", error);
      }


      // removes any duplicates in case the change address is already in the array of used addresses



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

  if (walletName && walletName === 'nautilus') {
    ergoConnector!.nautilus!.disconnect();
  }

}
