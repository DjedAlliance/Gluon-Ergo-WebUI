import React, { useEffect, useState } from "react";
import {
  BANK_SINGLETON_TOKEN_ID,
  explorerClient,
  HODL_ERG_TOKEN_ID,
  MIN_MINER_FEE,
  MIN_TX_OPERATOR_FEE,
  precision,
  precisionBigInt,
  PROXY_ADDRESS,
  UIMultiplier,
} from "@/blockchain/ergo/constants";
import { OutputInfo } from "@/blockchain/ergo/explorerApi";
import { HodlBankContract } from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";
import {
  checkWalletConnection,
  getWalletConn,
  getWalletConnection,
  isErgoDappWalletConnected,
  signAndSubmitTx,
} from "@/blockchain/ergo/walletUtils/utils";
import { toast } from "react-toastify";
import {
  noti_option,
  noti_option_close,
} from "@/components/Notifications/Toast";
import {
  Amount,
  Box,
  ErgoAddress,
  OutputBuilder,
  SConstant,
  SLong,
  TransactionBuilder,
} from "@fleet-sdk/core";
import { hasDecimals, localStorageKeyExists } from "@/common/utils";
import { getShortLink, getWalletConfig } from "@/blockchain/ergo/wallet/utils";
import assert from "assert";
import { getTxReducedB64Safe } from "@/blockchain/ergo/ergopay/reducedTxn";
import ErgoPayWalletModal from "@/components/wallet/ErgoPayWalletModal";
import { outputInfoToErgoTransactionOutput } from "@/blockchain/ergo/walletUtils/utils";

const MintingHodlERG = () => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [mintAmount, setMintAmount] = useState<number>(0);
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

    explorerClient(isMainnet)
      .getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID(isMainnet))
      .then((res) => {
        setBankBox(res.data.items![0] as OutputInfo);
      })
      .catch((err) => {
        toast.dismiss();
        toast.warn("error getting bank box", noti_option_close("try-again"));
        setBankBox(null);
      });
  }, []);

  useEffect(() => {
    if (
      !isNaN(mintAmount) &&
      mintAmount >= 0.001 &&
      !hasDecimals(mintAmount * 1e9) &&
      bankBox
    ) {
      const mintAmountBigInt = BigInt(mintAmount * 1e9);
      const hodlBankContract = new HodlBankContract(bankBox);
      const ep = hodlBankContract.mintAmount(mintAmountBigInt);
      setErgPrice(Number((ep * precisionBigInt) / UIMultiplier) / precision);
    } else {
      toast.dismiss();
      toast.warn("error calculating price", noti_option_close("try-again"));
      setErgPrice(0);
    }
  }, [mintAmount]);

  const handleClick = async () => {
    let txOperatorFee = BigInt(MIN_TX_OPERATOR_FEE);
    let minerFee = BigInt(MIN_MINER_FEE);

    const walletConfig = getWalletConfig();

    if (localStorageKeyExists("txOperatorFee")) {
      txOperatorFee = BigInt(localStorage.getItem("txOperatorFee")!);
    }

    if (localStorageKeyExists("minerFee")) {
      minerFee = BigInt(localStorage.getItem("minerFee")!);
    }

    if (mintAmount < 0.001) {
      toast.dismiss();
      toast.warn("min 0.001 ERG", noti_option_close("try-again"));
      return;
    }
    if (hasDecimals(mintAmount * 1e9)) {
      toast.dismiss();
      toast.warn("max 9 decimals", noti_option_close("try-again"));
      return;
    }

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

    const mintAmountBigInt = BigInt(mintAmount * 1e9);
    const bankBoxRes = await explorerClient(
      isMainnet
    ).getApiV1BoxesUnspentBytokenidP1(BANK_SINGLETON_TOKEN_ID(isMainnet));
    const bankBox = bankBoxRes.data.items![0];
    const hodlBankContract = new HodlBankContract(bankBox);

    const nanoErgsPrice = hodlBankContract.mintAmount(mintAmountBigInt);

    const outBox = new OutputBuilder(
      nanoErgsPrice + txOperatorFee + minerFee,
      proxyAddress
    ).setAdditionalRegisters({
      R4: receiverErgoTree,
      R5: "0e20" + BANK_SINGLETON_TOKEN_ID(isMainnet),
      R6: "0e20" + HODL_ERG_TOKEN_ID(isMainnet),
      R7: SConstant(SLong(minBoxValue)),
      R8: SConstant(SLong(minerFee)),
      R9: SConstant(SLong(txOperatorFee)),
    });

    try {
      const unsignedTransaction = new TransactionBuilder(creationHeight)
        .from(inputs) // add inputs
        .to(outBox)
        .sendChangeTo(changeAddress) // set change address
        .payFee(minerFee) // set fee
        .build()
        .toEIP12Object();

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
        const url = await getShortLink(ergoPayTx, `Mint ${mintAmount} hodlERG3`, changeAddress, isMainnet);
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

  return (
    <>
      <div className="max-w-md mx-auto mb-10 lg:mb-0 font-inter">
        <h4 className="text-black text-xl font-medium">Minting hodlERG</h4>
        <p className="text-black my-3 min-h-[100px]">
          Mint hodlERG with no fees. You have the freedom to mint as much as you
          desire at the current price. it's important to note that the minting
          process does not directly affect the token's pricing dynamics.
        </p>

        <div className="flex bg-gray-200 shadow-lg justify-between rounded-md items-start h-full">
          <div className="flex flex-col w-full h-full">
            <input
              className="w-full border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none pl-4"
              placeholder="Amount"
              type="number"
              onChange={(event) =>
                setMintAmount(parseFloat(event.target.value))
              }
            />
            <span className="text-black font-medium text-md pl-4 mt-2">
              {`${ergPrice} ERG`}
            </span>
          </div>

          <button
            className="h-24 whitespace-nowrap focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300  focus:shadow-none font-medium rounded text-md px-5 py-2.5"
            onClick={handleClick}
          >
            MINT HODLERG
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

export default MintingHodlERG;
