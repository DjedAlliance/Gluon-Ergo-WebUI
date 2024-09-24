import ArrowDownIcon from "@/public/icons/arrow-down.svg";
import ConversionBox from "../widgets/ConversionBox";
import Image from "next/image";

import styles from "@/styles/TokenBox.module.css";
import { FC, useEffect, useState } from "react";
import FeesAndSlippage from "../shared/FeesAndSlippage";
import { rateLimitedCoinGeckoERGUSD } from "@/blockchain/ergo/wallet/utils";
import ErrorComponent from "../shared/ErrorComponent";
import { ergsToNanoErgs } from "@/blockchain/ergo/walletUtils/utils";
import { getFusionPrice } from "@/blockchain/ergo/apiHelper";
import { getNeutronId, getProtonId } from "@/common/constants";

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
  setIsError?: any;
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
  setIsError,
}) => {
  const [exchangeRate, setExchangeRate] = useState(0);
  const [protonAmountRequested, setProtonAmountRequested] = useState(0);
  const [neutronAmountRequested, setNeutronAmountRequested] = useState(0);
  useEffect(() => {
    const fetchRate = async () => {
      const getPrice = await rateLimitedCoinGeckoERGUSD();
      const rate = await getPrice();
      setExchangeRate(rate);

      const inputValue = ergsToNanoErgs(amount);
      const price = await getFusionPrice(isMainnet, inputValue);
      const neutronId = getNeutronId(isMainnet);
      const protonId = getProtonId(isMainnet);
      // Find the object for neutron
      const neutron = price.data.find(
        (item: { id: string }) => item.id === neutronId
      );
      // Extract the price
      const neutronPrice = neutron ? neutron.price : null;

      // Find the object for proton
      const proton = price.data.find(
        (item: { id: string }) => item.id === protonId
      );
      // Extract the price
      const protonPrice = proton ? proton.price : null;

      setProtonAmountRequested(protonPrice * 10 ** -9);
      setNeutronAmountRequested(neutronPrice * 10 ** -9);
    };
    fetchRate();
  }, [amount, isMainnet]);

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
            {/* Use a span or a read-only input to display the currency */}
            {/* <div className={"text-sm flex space-x-2"}>
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
            </div> */}
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
          {/* <div className={styles.detailContainerRow}>
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
          </div> */}
        </div>
      </div>
      <ErrorComponent
        isError={isError}
        amount={amount}
        maxAmount={maxAmount}
        isFusion={true}
        maxNeutronsAvailable={maxNeutronsAvailable}
        maxProtonsAvailable={maxProtonsAvailable}
        ProtonsAmountForFusion={protonAmountRequested}
        NeutronsAmountForFusion={neutronAmountRequested}
        setIsError={setIsError}
      />

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
