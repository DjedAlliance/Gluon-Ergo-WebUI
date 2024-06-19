import ArrowDownIcon from '@/public/icons/arrow-down.svg';
import PlusIcon from '@/public/icons/add-square.svg';
import ConversionBox from "../widgets/ConversionBox";
import Image from 'next/image';

import styles from '@/styles/TokenBox.module.css';
import { FC, useEffect, useState } from 'react';
import FeesAndSlippage from '../shared/FeesAndSlippage';
import { rateLimitedCoinGeckoERGUSD } from '@/blockchain/ergo/wallet/utils';
import ErrorComponent from '../shared/ErrorComponent';
import { UIFriendlyValue } from '@/blockchain/ergo/walletUtils/utils';

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
    maxProtonsAvailable?: number;
    maxNeutronsAvailable?: number;
  }

const FissionTab:FC<FissionTabProps> = ({
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
            <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Pay</label>
            {/* Use a span or a read-only input to display the currency */}
            <div className={styles.detailContainerActionLabelRow}>
              <p className={styles.detailContainerActionLabel}> Bal: {maxAmount} {currencyShown} </p>
              <p className={styles.detailContainerActionLabelMax} onClick={() => setAmount(maxAmount)}> Max</p>
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

      <button type="submit" className={styles.convertNowButton} disabled={isError}>
        Initiate Fission
      </button>
    </form>
  )
}

export default FissionTab;
