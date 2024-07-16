import ArrowDownIcon from "@/public/icons/arrow-down.svg";
import ConversionBox from "../widgets/ConversionBox";
import Image from "next/image";

import styles from "@/styles/TokenBox.module.css";
import { FC, useEffect, useState } from "react";
import FeesAndSlippage from "../shared/FeesAndSlippage";
import { rateLimitedCoinGeckoERGUSD } from "@/blockchain/ergo/wallet/utils";
import ErrorComponent from "../shared/ErrorComponent";

interface FissionTabProps {
  handleSubmit: any;
  baseCurrency?: string;
  maxAmount?: number;
  isMainnet: boolean;
  amount?: any;
  handleAmountChange?: any;
  currencyShown?: any;
  isError?: any;
  setAmount?: any;
  currentPage?: string;
}

const FissionTab: FC<FissionTabProps> = ({
  handleSubmit,
  maxAmount,
  isMainnet,
  amount,
  handleAmountChange,
  currencyShown,
  isError,
  setAmount,
  currentPage,
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
    <form onSubmit={handleSubmit} className={styles.tokenPurchaseForm}>
      <div className="input-group">
        <div className={styles.detailContainer}>
          <div className={styles.detailContainerRow}>
            <label
              htmlFor="payment-amount-static"
              className={"text-sm text-graytext"}
            >
              Pay
            </label>
            {/* Use a span or a read-only input to display the currency */}
            <div className={"text-sm flex"}>
              <p
                className={"bg-gluongold/50 px-2 py-0.5 rounded-lg"}
                onClick={() => setAmount(maxAmount)}
              >
                {" "}
                Max
              </p>
            </div>
          </div>
          <div className={"flex items-center px-3"}>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className={"bg-transparent text-2xl focus:outline-none"}
            />
            <p id="payment-amount-static" className={"text-2xl"}>
              {currencyShown}
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
      <Image src={ArrowDownIcon} alt="arrow down" width="28" height="28" />
      <ConversionBox
        inputValue={amount}
        isMainnet={isMainnet}
        baseCurrency={currencyShown}
        currentPage={currentPage}
      />
      <FeesAndSlippage />

      <button
        type="submit"
        className={
          "bg-gluongold w-full flex justify-center py-2 rounded-md font-semibold tracking-wider text-purplemist"
        }
        disabled={isError}
      >
        Initiate Fission
      </button>
    </form>
  );
};

export default FissionTab;
