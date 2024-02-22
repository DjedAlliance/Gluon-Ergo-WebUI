import React, { useEffect, useState } from "react";
import {
  EXPLORER_API_URL,
  explorerClient,
  PROXY_ADDRESS,
} from "@/blockchain/ergo/constants";
import {
  Configuration,
  DefaultApiFactory,
  OutputInfo,
} from "@/blockchain/ergo/explorerApi";
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
import {
  findTokenById,
  getShortLink,
  getWalletConfig,
} from "@/blockchain/ergo/wallet/utils";
import assert from "assert";
import { getTxReducedB64Safe } from "@/blockchain/ergo/ergopay/reducedTxn";
import ErgoPayWalletModal from "@/components/wallet/ErgoPayWalletModal";
import {
  outputInfoToErgoTransactionOutput,
  nanoErgsToErgs,
  ergsToNanoErgs,
} from "@/blockchain/ergo/walletUtils/utils";
import {
  UnsignedTxForFusion,
  getFusionPrice,
} from "@/blockchain/ergo/apiHelper";
import CardContainer from "@/components/Common/CardContainer";
import TokenInfo from "@/components/Common/TokenInfo";
import TokenPurchaseForm from "@/components/Common/TokenPurchaseForm";
import TokenContainer from "@/components/Common/TokenContainer";
import { Fusion as fusionTitle } from "./constant";

export const Fusion = () => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [ergForFusionAmount, setErgForFusionAmount] = useState<number>(0);
  const [bankBox, setBankBox] = useState<OutputInfo | null>(null);
  const [ergPrice, setErgPrice] = useState<number>(0);
  const [proxyAddress, setProxyAddress] = useState<string>("");

  const minBoxValue = BigInt(1000000);

  const [isModalErgoPayOpen, setIsModalErgoPayOpen] = useState<boolean>(false);
  const [ergoPayLink, setErgoPayLink] = useState<string>("");
  const [ergoPayTxId, setErgoPayTxId] = useState<string>("");
  const [explorerApiClient, setExplorerApiClient] = useState<any>(null);
  const [ergoAmountAvailable, setErgoAmountAvailable] = useState<any>(null);
  const [protonAmountAvailable, setProtonAmountAvailable] = useState<any>(null);
  const [neutronAmountAvailable, setNeutronAmountAvailable] = useState<any>(null);

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    setIsMainnet(isMainnet);
    setProxyAddress(PROXY_ADDRESS(isMainnet));
    const explorerConf = new Configuration({
      basePath: EXPLORER_API_URL(isMainnet),
    });

    const explorerClient = DefaultApiFactory(explorerConf);
    setExplorerApiClient(explorerClient);

    const walletConfig = getWalletConfig();
    if (walletConfig !== undefined) {
      explorerClient
        .getApiV1AddressesP1BalanceConfirmed(walletConfig.walletAddress[0])

        .then((res) => {
          const neutrons = findTokenById(
            res.data.tokens ?? [],
            "b444f19bf3ce453d50efebb1c6689d60823ffb11311f3aa11f7a9e0ff1e2bd05"
          );
          setNeutronAmountAvailable(neutrons?.amount);
          const protons = findTokenById(
            res.data.tokens ?? [],
            "0365bbb9b9f21ebb7ea0d3b0cf2b1c2745739e86199e72d4bb0c2d0438b36510"
          );
          setProtonAmountAvailable(protons?.amount);
          console.log(res.data.nanoErgs * 10 ** -9);
          setErgoAmountAvailable(nanoErgsToErgs(res.data.nanoErgs));
        });
    }
  }, []);

  const handleClick = async (amount: number) => {
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
    setErgForFusionAmount(ergsToNanoErgs(amount));
    try {
      const unsignedTransaction = await UnsignedTxForFusion(
        isMainnet,
        walletConfig.walletAddress[0] || "",
        ergsToNanoErgs(amount),
        true
      );

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
          `Erg amount for fusion: ${ergForFusionAmount}`,
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

      signAndSubmitTx(unsignedTransaction, ergo, txBuilding_noti, isMainnet);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.warn("issue building transaction", noti_option_close("try-again"));
      return;
    }
  };

  const tokenName = "Convert GAU and GAUC to ERG";
  const description = "";
  const logoUrl = "https://cryptologos.cc/logos/ergo-erg-logo.png?v=029"; // Replace with your actual logo path

  return (
    <>
      <CardContainer>
        <TokenContainer
          onPurchase={handleClick}
          tokenName={tokenName}
          description={description}
          logoUrl={logoUrl}
          baseCurrency="ERG"
          maxAmount={ergoAmountAvailable}
          isMainnet={isMainnet}
          currentPage={fusionTitle}
          maxProtonsAvailable={protonAmountAvailable}
          maxNeutronsAvailable={neutronAmountAvailable}
        />
      </CardContainer>
      {isModalErgoPayOpen && (
        <ErgoPayWalletModal
          isModalOpen={isModalErgoPayOpen}
          setIsModalOpen={setIsModalErgoPayOpen}
          ergoPayLink={ergoPayLink}
          txid={ergoPayTxId}
          isMainnet={isMainnet}
        ></ErgoPayWalletModal>
      )}
      ;
    </>
  );
};
