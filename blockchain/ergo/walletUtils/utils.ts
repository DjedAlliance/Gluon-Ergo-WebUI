import {
  installNautilus,
  noti_option_close,
  txSubmmited,
} from "@/components/Notifications/Toast";
import { Id, toast } from "react-toastify";
import { SignedTransaction } from "@nautilus-js/eip12-types";
import { walletLocalStorage } from "@/components/wallet/ConnectWallet";
import {
  MOutputInfo,
  OutputInfo,
  RegisterType,
} from "@/blockchain/ergo/explorerApi";
import { ErgoTransactionOutput, Registers } from "@/types/nodeApi";

export const isErgoDappWalletConnected = async () => {
  if ((window as any).ergoConnector) {
    if ((window as any).ergoConnector.nautilus) {
      return (await (
        window as any
      ).ergoConnector.nautilus.isConnected()) as boolean;
    }
  }
  return false;
};

export const checkWalletConnection = async (
  walletConfig: walletLocalStorage | undefined
) => {
  return walletConfig
    ? walletConfig.walletName === "ergopay"
      ? true
      : await isErgoDappWalletConnected()
    : await isErgoDappWalletConnected();
};

export const getWalletConnection = async () => {
  if ((window as any).ergoConnector) {
    if ((window as any).ergoConnector.nautilus) {
      // check if Nautilus Wallet is available
      return await (window as any).ergoConnector.nautilus.connect();
    } else {
      return false;
    }
  }
  toast.warn("Click me to install Nautilus Ergo Wallet", installNautilus);
  return false;
};

export const getWalletConn = async () => {
  const walletConnection = await getWalletConnection();

  if (!walletConnection) {
    toast.dismiss();
    toast.warn("please connect wallet", noti_option_close("try-again"));
    return false;
  }
  return true;
};

export const signAndSubmitTx = async (
  unsignedTransaction: any,
  ergo: any,
  txBuilding_noti: Id,
  isMainnet: boolean
) => {
  let signedTransaction: SignedTransaction;

  try {
    signedTransaction = await ergo!.sign_tx(unsignedTransaction);

    toast.update(txBuilding_noti, {
      render: "Sign your transaction",
      type: "success",
      isLoading: false,
      autoClose: false,
    });
  } catch (error) {
    console.log(error);
    //@ts-ignore
    if ("code" in error) {
      toast.dismiss();
      toast.warn("canceled by user", noti_option_close("try-again"));
      return;
    }
    throw error;
  }

  const hash = await ergo!.submit_tx(signedTransaction);
  console.log("tx hash:", hash);
  toast.dismiss();
  txSubmmited(hash, isMainnet);
};

export function outputInfoToErgoTransactionOutput(
  output: OutputInfo | MOutputInfo
): ErgoTransactionOutput {
  return {
    boxId: output.boxId,
    value: output.value,
    ergoTree: output.ergoTree,
    creationHeight: output.creationHeight,
    assets: output.assets!.map((token) => ({
      tokenId: token.tokenId,
      amount: token.amount,
    })),
    additionalRegisters: (
      Object.keys(output.additionalRegisters) as RegisterType[]
    ).reduce(
      (
        obj: Partial<Record<RegisterType, string>>,
        key: RegisterType
      ): Registers => {
        if (output.additionalRegisters[key]) {
          obj[key] = output.additionalRegisters[key]?.serializedValue;
        }
        return obj;
      },
      {} as Partial<Record<RegisterType, string>>
    ),
    transactionId: output.transactionId,
    index: output.index,
    spentTransactionId: output.spentTransactionId,
  };
}

export const removeBackslashes = (input: string) => {
  try {
    const jsonObject = JSON.parse(input);
    return JSON.stringify(jsonObject, null, 2); // The '2' here pretty-prints the output with an indentation of 2 spaces
  } catch (error) {
    console.error("Error parsing the input string:", error);
    return "";
  }
};
