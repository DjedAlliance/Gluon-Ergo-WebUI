import { getFissionPrice, getFusionPrice, getMintGoldRate, getMintRsvRate, getTransmuteGoldToRsvRate, getTransmuteRsvToGoldRate } from "@/blockchain/ergo/apiHelper";
import { ergsToNanoErgs, UIFriendlyValue } from "@/blockchain/ergo/walletUtils/utils";
import { Fission, Fusion, TransmuteFromGold, TransmuteToGold } from "@/components/constant";
import React, { useContext } from "react";
import { useState } from "react";
import PlusIcon from '@/public/icons/add-square.svg';
import Image from 'next/image';


import styles from '@/styles/TokenBox.module.css';
import AppContext from "@/context/AppContext";

interface Asset {
    assetName?: string;
    id?: string;
    price: number;
  }

  export const ConversionBox = ({
    inputValue,
    isMainnet,
    baseCurrency,
    currentPage,
    setAmount,
    setAmountFusion,
    amountFusion,
    handleAmountChange
  }: any) => {
    // const jsonData = `[]`;
    // const initialData: Asset[] = JSON.parse(jsonData).map((asset: Asset) => ({
    //   ...asset,
    //   price: 0, // Set the initial price to 0
    // }));

    const { walletAssets, setWalletAssets, assets, setAssets } = useContext(AppContext);

    // const [assets, setAssets] = useState<Asset[]>(initialData);
    React.useEffect(() => {
      let getPrice: any;
      let input: any;
      switch (currentPage) {
        case TransmuteToGold:
          input = inputValue;
          getPrice = getTransmuteRsvToGoldRate;
          break;
        case TransmuteFromGold:
          input = inputValue;
          getPrice = getTransmuteGoldToRsvRate;
          break;
        case Fission:
          input = ergsToNanoErgs(inputValue);
          getPrice = getFissionPrice;
          break;
        case Fusion:
          input = ergsToNanoErgs(inputValue);
          getPrice = getFusionPrice;
          break;
        case "MintGold":
          input = ergsToNanoErgs(inputValue);
          getPrice = getMintGoldRate;
          break;
        case "MintRsv":
          input = ergsToNanoErgs(inputValue);
          getPrice = getMintRsvRate;
          break;
        default:
          getPrice = getFissionPrice;
          break;
      }
      const fetchData = async () => {
        try {
          const response = await getPrice(isMainnet, input);
          console.log('response.data', response.data)
          setAssets(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      // Call the API immediately and then set an interval
      fetchData();
      const intervalId = setInterval(fetchData, 10000); // 10 second interval

      // Clear the interval on component unmount
      return () => clearInterval(intervalId);
    }, [inputValue, isMainnet, baseCurrency, currentPage]); // Dependency array includes 'erg', so the effect reruns when 'erg' changes

    assets.map((asset: any, index: number) => {
      if (asset.assetName?.toLocaleLowerCase() == "neutron") {
        asset.assetName = "GAU";
      } else if (asset.assetName?.toLocaleLowerCase() == "proton") {
        asset.assetName = "GAUC";
      } else {
        asset.assetName = asset.assetName;
      }
    });

    const tokenWalletAssets = walletAssets.map((item: any, index: number) => item);

    // console.log('tokenWalletAssets', tokenWalletAssets)

    return (
      <div className={styles.tokenPurchaseForm}>
        {assets.map((asset: any, index: number) => {
          const matchedWalletAsset = tokenWalletAssets.find((walletAsset: any) => walletAsset.tokenId === asset.id);
          return (
            <React.Fragment key={index}>
              <div className="input-group">
                <div className={styles.detailContainer}>
                  <div className={styles.detailContainerRow}>
                    <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>
                      {currentPage === 'Fusion' ? 'Pay' : 'Receive'}
                    </label>
                    {currentPage === ('Fusion' || 'Transmute from Gold' || 'Transmute to Gold') && (
                      <div className={styles.detailContainerActionLabelRow}>
                        <span>Bal:&nbsp;</span>
                        { matchedWalletAsset || assets ? (
                          <p className={styles.detailContainerActionLabel}> {UIFriendlyValue(matchedWalletAsset.amount)} {asset.assetName} </p>
                        ) : (
                          '-'
                        )}
                      </div>
                    )}

                  </div>
                  <div className={styles.detailContainerRow}>
                    <input
                      type="number"
                      // value={asset.price}
                      value={UIFriendlyValue(asset.price)}
                      className={styles.detailContainerInput}
                      // disabled={currentPage === 'Fusion' ? false : true}
                      disabled={true}
                    />
                    <p id="payment-amount-static" className={`${styles.detailContainerCurrency} ${styles.detailContainerCurrencyDisabled}`}>
                      {(() => {
                        if (asset.assetName?.toLocaleLowerCase() === "neutron") {
                          asset.assetName = "GAU";
                        } else if (asset.assetName?.toLocaleLowerCase() === "proton") {
                          asset.assetName = "GAUC";
                        }
                        return asset.assetName;
                      })()}
                    </p>
                  </div>
                  <div className={styles.detailContainerRow}>
                    <div className={styles.walletBalance}>
                      Wallet Balance:{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {UIFriendlyValue(asset.price)} {asset.assetName}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {index < assets.length - 1 && (
                <div style={{ textAlign: 'center', margin: '10px 0' }}>
                  <Image src={PlusIcon} alt="plus" width={20} height={20} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
  //     <div className={styles.tokenPurchaseForm}>
  //   {assets.map((asset, index) => {
  //     const matchedWalletAsset = tokenWalletAssets.find((walletAsset: any) => walletAsset.id === asset.tokenId);
  //     console.log('matchedWalletAsset', matchedWalletAsset)
  //     return (
  //       <React.Fragment key={index}>
  //         <div className="input-group">
  //           <div className={styles.detailContainer}>
  //             <div className={styles.detailContainerRow}>
  //               <label htmlFor="payment-amount-static" className={styles.detailContainerActionLabel}>
  //                 {currentPage === 'Fusion' ? 'Pay' : 'Receive'}
  //               </label>
  //               {currentPage === 'Fusion' && (
  //                 <div className={styles.detailContainerActionLabelRow}>
  //                   Bal: {' '}
  //                   { matchedWalletAsset ? (
  //                     <p className={styles.detailContainerActionLabel}> {UIFriendlyValue(matchedWalletAsset.amount)} {matchedWalletAsset.name} </p>
  //                   ) : (
  //                     '-'
  //                   )}
  //                   {/* <p className={styles.detailContainerActionLabelMax} onClick={() => setAmountFusion(UIFriendlyValue(matchedWalletAsset.amount))}> Max</p> */}
  //                 </div>
  //               )}
  //             </div>
  //             <div className={styles.detailContainerRow}>
  //               <input
  //                 type="number"
  //                 value={UIFriendlyValue(matchedWalletAsset.amount)}
  //                 className={styles.detailContainerInput}
  //                 disabled={currentPage === 'Fusion' ? false : true}
  //                 // onChange={currentPage === 'Fusion' && handleAmountChange}
  //               />
  //               <p id="payment-amount-static" className={`${styles.detailContainerCurrency} ${styles.detailContainerCurrencyDisabled}`}>
  //                 {(() => {
  //                   if (asset.assetName?.toLocaleLowerCase() === "neutron") {
  //                     asset.assetName = "GAU";
  //                   } else if (asset.assetName?.toLocaleLowerCase() === "proton") {
  //                     asset.assetName = "GAUC";
  //                   }
  //                   return asset.assetName;
  //                 })()}
  //               </p>
  //             </div>
  //             <div className={styles.detailContainerRow}>
  //               <div className={styles.walletBalance}>
  //                 Wallet Balance:{" "}
  //                 <a
  //                   href="#"
  //                   onClick={(e) => {
  //                     e.preventDefault();
  //                   }}
  //                 >
  //                   {UIFriendlyValue(matchedWalletAsset?.amount || asset.price)} {matchedWalletAsset?.name || asset.assetName}
  //                 </a>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         {index < assets.length - 1 && (
  //           <div style={{ textAlign: 'center', margin: '10px 0' }}>
  //             <Image src={PlusIcon} alt="plus" width={20} height={20} />
  //           </div>
  //         )}
  //       </React.Fragment>
  //     );
  //   })}
  // </div>
    );

  };

  export default ConversionBox;
