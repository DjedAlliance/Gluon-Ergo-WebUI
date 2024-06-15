import ArrowDownIcon from '@/public/icons/arrow-down.svg';
import ConversionBox from "../widgets/ConversionBox";
import Image from 'next/image';

import styles from '@/styles/TokenBox.module.css';
import { FC } from 'react';
import { TransmuteFromGold } from '../constant';
import FeesAndSlippage from '../shared/FeesAndSlippage';

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
  }


const BetaDecayTabs:FC<BetaDecayTabsProps> = ({
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
    return (
        <form onSubmit={handleSubmit} className={styles.tokenPurchaseForm}>
            <div className="input-group">
            <div className={styles.detailContainer}>
                <div className={styles.detailContainerRow}>
                <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Pay</label>
                {/* Use a span or a read-only input to display the currency */}
                <div className={styles.detailContainerActionLabelRow}>
                Bal: {' '}
                { maxAmount ? (
                        <p className={styles.detailContainerActionLabel}> {maxAmount} {currencyShown} </p>
                    ) : (
                        '-'
                    )}
                    {/* <p className={styles.detailContainerActionLabelMax}> Max</p> */}
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
                    { maxAmount ? (
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
            <Image src={ArrowDownIcon} alt="arrow down" width="28" height="28" />
            <div className="input-group">
                <div className={styles.detailContainer}>
                    <div className={styles.detailContainerRow}>
                        <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Receive</label>
                        {/* Use a span or a read-only input to display the currency */}
                        <div className={styles.detailContainerActionLabelRow}>
                            Bal: {' '}
                            { maxAmount ? (
                                <p className={styles.detailContainerActionLabel}> {maxAmount} {currencyShown} </p>
                            ) : (
                                '-'
                            )}
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
                            {currencyShown === 'GAU' ? 'GAUC' : 'GAU'}
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
                            {maxAmount} {currencyShown === 'GAU' ? 'GAUC' : 'GAU'}
                        </a>
                    </div>
                    </div>
                </div>
            </div>
            <FeesAndSlippage />
            <ConversionBox
                    inputValue={amount}
                    isMainnet={isMainnet}
                    baseCurrency={currencyShown}
                    currentPage={currentPage}
                />
            <button type="submit" className={styles.convertNowButton} disabled={isError}>
                { currentPage ===  TransmuteFromGold ? 'Initiate Beta Decay +' : 'Initiate Beta Decay -' }
            </button>
      </form>
    )
}

export default BetaDecayTabs
