import { getFissionPrice, getFusionPrice, getMintGoldRate, getMintRsvRate, getTransmuteGoldToRsvRate, getTransmuteRsvToGoldRate } from "@/blockchain/ergo/apiHelper";
import { ergsToNanoErgs, UIFriendlyValue } from "@/blockchain/ergo/walletUtils/utils";
import { Fission, Fusion, TransmuteFromGold, TransmuteToGold } from "@/components/constant";
import React from "react";
import { useState } from "react";

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
    const jsonData = `[]`;
    const initialData: Asset[] = JSON.parse(jsonData).map((asset: Asset) => ({
      ...asset,
      price: 0, // Set the initial price to 0
    }));

    const [assets, setAssets] = useState<Asset[]>(initialData);
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

    assets.map((asset, index) => {
      if (asset.assetName?.toLocaleLowerCase() == "neutron") {
        asset.assetName = "GAU";
      } else if (asset.assetName?.toLocaleLowerCase() == "proton") {
        asset.assetName = "GAUC";
      } else {
        asset.assetName = asset.assetName;
      }
    });
    return (
      <div>
        {assets.map((asset, index) => (
          <div key={index}>
            <p>
              {UIFriendlyValue(asset.price)} {asset.assetName}
            </p>
          </div>
        ))}
      </div>
    );
  };

  export default ConversionBox;
