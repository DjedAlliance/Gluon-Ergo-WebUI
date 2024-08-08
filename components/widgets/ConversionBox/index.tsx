import {
  getFissionPrice,
  getFusionPrice,
  getMintGoldRate,
  getMintRsvRate,
  getTransmuteGoldToRsvRate,
  getTransmuteRsvToGoldRate,
} from "@/blockchain/ergo/apiHelper";
import {
  ergsToNanoErgs,
  UIFriendlyValue,
} from "@/blockchain/ergo/walletUtils/utils";
import {
  Fission,
  Fusion,
  TransmuteFromGold,
  TransmuteToGold,
} from "@/components/constant";
import React, { useContext, useEffect } from "react";
import PlusIcon from "@/public/icons/add-square.svg";
import Image from "next/image";

import styles from "@/styles/TokenBox.module.css";
import AppContext from "@/context/AppContext";
import classNames from "classnames";

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
}: any) => {
  const { walletAssets, setWalletAssets, assets, setAssets } =
    useContext(AppContext);

  useEffect(() => {
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
        console.log("getting price");
        const response = await getPrice(isMainnet, input);
        console.log("response.data", response.data);
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

  const tokenWalletAssets = walletAssets.map(
    (item: any, index: number) => item
  );

  return (
    <div className={styles.tokenPurchaseForm}>
      {assets.map((asset: any, index: number) => {
        const matchedWalletAsset = tokenWalletAssets.find(
          (walletAsset: any) => walletAsset.tokenId === asset.id
        );
        return (
          <React.Fragment key={index}>
            <div className="input-group">
              <div className={styles.detailContainer}>
                <div className={styles.detailContainerRow}>
                  <label
                    htmlFor="payment-amount-static"
                    className={"text-sm text-graytext"}
                  >
                    {currentPage === Fusion ? "Pay" : "Receive"}
                  </label>
                  {currentPage ===
                    (Fusion || TransmuteFromGold || TransmuteToGold) && (
                    <div className={"text-sm flex"}>
                      <span>Balance:&nbsp;</span>
                      {matchedWalletAsset || assets ? (
                        <p className={styles.detailContainerActionLabel}>
                          {" "}
                          {UIFriendlyValue(
                            matchedWalletAsset?.amount ?? 0
                          )}{" "}
                          {asset.assetName}{" "}
                        </p>
                      ) : (
                        "-"
                      )}
                    </div>
                  )}
                </div>
                <div className={"flex px-3 items-center"}>
                  <input
                    type="number"
                    value={UIFriendlyValue(asset.price)}
                    className={"bg-transparent text-2xl text-graytext"}
                    disabled={true}
                  />
                  <p
                    id="payment-amount-static"
                    className={classNames(
                      "text-2xl",
                      styles.detailContainerCurrencyDisabled
                    )}
                  >
                    {(() => {
                      if (asset.assetName?.toLocaleLowerCase() === "neutron") {
                        asset.assetName = "GAU";
                      } else if (
                        asset.assetName?.toLocaleLowerCase() === "proton"
                      ) {
                        asset.assetName = "GAUC";
                      }
                      return asset.assetName;
                    })()}
                  </p>
                </div>
                {/* <div className={styles.detailContainerRow}>
                  <div className={styles.walletBalance}>
                    Balance:{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {UIFriendlyValue(asset.price)} {asset.assetName}
                    </a>
                  </div>
                </div> */}
              </div>
            </div>
            {index < assets.length - 1 && (
              <Image src={PlusIcon} alt="plus" width={28} height={28} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ConversionBox;
