import ArrowDownIcon from "@/public/icons/arrow-down.svg";
import ConversionBox from "../widgets/ConversionBox";
import Image from "next/image";

import styles from "@/styles/TokenBox.module.css";
import { FC, useContext, useEffect, useState } from "react";
import { TransmuteFromGold } from "../constant";
import FeesAndSlippage from "../shared/FeesAndSlippage";
import AppContext from "@/context/AppContext";
import { UIFriendlyValue } from "@/blockchain/ergo/walletUtils/utils";
import ErrorComponent from "../shared/ErrorComponent";
import { getNeutronId, getProtonId } from "@/common/constants";

interface BetaDecayTabsProps {
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
  maxProtonsAvailable?: number;
  maxNeutronsAvailable?: number;
  tokenBalance?: any;
}

const BetaDecayTabs: FC<BetaDecayTabsProps> = ({
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
  const { walletAssets, setWalletAssets, assets, setAssets } =
    useContext(AppContext);
  const GAUId = getNeutronId(isMainnet);
  const GAUCId = getProtonId(isMainnet);

  const [tokenBalance, setTokenBalance] = useState<any>();

  useEffect(() => {
    const calculateTokenBalance = () => {
      const tokenWalletAssets = walletAssets.map((item: any) => item);
      let balance;
      if (currencyShown === "GAUC") {
        balance = tokenWalletAssets.find(
          (item: any) => item.tokenId === GAUCId
        )?.amount;
      } else {
        balance = tokenWalletAssets.find(
          (item: any) => item.tokenId === GAUId
        )?.amount;
      }
      console.log(balance);

      setTokenBalance(balance);
    };

    calculateTokenBalance();
  }, [currencyShown, tokenBalance]);

  return (
    <form
      onSubmit={handleSubmit}
      className={"flex flex-col items-center space-y-4"}
    >
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
            <div className={"text-sm flex space-x-2"}>
              <p className={styles.detailContainerActionLabel}>
                {" "}
                Balance: {maxAmount ?? 0} {currencyShown}{" "}
              </p>
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
              className={
                "bg-transparent border-b-0 focus:outline-none text-2xl"
              }
            />
            <p id="payment-amount-static" className={"text-2xl"}>
              {currencyShown}
            </p>
          </div>
          <!--
          <div className={styles.detailContainerRow}>
            <div className={styles.walletBalance}>
              Balance:{" "}
              {maxAmount ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setAmount(maxAmount);
                  }}
                >
                  {maxAmount} {currencyShown}
                </a>
              ) : (
                "-"
              )}
            </div>
          </div>
          -->
        </div>
      </div>
      <ErrorComponent
        isError={isError}
        amount={amount}
        maxAmount={UIFriendlyValue(tokenBalance)}
      />
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
        {currentPage === TransmuteFromGold
          ? "Initiate Transmutation from Gold"
          : "Initiate Transmutation to Gold"}
      </button>
    </form>
  );
};

export default BetaDecayTabs;
