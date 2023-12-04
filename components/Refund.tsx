import React, { useEffect, useState } from "react";
import {
  getWalletConn,
  outputInfoToErgoTransactionOutput,
} from "@/blockchain/ergo/walletUtils/utils";
import { toast } from "react-toastify";
import {
  noti_option,
  noti_option_close,
  txSubmmited,
} from "@/components/Notifications/Toast";
import { isHex } from "@fleet-sdk/common";
import { SignedTransaction } from "@nautilus-js/eip12-types";
import {
  Amount,
  Box,
  ErgoAddress,
  FEE_CONTRACT,
  OutputBuilder,
  TokenAmount,
  TransactionBuilder,
} from "@fleet-sdk/core";
import { TransactionInfo } from "@/blockchain/ergo/explorerApi";
import { Asset, ErgoTransaction, ErgoTransactionOutput } from "@/types/nodeApi";
import { getUnConfirmedOrConfirmedTx } from "@/blockchain/ergo/apiHelper";
const Refund = () => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [proxyAddressForm, setProxyAddressForm] = React.useState<string>("");
  const [transactionIDForm, setTxIdForm] = React.useState<string>("");

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    setIsMainnet(isMainnet);
  }, []);

  const handleClick = async () => {
    if (!(await getWalletConn())) {
      toast.dismiss();
      toast.warn(
        "unable to get wallet connection",
        noti_option_close("try-again")
      );
      return;
    }

    const txId: string = transactionIDForm.replace(/\s/g, "");

    if (txId.length === 0) {
      toast.warn("Enter TxId", noti_option_close("try-again"));
      return;
    }

    if (!isHex(txId) || txId.length !== 64) {
      toast.warn("Invalid TxId", noti_option_close("try-again"));
      return;
    }

    const proxyAddress = proxyAddressForm.replace(/\s/g, "");

    if (proxyAddress.length === 0) {
      toast.warn("Enter Proxy Address", noti_option_close("try-again"));
      return;
    }

    if (!ErgoAddress.validate(proxyAddress)) {
      toast.warn("Invalid Proxy Address", noti_option_close("try-again"));
      return;
    }

    const proxyErgoTree = ErgoAddress.fromBase58(proxyAddress).ergoTree;
    const minerFee = 1100000;

    const txBuilding_noti = toast.loading("Please wait...", noti_option);

    const transactionInfo: TransactionInfo | ErgoTransaction =
      await getUnConfirmedOrConfirmedTx(txId, isMainnet);

    if (Object.keys(transactionInfo).length === 0) {
      toast.dismiss();
      toast.warn("Invalid TxId", noti_option_close("try-again"));
      return;
    }

    let invalidRegisterCounter = 0;

    const proxyFilter = (box: ErgoTransactionOutput) => {
      const validRegister = Object.keys(box.additionalRegisters).length >= 2;
      if (!validRegister && box.ergoTree == proxyErgoTree) {
        invalidRegisterCounter++;
      }
      return validRegister && box.ergoTree === proxyErgoTree;
    };

    const proxyOutputs: ErgoTransactionOutput[] =
      "blockId" in transactionInfo
        ? (transactionInfo as TransactionInfo)
            .outputs!.map(outputInfoToErgoTransactionOutput)
            .filter(proxyFilter)
        : (transactionInfo as ErgoTransaction).outputs.filter(proxyFilter);

    if (invalidRegisterCounter > 0) {
      toast.dismiss();
      toast.warn("invalid registers", noti_option_close("try-again"));
      return;
    }

    if (proxyOutputs.length === 0) {
      toast.dismiss();
      toast.warn("incorrect transaction", noti_option_close("try-again"));
      return;
    }

    const changeAddress = await ergo!.get_change_address();
    const creationHeight = await ergo!.get_current_height();
    let changeErgoTree = ErgoAddress.fromBase58(String(changeAddress)).ergoTree;
    let receiverErgoTree = changeErgoTree.substring(2);
    let spentCounter = 0;

    const receiverOutputs = proxyOutputs.filter((box) => {
      const isBoxSpend = box.spentTransactionId;
      if (
        isBoxSpend &&
        box.ergoTree !== changeErgoTree &&
        box.ergoTree !== FEE_CONTRACT
      ) {
        spentCounter++;
      }
      return box.additionalRegisters.R4! === receiverErgoTree && !isBoxSpend;
    });

    if (receiverOutputs.length === 0) {
      toast.dismiss();
      if (spentCounter > 0) {
        toast.warn("Box is spent!", noti_option_close("try-again"));
      }
      toast.warn(
        "please ensure correct address is connected!",
        noti_option_close("try-again")
      );
      return;
    }

    let walletInputSum = 0;
    const inputs: Box<Amount>[] = [];
    const proxyInputsWithTokens: Box<Amount>[] = [];
    const outputs: OutputBuilder[] = [];
    const changeTokens: Asset[] = [];

    receiverOutputs.forEach((box) => {
      if (box.assets.length > 0) {
        proxyInputsWithTokens.push(box as unknown as Box<Amount>);
      }
      inputs.push(box as unknown as Box<Amount>);
    });

    console.log("inputs: ", inputs);

    walletInputSum += minerFee;

    if (walletInputSum > 0) {
      const walletInputs: Box<Amount>[] = (await ergo!.get_utxos()).sort(
        (a, b) => {
          return BigInt(a.value) > BigInt(b.value)
            ? -1
            : BigInt(a.value) < BigInt(b.value)
            ? 1
            : 0;
        }
      ); // sorts inputs in descending order

      let currentSum = BigInt(0);

      for (let i = 0; i < walletInputs.length; i++) {
        currentSum += BigInt(walletInputs[i].value);
        walletInputs[i].assets.forEach((t) =>
          changeTokens.push({
            tokenId: t.tokenId,
            amount: parseInt(t.amount.toString()),
          })
        );
        inputs.push(walletInputs[i]);
        if (currentSum >= walletInputSum) {
          break;
        }
      }
    }

    try {
      const inputTotalValue = inputs.reduce(
        (acc: bigint, curr) => BigInt(curr.value) + acc,
        BigInt(0)
      );
      const proxyInputTotalValue = proxyInputsWithTokens.reduce(
        (acc: bigint, curr) => BigInt(curr.value) + acc,
        BigInt(0)
      );

      const tokens: TokenAmount<Amount>[] = [];

      inputs.forEach((box) =>
        box.assets.forEach((t) =>
          tokens.push({ tokenId: t.tokenId, amount: t.amount })
        )
      );
      const out =
        tokens.length > 0
          ? new OutputBuilder(
              inputTotalValue - BigInt(minerFee),
              changeAddress
            ).addTokens(tokens)
          : new OutputBuilder(
              inputTotalValue - BigInt(minerFee),
              changeAddress
            );
      outputs.push(out);

      proxyInputsWithTokens.forEach((box) => {
        const out = new OutputBuilder(box.value, changeAddress).addTokens(
          box.assets.map((t) => ({ tokenId: t.tokenId, amount: t.amount }))
        );
        outputs.push(out);
      });

      const outputTotalValue = outputs.reduce(
        (acc: bigint, curr) => BigInt(curr.value) + acc,
        BigInt(0)
      );

      const diff =
        outputTotalValue +
        BigInt(minerFee) -
        (inputTotalValue + proxyInputTotalValue);

      if (diff > 0) {
        toast.dismiss();
        toast.warn(
          `Wallet needs ${parseInt(diff.toString()) * 10 ** -9} more ERG`,
          noti_option_close("try-again")
        );
        return;
      }

      const unsignedTransaction = new TransactionBuilder(creationHeight)
        .from(inputs.concat(proxyInputsWithTokens)) // add inputs
        .to(outputs)
        .sendChangeTo(changeAddress) // set change address
        .payMinFee()
        .build()
        .toEIP12Object();

      let signedTx: SignedTransaction;

      try {
        signedTx = await ergo!.sign_tx(unsignedTransaction);

        toast.update(txBuilding_noti, {
          render: "Sign your transaction",
          type: "success",
          isLoading: false,
          // @ts-ignore
          autoClose: true,
        });
      } catch (error) {
        console.log(error);
        // @ts-ignore
        if (error!.info === "Loading context data...") {
          toast.warn(
            "contract error, ensure correct address connected",
            noti_option_close("try-again")
          );
          return;
        }
        // @ts-ignore
        if ("code" in error) {
          toast.dismiss();
          toast.warn("canceled by user", noti_option_close("try-again"));
          return;
        }
        throw error;
      }

      const hash = await ergo!.submit_tx(signedTx);
      console.log("tx hash:", hash);
      toast.dismiss();
      txSubmmited(hash, isMainnet);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.warn(
        "tx failed, please contact support",
        noti_option_close("try-again")
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-center py-8 lg:py-12 min-h-[70vh] font-inter">
        <div className="max-w-md mx-auto">
          <h2 className="text-black font-bold text-3xl mb-5 lg:mb-8">Refund</h2>
          <div className="my-3">
            <label
              htmlFor="Proxy-address"
              className="text-black text-base font-medium"
            >
              Proxy address
            </label>
            <input
              className="w-full px-0 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none"
              placeholder="Proxy address"
              type="text"
              onChange={(event) => setProxyAddressForm(event.target.value)}
            />
          </div>

          <div className="mt-3 mb-6">
            <label
              htmlFor="Proxy-address"
              className="text-black text-base font-medium"
            >
              Transaction ID
            </label>
            <input
              className="w-full px-0 border-b-2 border-l-0 border-r-0 border-t-0 border-gray-300 bg-transparent text-gray-500 font-medium text-md h-14 focus:outline-none focus:ring-0 focus:border-primary focus-within:outline-none focus-within:shadow-none focus:shadow-none"
              placeholder="Enter the Transaction ID"
              type="text"
              onChange={(event) => setTxIdForm(event.target.value)}
            />
          </div>
          <button
            className="w-full focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md  px-4 py-3"
            onClick={handleClick}
          >
            Get Refund
          </button>
        </div>
      </div>
    </>
  );
};

export default Refund;
