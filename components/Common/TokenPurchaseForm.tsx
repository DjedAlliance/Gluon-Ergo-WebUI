import React, { useState } from "react";
import {
  getFissionPrice,
  getFusionPrice,
  getMintGoldRate,
  getMintRsvRate,
  getTransmuteGoldToRsvRate,
  getTransmuteRsvToGoldRate,
} from "@/blockchain/ergo/apiHelper";
import {
  nanoErgsToErgs,
  ergsToNanoErgs,
} from "@/blockchain/ergo/walletUtils/utils";
import {
  Fission,
  Fusion,
  TransmuteFromGold,
  TransmuteToGold,
} from "../constant";
// import "./TokenPurchaseForm.css";

interface TokenPurchaseFormProps {
  onPurchase: (amount: number) => Promise<void>;
  baseCurrency?: string;
  maxAmount?: number;
  isMainnet?: boolean;
  currentPage?: string;
}

const TokenPurchaseForm: React.FC<TokenPurchaseFormProps> = ({
  onPurchase,
  baseCurrency,
  maxAmount = 0,
  isMainnet,
  currentPage,
}) => {
  const [amount, setAmount] = useState(0);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= maxAmount) {
      onPurchase(amount);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value;

    let newAmount = 0;

    if (inputVal !== "") {
      newAmount = parseFloat(inputVal);
    }

    // If the parsed number results in NaN, reset the amount to 0
    if (isNaN(newAmount)) {
      newAmount = 0;
    }

    setAmount(newAmount);
    setIsError(newAmount > maxAmount || newAmount <= 0);
  };

  const currencyShown = baseCurrency ?? `ERG`;
  return (
    <>
      {currentPage !== Fusion ? (
        <form className="token-purchase-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="payment-amount-static">Payment In</label>
            {/* Use a span or a read-only input to display the currency */}
            <input
              id="payment-amount-static"
              type="text"
              readOnly
              value={currencyShown}
              style={{
                background: "#e9ecef",
                borderColor: "transparent",
                color: "#495057",
              }} // Styling to indicate it's not editable
            />
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />
          </div>
          {isError && amount > 0 && (
            <p style={{ color: "red" }}>
              Amount exceeds the maximum limit of {maxAmount}.
            </p>
          )}
          {isError && amount <= 0 && (
            <p style={{ color: "red" }}>Amount must be greater than zero.</p>
          )}
          <div className="conversion-info">
            Wallet Balance:{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setAmount(maxAmount);
              }}
            >
              {maxAmount} {currencyShown}
            </a>
            <div>
              Expected receive:{" "}
              <ConversionBox
                inputValue={amount}
                isMainnet={isMainnet}
                baseCurrency={currencyShown}
                currentPage={currentPage}
              />
            </div>
          </div>
          <button type="submit" className="buy-button" disabled={isError}>
            Convert Now
          </button>
        </form>
      ) : (
        <form className="token-purchase-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="payment-amount-static">Convert back to </label>
            {/* Use a span or a read-only input to display the currency */}
            <input
              id="payment-amount-static"
              type="text"
              readOnly
              value={currencyShown}
              style={{
                background: "#e9ecef",
                borderColor: "transparent",
                color: "#495057",
              }} // Styling to indicate it's not editable
            />
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />
          </div>
          {isError && amount > 0 && (
            <p style={{ color: "red" }}>
              Amount exceeds the maximum limit of {maxAmount}.
            </p>
          )}
          {isError && amount <= 0 && (
            <p style={{ color: "red" }}>Amount must be greater than zero.</p>
          )}
          <div className="conversion-info">
            Wallet Balance:{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setAmount(maxAmount);
              }}
            >
              {maxAmount} {currencyShown}
            </a>
            <div>
              Expected receive:{" "}
              <ConversionBox
                inputValue={amount}
                isMainnet={isMainnet}
                baseCurrency={currencyShown}
                currentPage={currentPage}
              />
            </div>
          </div>
          <button type="submit" className="buy-button" disabled={isError}>
            Convert Now
          </button>
        </form>
      )}
    </>
  );
};

export default TokenPurchaseForm;

interface Asset {
  assetName?: string;
  id?: string;
  price?: number;
}

export const ConversionBox = ({
  inputValue,
  isMainnet,
  baseCurrency,
  currentPage,
}: any) => {
  const jsonData = `[{"assetName":"NEUTRON","id":"b444f19bf3ce453d50efebb1c6689d60823ffb11311f3aa11f7a9e0ff1e2bd05","price":0},{"assetName":"PROTON","id":"0365bbb9b9f21ebb7ea0d3b0cf2b1c2745739e86199e72d4bb0c2d0438b36510","price":0}]`;
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

  // return (
  //   // <div
  //   //   style={{
  //   //     border: "1px solid black",
  //   //     padding: "20px",
  //   //     textAlign: "center",
  //   //   }}
  //   // >
  //   <>
  return (
    <div>
      {assets.map((asset, index) => (
        <div key={index}>
          <p>
            {asset.price} {asset.assetName}
          </p>
        </div>
      ))}
    </div>
  );
  //   </>
  //   // </div>
  // );
};
