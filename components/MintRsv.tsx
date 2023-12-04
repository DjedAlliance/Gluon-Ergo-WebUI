import React, { useEffect, useState } from "react";
import { explorerClient, PROXY_ADDRESS } from "@/blockchain/ergo/constants";
import { OutputInfo } from "@/blockchain/ergo/explorerApi";
import {
  checkWalletConnection,
  signAndSubmitTx,
} from "@/blockchain/ergo/walletUtils/utils";
import { toast } from "react-toastify";
import {
  noti_option,
  noti_option_close,
} from "@/components/Notifications/Toast";
import { Amount, Box, ErgoAddress } from "@fleet-sdk/core";
import { getShortLink, getWalletConfig } from "@/blockchain/ergo/wallet/utils";
import assert from "assert";
import { getTxReducedB64Safe } from "@/blockchain/ergo/ergopay/reducedTxn";
import ErgoPayWalletModal from "@/components/wallet/ErgoPayWalletModal";
import { outputInfoToErgoTransactionOutput } from "@/blockchain/ergo/walletUtils/utils";
import { UnsignedTxForMintRsv } from "@/blockchain/ergo/apiHelper";

const MintRsv = () => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [ergForMintRsvAmount, setErgForMintRsvAmount] = useState<number>(0);
  const [bankBox, setBankBox] = useState<OutputInfo | null>(null);
  const [ergPrice, setErgPrice] = useState<number>(0);
  const [proxyAddress, setProxyAddress] = useState<string>("");

  const minBoxValue = BigInt(1000000);

  const [isModalErgoPayOpen, setIsModalErgoPayOpen] = useState<boolean>(false);
  const [ergoPayLink, setErgoPayLink] = useState<string>("");
  const [ergoPayTxId, setErgoPayTxId] = useState<string>("");

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    setIsMainnet(isMainnet);
    setProxyAddress(PROXY_ADDRESS(isMainnet));
  }, []);

  const handleClick = async () => {
    const walletConfig = getWalletConfig();

    if (!(await checkWalletConnection(walletConfig))) {
      toast.dismiss();
      toast.warn("please connect wallet", noti_option_close("try-again"));
      return;
    }

    assert(walletConfig !== undefined);

    const isErgoPay = walletConfig.walletName === "ergopay";

    const txBuilding_noti = toast.loading("Please wait...", noti_option);

    const changeAddress = walletConfig.walletAddress[0];
    const creationHeight = (await explorerClient(isMainnet).getApiV1Blocks())
      .data.items![0].height;

    const inputs = isErgoPay
      ? (
          await explorerClient(
            isMainnet
          ).getApiV1BoxesUnspentUnconfirmedByaddressP1(changeAddress)
        )
          .data!.filter((item) => item.address === changeAddress)
          .map(outputInfoToErgoTransactionOutput)
          .map((item) => item as unknown as Box<Amount>)
      : await ergo!.get_utxos();

    let receiverErgoTree = ErgoAddress.fromBase58(
      String(changeAddress)
    ).ergoTree;

    receiverErgoTree = receiverErgoTree.substring(2);

    try {
      const unsignedTransaction = await UnsignedTxForMintRsv(
        isMainnet,
        localStorage.getItem("walletAddress") || "",
        ergForMintRsvAmount,
        true
      );

      console.log(unsignedTransaction);

      if (isErgoPay) {
        const [txId, ergoPayTx] = await getTxReducedB64Safe(
          unsignedTransaction,
          explorerClient(isMainnet)
        );
        if (ergoPayTx === null) {
          toast.dismiss();
          toast.warn(
            "issue getting ergopay transaction",
            noti_option_close("try-again")
          );
          return;
        }
        const url = await getShortLink(
          ergoPayTx,
          `Erg amount for MintRsv: ${ergForMintRsvAmount}`,
          changeAddress,
          isMainnet
        );
        if (!url) {
          toast.dismiss();
          toast.warn(
            "issue getting ergopay transaction",
            noti_option_close("try-again")
          );
          return;
        }
        console.log(url);
        setErgoPayTxId(txId!);
        setErgoPayLink(url);
        window.document.documentElement.classList.add("overflow-hidden");
        setIsModalErgoPayOpen(true);
        toast.dismiss();
        return;
      }

      unsignedTransaction.forEach((element: any) => {
        signAndSubmitTx(element, ergo, txBuilding_noti, isMainnet);
      });
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.warn("issue building transaction", noti_option_close("try-again"));
      return;
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mb-10 lg:mb-0 font-inter">
        <h4 className="text-black text-xl font-medium">
          Erg to Gold and Gold Reserve
        </h4>
        <p className="text-black my-3 min-h-[100px]">
          Mint hodlERG with no fees. You have the freedom to mint as much as you
          desire at the current price. it is important to note that the minting
          process does not directly affect the tokens pricing dynamics.
        </p>

        <div className="flex bg-gray-200 shadow-lg justify-between rounded-md items-start h-full">
          <div className="flex flex-col w-full h-full">
            <input
              className="w-full border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none pl-4"
              placeholder="Amount"
              type="number"
              onChange={(event) =>
                setErgForMintRsvAmount(parseFloat(event.target.value))
              }
            />
          </div>

          <button
            className="h-24 whitespace-nowrap focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300  focus:shadow-none font-medium rounded text-md px-5 py-2.5"
            onClick={handleClick}
          >
            MintRsv ERG TO RSV AND GOLDy
          </button>
          {isModalErgoPayOpen && (
            <ErgoPayWalletModal
              isModalOpen={isModalErgoPayOpen}
              setIsModalOpen={setIsModalErgoPayOpen}
              ergoPayLink={ergoPayLink}
              txid={ergoPayTxId}
              isMainnet={isMainnet}
            ></ErgoPayWalletModal>
          )}
        </div>
      </div>
    </>
  );
};

export default MintRsv;
