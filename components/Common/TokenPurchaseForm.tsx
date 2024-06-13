import React, { useState } from "react";

import styles from '@/styles/TokenBox.module.css';
import {
  Fission,
  Fusion,
  TransmuteFromGold,
  TransmuteToGold,
} from "../constant";
// import "./TokenPurchaseForm.css";

import ArrowDownIcon from '@/public/icons/arrow-down.svg';
import ConversionBox from "../widgets/ConversionBox";

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
  const [isError, setIsError] = useState(false);
  const [isErrorInFusion, setIsErrorInFusion] = useState(false);
  // const [protonsPerTransaction, setProtonsPerTransaction] = useState(0);
  // const [neutronsPerTransaction, setNeutronsPerTransaction] = useState(0);
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
    <>
      {currentPage !== Fusion ? (
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className={styles.detailContainer}>
              <div className={styles.detailContainerRow}>
                <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Pay</label>
                {/* Use a span or a read-only input to display the currency */}
                <div className={styles.detailContainerActionLabelRow}>
                  <p className={styles.detailContainerActionLabel}> Bal: {maxAmount} GAU </p>
                  <p className={styles.detailContainerActionLabelMax}> Max</p>
                </div>
              </div>
              <div className={styles.detailContainerRow}>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  className={styles.detailContainerInput}
                />
                <p id="payment-amount-static" className={styles.detailContainerCurrency}>
                  {currencyShown}
                </p>
              </div>
              <div className={styles.detailContainerRow}>
                <div className={styles.walletBalance}>
                  Wallet Balance:{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setAmount(maxAmount);
                    }}
                  >
                    {maxAmount} {currencyShown}
                  </a>
                </div>
              </div>
            </div>
          </div>
          {isError && amount > 0 && (
            <p style={{ color: "red" }}>
              Amount exceeds the maximum limit of {maxAmount}.
            </p>
          )}
          {isError && amount <= 0 && (
            <p style={{ color: "red" }}>Amount must be greater than zero.</p>
          )}
          {/* {isError && isErrorInFusion && (
            <p style={{ color: "red" }}> Insufficient balance</p>
          )} */}
          {/* <Image src={ArrowDownIcon} alt="arrow down" width="28" height="28" /> */}
          <img src={ArrowDownIcon} alt="arrow down" width="28" height="28" />
          <div className="input-group">
            <div className={styles.detailContainer}>
              <div className={styles.detailContainerRow}>
                <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Receive</label>
                <ConversionBox
                  inputValue={amount}
                  isMainnet={isMainnet}
                  baseCurrency={currencyShown}
                  currentPage={currentPage}
                />
              </div>
            </div>
          </div>
          <button type="submit" className={styles.convertNowButton} disabled={isError}>
            Convert Now
          </button>
        </form>
      ) : (
        <form className="token-purchase-form" onSubmit={handleSubmit}>
          <div className="input-group">
          <div className={styles.detailContainer}>
              <div className={styles.detailContainerRow}>
                <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Receive</label>
                {/* Use a span or a read-only input to display the currency */}
                <div className={styles.detailContainerActionLabelRow}>
                  <p className={styles.detailContainerActionLabel}> Bal: {maxAmount} GAU </p>
                  <p className={styles.detailContainerActionLabelMax}> Max</p>
                </div>
              </div>
              <div className={styles.detailContainerRow}>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  className={styles.detailContainerInput}
                />
                <p id="payment-amount-static" className={styles.detailContainerCurrency}>
                  {currencyShown}
                </p>
              </div>
              <div className={styles.detailContainerRow}>
                <div className={styles.walletBalance}>
                  Wallet Balance:{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setAmount(maxAmount);
                    }}
                  >
                    {maxAmount} {currencyShown}
                  </a>
                </div>
              </div>
            </div>
          </div>
          {isError && amount > 0 && (
            <p style={{ color: "red" }}>
              Amount exceeds the maximum limit of {maxAmount}.
            </p>
          )}
          {isError && amount <= 0 && (
            <p style={{ color: "red" }}>Amount must be greater than zero.</p>
          )}
          <div className="conversion-info">
            Wallet Balance
            <br />
            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setAmount(maxAmount);
                }}
              >
                {maxAmount} {currencyShown}
              </a>
              <br />
              {maxNeutronsAvailable} GAU
              <br />
              {maxProtonsAvailable} GAUC
            </div>
            <div>
              <br />
              Pay:{" "}
              <ConversionBox
                inputValue={amount}
                isMainnet={isMainnet}
                baseCurrency={currencyShown}
                currentPage={currentPage}
              />
            </div>
          </div>
          <button type="submit" className={styles.convertNowButton} disabled={isError}>
            Convert Now
          </button>
        </form>
      )}
    </>
  );
};

export default TokenPurchaseForm;
