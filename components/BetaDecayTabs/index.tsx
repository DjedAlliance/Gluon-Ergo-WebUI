import ArrowDownIcon from '@/public/icons/arrow-down.svg';
import ConversionBox from "../widgets/ConversionBox";
import Image from 'next/image';

import styles from '@/styles/TokenBox.module.css';
import { FC, useContext, useEffect, useState } from 'react';
import { TransmuteFromGold } from '../constant';
import FeesAndSlippage from '../shared/FeesAndSlippage';
import AppContext from '@/context/AppContext';
import { UIFriendlyValue } from '@/blockchain/ergo/walletUtils/utils';
import ErrorComponent from '../shared/ErrorComponent';

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


const BetaDecayTabs:FC<BetaDecayTabsProps> = ({
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
    const { walletAssets, setWalletAssets, assets, setAssets } = useContext(AppContext);
    const GAUId = "1271660a9f311c316cc14318e2ed9a57378096e2c07ca96ee4631583a271b51a";
    const GAUCId = "902b52a00de3cdaa1eca9f209c1b13554b3929b17fe82a7d7663a90676b6a263";

    const [tokenBalance, setTokenBalance] = useState<any>();

    useEffect(() => {
      const calculateTokenBalance = () => {
        const tokenWalletAssets = walletAssets.map((item: any) => item);
        let balance;
        if (currencyShown === 'GAUC') {
            balance = tokenWalletAssets.find(
                (item: any) => item.tokenId === GAUCId
              )?.amount;
        } else {
            balance = tokenWalletAssets.find(
                (item: any) => item.tokenId === GAUId
              )?.amount;
        }

        setTokenBalance(balance);
      };

      calculateTokenBalance();
    }, [currencyShown]);

    return (
        <form onSubmit={handleSubmit} className={styles.tokenPurchaseForm}>
            <div className="input-group">
            <div className={styles.detailContainer}>
                <div className={styles.detailContainerRow}>
                <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>Pay</label>
                <div className={styles.detailContainerActionLabelRow}>
                Bal:&nbsp;
                { tokenBalance > 0 ? (
                        <p className={styles.detailContainerActionLabel}> {UIFriendlyValue(tokenBalance)} {currencyShown} </p>
                    ) : (
                        '-'
                    )}
                    <p className={styles.detailContainerActionLabelMax} onClick={() => setAmount(UIFriendlyValue(tokenBalance))}> Max</p>
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
            <ErrorComponent isError={isError} amount={amount} maxAmount={UIFriendlyValue(tokenBalance)} />
            <Image src={ArrowDownIcon} alt="arrow down" width="28" height="28" />
            <ConversionBox
                inputValue={amount}
                isMainnet={isMainnet}
                baseCurrency={currencyShown}
                currentPage={currentPage}
            />
            <FeesAndSlippage />

            <button type="submit" className={styles.convertNowButton} disabled={isError}>
                { currentPage ===  TransmuteFromGold ? 'Initiate Beta Decay +' : 'Initiate Beta Decay -' }
            </button>
      </form>
    )
}

export default BetaDecayTabs
