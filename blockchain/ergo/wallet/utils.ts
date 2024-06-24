import { toast } from "react-toastify";
import { toaster_copy_text } from "@/components/shared/Notifications/Toast";
import { walletLocalStorage } from "@/components/wallet/ConnectWallet";
import axios from "axios";
import { NEXT_PUBLIC_NEST_API_URL } from "@/blockchain/ergo/constants";
import { TokenAmount } from "../explorerApi";

export function reduceAddress(address: string): string {
  return address!.slice(0, 5) + "..." + address!.slice(-4);
}

export const numberWithCommas = (number: number, decimal: number): string => {
  const amountWithDecimals = number * 10 ** -decimal;
  return amountWithDecimals.toLocaleString("en");
};

export const handleCopyText = (e: string) => {
  toast.success(e, toaster_copy_text);
};

export const getWalletConfig = () => {
  return localStorage.getItem("walletConfig")
    ? (JSON.parse(localStorage.getItem("walletConfig")!) as walletLocalStorage)
    : undefined;
};

export async function rateLimitedCoinGeckoERGUSD(): Promise<
  () => Promise<number>
> {
  let timestamp = 0;
  let price = 0;

  async function getPrice(): Promise<number> {
    const ts = Date.now();

    if (ts >= timestamp) {
      timestamp = ts + 30000;
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ergo&vs_currencies=USD"
        );
        price = response.data.ergo.usd;
        return response.data.ergo.usd;
      } catch (error) {
        // Handle error appropriately
        console.error("Error fetching ERG to USD conversion:", error);
        price = 0.0;
        return 0.0;
      }
    } else {
      return price;
    }
  }
  return getPrice;
}

export async function getShortLink(
  base64Txn: string,
  message: string,
  changeAddress: string,
  isMainnet: boolean
): Promise<any> {
  try {
    const res = await axios.get(
      `${NEXT_PUBLIC_NEST_API_URL(
        isMainnet
      )}/ergopay/generateShortLink/${base64Txn}`
    );
    const shortCode = res.data.shortCode;
    if (shortCode === "null") {
      return undefined;
    }
    const strippedUrl = NEXT_PUBLIC_NEST_API_URL(isMainnet).replace(
      /^https?:\/\//,
      ""
    );
    return `ergopay://${strippedUrl}/ergopay/reducedTxLink/${shortCode}/${encodeURIComponent(
      message
    )}/${changeAddress}`;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export const findTokenById = (
  tokenArray: TokenAmount[],
  tokenId: string
): TokenAmount | undefined => {
  return tokenArray.find((token) => token.tokenId === tokenId);
};
