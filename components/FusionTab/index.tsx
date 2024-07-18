import ArrowDownIcon from "@/public/icons/arrow-down.svg";
import ConversionBox from "../widgets/ConversionBox";
import Image from "next/image";

import styles from "@/styles/TokenBox.module.css";
import { FC, useEffect, useState } from "react";
import FeesAndSlippage from "../shared/FeesAndSlippage";
import { rateLimitedCoinGeckoERGUSD } from "@/blockchain/ergo/wallet/utils";
import ErrorComponent from "../shared/ErrorComponent";

interface FusionTabProps {
  handleSubmit: any;
  baseCurrency?: string;
  maxAmount?: any;
  isMainnet: boolean;
  amount?: any;
  handleAmountChange?: any;
  currencyShown?: any;
  isError?: any;
  setAmount?: any;
  currentPage?: string;
  maxProtonsAvailable?: number;
  maxNeutronsAvailable?: number;
  setAmountFusion?: any;
  amountFusion?: any;
}

const FusionTab: FC<FusionTabProps> = ({
  handleSubmit,
  maxAmount,
  isMainnet,
  amount,
  handleAmountChange,
  currencyShown,
  isError,
  setAmount,
  maxNeutronsAvailable,
  maxProtonsAvailable,
  currentPage,
  setAmountFusion,
  amountFusion,
}) => {
  const [exchangeRate, setExchangeRate] = useState(0);

  useEffect(() => {
    const fetchRate = async () => {
      const getPrice = await rateLimitedCoinGeckoERGUSD();
      const rate = await getPrice();
      setExchangeRate(rate);
    };
    fetchRate();
  }, []);

  const convertedAmount = amount * exchangeRate;
  return (
    <form className={styles.tokenPurchaseForm} onSubmit={handleSubmit}>
      <ConversionBox
        inputValue={amount}
        isMainnet={isMainnet}
        baseCurrency={currencyShown}
        currentPage={currentPage}
        setAmountFusion
        amountFusion
        handleAmountChange
      />

      <Image src={ArrowDownIcon} alt="arrow down" width="28" height="28" />
      <div className="input-group">
        <div className={styles.detailContainer}>
          <div className={styles.detailContainerRow}>
            <label
              htmlFor="payment-amount-static"
              className={"text-sm text-graytext"}
            >
              Receive
            </label>
            <div className={styles.detailContainerActionLabelRow}>
              <p className={"text-sm text-graytext"}>
                {" "}
                Balance: {maxAmount} ERG{" "}
              </p>
            </div>
          </div>
          <div className={"flex px-3 items-center"}>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className={
                "bg-transparent text-2xl text-white focus:outline-none"
              }
            />
            <p id="payment-amount-static" className={"text-2xl"}>
              ERG
            </p>
          </div>
          <div className={styles.detailContainerRow}>
            <div className={styles.walletBalance}>
              Balance:{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setAmount(maxAmount);
                }}
              >
                ${convertedAmount.toFixed(2)}
              </a>
            </div>
          </div>
        </div>
      </div>
      <ErrorComponent isError={isError} amount={amount} maxAmount={maxAmount} />

      <FeesAndSlippage />
      <button
        type="submit"
        className={
          "bg-gluongold w-full flex justify-center py-2 rounded-md font-semibold tracking-wider text-purplemist"
        }
        disabled={isError}
      >
        Initiate Fusion
      </button>
    </form>
  );
};

export default FusionTab;
