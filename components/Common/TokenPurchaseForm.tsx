import React, { useState } from "react";

import {
  Fission,
  Fusion,
  TransmuteFromGold,
  TransmuteToGold,
} from "../constant";
// import "./TokenPurchaseForm.css";

import FusionTab from "../FusionTab";
import FissionTab from "../FissionTab";
import BetaDecayTabs from "../BetaDecayTabs";

interface TokenPurchaseFormProps {
  onPurchase: (amount: number) => Promise<void>;
  baseCurrency?: string;
  maxAmount?: number;
  isMainnet: boolean;
  currentPage?: string;
  maxProtonsAvailable?: number;
  maxNeutronsAvailable?: number;
}

const TokenPurchaseForm: React.FC<TokenPurchaseFormProps> = ({
  onPurchase,
  baseCurrency,
  maxAmount = 0,
  isMainnet,
  currentPage,
  maxProtonsAvailable,
  maxNeutronsAvailable,
}) => {
  const [amount, setAmount] = useState(0);
  const [amountFusion, setAmountFusion] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isErrorInFusion, setIsErrorInFusion] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= maxAmount) {
      onPurchase(amount);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value;

    if (inputVal === "") {
      e.target.value = "0";
      setAmount(0);
      return;
    }
    const isFloat = /\d+\.\d+/.test(e.target.value);
    let input = parseFloat(e.target.value);
    if (Number.isNaN(parseFloat(e.target.value))) {
      e.target.value = "";
    }

    if (Number.isInteger(input) || isFloat) {
      let newInput = !Number.isNaN(input)
        ? replaceInput(parseFloat(e.target.value))
        : input;
      if (parseFloat(e.target.value) >= 1) {
        e.target.value = e.target.value.replace(/^0+/, "");
      }

      setAmount(input);
      setIsError(input > maxAmount || input <= 0 || isErrorInFusion);
    }
  };

  const replaceInput = (input: number) => {
    let stringedInput = input.toString();

    // Remove leading '0's only if the string does not represent a decimal number less than 1
    if (stringedInput.startsWith("0") && !stringedInput.startsWith("0.")) {
      stringedInput = stringedInput.replace(/^0+/, "");
    }
    return parseFloat(stringedInput);
  };

  const currencyShown = baseCurrency ?? `ERG`;

  return (
    <div className="">
      {(currentPage === TransmuteFromGold ||
        currentPage === TransmuteToGold) && (
        <BetaDecayTabs
          handleSubmit={handleSubmit}
          maxAmount={maxAmount}
          isMainnet={isMainnet}
          amount={amount}
          handleAmountChange={handleAmountChange}
          currencyShown={currencyShown}
          isError={isError}
          setAmount={setAmount}
          maxNeutronsAvailable={maxNeutronsAvailable}
          maxProtonsAvailable={maxProtonsAvailable}
          currentPage={currentPage}
        />
      )}
      {currentPage === Fission && (
        <FissionTab
          handleSubmit={handleSubmit}
          maxAmount={maxAmount}
          isMainnet={isMainnet}
          amount={amount}
          handleAmountChange={handleAmountChange}
          currencyShown={currencyShown}
          isError={isError}
          setAmount={setAmount}
          currentPage={currentPage}
        />
      )}
      {currentPage === Fusion && (
        <FusionTab
          handleSubmit={handleSubmit}
          maxAmount={maxAmount}
          isMainnet={isMainnet}
          amount={amount}
          handleAmountChange={handleAmountChange}
          currencyShown={currencyShown}
          isError={isError}
          setAmount={setAmount}
          setAmountFusion={setAmountFusion}
          amountFusion={amountFusion}
          maxNeutronsAvailable={maxNeutronsAvailable}
          maxProtonsAvailable={maxProtonsAvailable}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default TokenPurchaseForm;
