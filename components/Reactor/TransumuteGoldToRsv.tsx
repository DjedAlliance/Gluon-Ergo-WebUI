import React, { useEffect, useState } from "react";
import {
  EXPLORER_API_URL,
  explorerClient,
  GLUON_NEUTRON_ADDRESS,
  PROXY_ADDRESS,
} from "@/blockchain/ergo/constants";
import {
  Configuration,
  DefaultApiFactory,
  OutputInfo,
} from "@/blockchain/ergo/explorerApi";
import {
  UIFriendlyValue,
  checkWalletConnection,
  nanoErgsToErgs,
  signAndSubmitTx,
} from "@/blockchain/ergo/walletUtils/utils";
import { toast } from "react-toastify";
import {
  noti_option,
  noti_option_close,
} from "@/components/shared/Notifications/Toast";
import { Amount, Box, ErgoAddress } from "@fleet-sdk/core";
import {
  findTokenById,
  getShortLink,
  getWalletConfig,
} from "@/blockchain/ergo/wallet/utils";
import assert from "assert";
import { getTxReducedB64Safe } from "@/blockchain/ergo/ergopay/reducedTxn";
import ErgoPayWalletModal from "@/components/wallet/ErgoPayWalletModal";
import { outputInfoToErgoTransactionOutput } from "@/blockchain/ergo/walletUtils/utils";
import { UnsignedTxForTransmuteGoldToRsv } from "@/blockchain/ergo/apiHelper";
import TokenContainer from "../Common/TokenContainer";
import { TransmuteFromGold } from "../constant";
import TokenPurchaseForm from "../Common/TokenPurchaseForm";

const TransmuteGoldToRsv = () => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [proxyAddress, setProxyAddress] = useState<string>("");
  const [explorerApiClient, setExplorerApiClient] = useState<any>(null);
  const [rsvAmountAvailable, setRsvAmountAvailable] = useState<any>(null);

  const [isModalErgoPayOpen, setIsModalErgoPayOpen] = useState<boolean>(false);
  const [ergoPayLink, setErgoPayLink] = useState<string>("");
  const [ergoPayTxId, setErgoPayTxId] = useState<string>("");

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    setIsMainnet(isMainnet);
    setProxyAddress(PROXY_ADDRESS(isMainnet));
    const explorerConf = new Configuration({
      basePath: EXPLORER_API_URL(isMainnet),
    });
    const neutronTokenId = GLUON_NEUTRON_ADDRESS(isMainnet);

    const explorerClient = DefaultApiFactory(explorerConf);
    setExplorerApiClient(explorerClient);

    const walletConfig = getWalletConfig();
    if (walletConfig !== undefined) {
      explorerClient
        .getApiV1AddressesP1BalanceConfirmed(walletConfig.walletAddress[0])
        .then((res) => {
          const neutrons = findTokenById(res.data.tokens ?? [], neutronTokenId);
          console.log(neutrons?.amount);
          if (neutrons && neutrons.amount) {
            setRsvAmountAvailable(UIFriendlyValue(neutrons?.amount));
          }
        });
    }
  }, []);

  const handleClick = async (amount: number) => {
    console.log(amount);
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
      const unsignedTransaction = await UnsignedTxForTransmuteGoldToRsv(
        isMainnet,
        walletConfig.walletAddress[0] || "",
        amount,
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
          `Gold amount: ${amount}`,
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
  const tokenName = "Swap GAU stable coin for GAUC volatile coin";
  const description = "";
  const logoUrl = "https://cryptologos.cc/logos/ergo-erg-logo.png?v=029";

  return (
    <>
      <TokenContainer
        tokenName={tokenName}
        description={description}
        logoUrl={logoUrl}
        currentPage={TransmuteFromGold}
      >
        <TokenPurchaseForm
          onPurchase={handleClick}
          baseCurrency={"GAU"}
          maxAmount={rsvAmountAvailable}
          isMainnet={isMainnet}
          currentPage={TransmuteFromGold}
          maxProtonsAvailable={rsvAmountAvailable}
        />
      </TokenContainer>
      {isModalErgoPayOpen && (
        <ErgoPayWalletModal
          isModalOpen={isModalErgoPayOpen}
          setIsModalOpen={setIsModalErgoPayOpen}
          ergoPayLink={ergoPayLink}
          txid={ergoPayTxId}
          isMainnet={isMainnet}
        ></ErgoPayWalletModal>
      )}
    </>
  );
};
export default TransmuteGoldToRsv;
