import ArrowDownIcon from '@/public/icons/arrow-down.svg';
import PlusIcon from '@/public/icons/add-square.svg';
import ConversionBox from "../widgets/ConversionBox";
import Image from 'next/image';

import styles from '@/styles/TokenBox.module.css';
import { FC, useEffect, useState } from 'react';
import FeesAndSlippage from '../shared/FeesAndSlippage';
import { rateLimitedCoinGeckoERGUSD } from '@/blockchain/ergo/wallet/utils';

interface FusionTabProps {
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
        <div className="input-group">
          <div className={styles.detailContainer}>
            <div className={styles.detailContainerRow}>
              <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Pay</label>
              <div className={styles.detailContainerActionLabelRow}>
                <p className={styles.detailContainerActionLabel}>
                  Bal: {' '}
                  { maxAmount ? (
                      <p className={styles.detailContainerActionLabel}> {maxAmount} {maxNeutronsAvailable} GAU </p>
                  ) : (
                      '-'
                  )}
                </p>
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
                GAU
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
                  {maxAmount} GAU
                </a>
              </div>
            </div>
          </div>
        </div>
        <Image src={PlusIcon} alt="plus" width="20" height="20" />
        <div className="input-group">
          <div className={styles.detailContainer}>
              <div className={styles.detailContainerRow}>
                <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Pay</label>
                <div className={styles.detailContainerActionLabelRow}>
                    Bal: {' '}
                    { maxAmount ? (
                        <p className={styles.detailContainerActionLabel}> {maxAmount} {maxProtonsAvailable} GAUC </p>
                    ) : (
                        '-'
                    )}
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
                  GAUC
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
                  {maxAmount} GAUC
                </a>
              </div>
            </div>
          </div>
        </div>

        <Image src={ArrowDownIcon} alt="arrow down" width="28" height="28" />
        <div className="input-group">
          <div className={styles.detailContainer}>
            <div className={styles.detailContainerRow}>
              <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Receive</label>
              <div className={styles.detailContainerActionLabelRow}>
                <p className={styles.detailContainerActionLabel}> Bal: {maxAmount} ERG </p>
              </div>
            </div>
            <div className={styles.detailContainerRow}>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className={styles.detailContainerInput}
                disabled={true}
              />
              <p id="payment-amount-static" className={`${styles.detailContainerCurrency} ${styles.detailContainerCurrencyDisabled}`}>
                ERG
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
        {isError && amount > 0 && (
          <p style={{ color: "red" }}>
            Amount exceeds the maximum limit of {maxAmount}.
          </p>
        )}
        {isError && amount <= 0 && (
          <p style={{ color: "red" }}>Amount must be greater than zero.</p>
        )}
        <ConversionBox
          inputValue={amount}
          isMainnet={isMainnet}
          baseCurrency={currencyShown}
          currentPage={currentPage}
        />
        <FeesAndSlippage />
        <button type="submit" className={styles.convertNowButton} disabled={isError}>
          Initiate Fusion
        </button>
      </form>
    )
}

export default FusionTab;