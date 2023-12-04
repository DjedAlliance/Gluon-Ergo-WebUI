import React from 'react';
import { ErgoDexService } from '@/components/wallet/ergoDexService';
import { getTotalBalance } from '../ergopay/walletUtils';
import {TokenInfo} from "../explorerApi";


interface Token {
    tokenId: string;
    amount: number;
    decimals: number;
    name: string;
    tokenType: string;
    usdValue: number;
}

interface TokenBalance {
  tokenId: string;
  balance: string;
}


const getERGUSD = (erg: number, usdValue: number): number => {
  try {
    return parseFloat((erg * usdValue).toFixed(2));
  } catch (error) {
    // Handle error appropriately
    console.error('Error fetching ERG to USD conversion:', error);
    return 0.0;
  }
};

const fetchTokenMetadata = async (addresses: string[], explorerApiClient: any, usdOracle: number): Promise<Token[]> => {

  const balances: TokenBalance[][] = await Promise.all(addresses.map(async address => (await getTotalBalance(explorerApiClient, address)) as unknown as TokenBalance[]));
  const consolidatedBalance = balances.reduce((acc, curr) => {
    acc.push(...curr);
    return acc; // Added return statement
  }, []);

  const walletTokenBalance = consolidatedBalance.filter(
    (asset) => asset.tokenId !== 'ERG',
  );


  const ergoDexService = new ErgoDexService();
  const tokenErgPrice = await ergoDexService.getTokenRates();

  return await Promise.all(
    walletTokenBalance.map(async (asset) => {

      const tokenInfo: TokenInfo = (await explorerApiClient.getApiV1TokensP1(asset.tokenId)).data;

      if (Object.keys(tokenInfo).length === 0) {
        return {} as Token;
      }
      const potentialTokenERGValue = tokenErgPrice[asset.tokenId];
      const tokenERGValue = potentialTokenERGValue
        ? potentialTokenERGValue.erg
        : 0;
      const totalTokenERGValue =
        parseFloat(asset.balance) * 10 ** -tokenInfo.decimals! * tokenERGValue;
      const tokenUSDValue = getERGUSD(
        totalTokenERGValue,
          usdOracle,
      );

      return {
        tokenId: asset.tokenId,
        amount: parseFloat(asset.balance),
        decimals: tokenInfo.decimals,
        name: tokenInfo.name,
        tokenType: tokenInfo.type,
        usdValue: tokenUSDValue,
      } as Token;
    }),
  );
};

export async function syncErgBalance(adddress: string[], explorerClient: any, usdOracle: number, setErgBalance: React.Dispatch<React.SetStateAction<string>>, setErgUSDValue: React.Dispatch<React.SetStateAction<string>>): Promise<void> {

  const balances = await Promise.all(adddress.map(async (address: string) => { return BigInt((await explorerClient.getApiV1AddressesP1BalanceConfirmed(address)).data.nanoErgs); }));
  const totalBalance = balances.reduce((acc, curr) => acc + curr, BigInt(0));

  setErgBalance(totalBalance.toString());

  const erg = parseInt(totalBalance.toString()) * 10 ** -9;
  const ergUSD = getERGUSD(erg, usdOracle).toFixed(2);

  setErgUSDValue(ergUSD)

}

export async function syncAssetBalance(addresses: string[], explorerApiClient: any, usdOracle: number, setWalletAssets: React.Dispatch<React.SetStateAction<Token[]>>): Promise<void> {
      const walletAssets = await fetchTokenMetadata(addresses, explorerApiClient, usdOracle);
      setWalletAssets(walletAssets);
}