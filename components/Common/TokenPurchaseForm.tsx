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
  UIFriendlyValue,
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
  isMainnet: boolean;
  currentPage?: string;
  maxProtonsAvailable?: number;
  maxNeutronsAvailable?: number;
}

const TokenPurchaseForm: React.FC<TokenPurchaseFormProps> = ({
  onPurchase,
  baseCurrency,
  maxAmount = 0,
  isMainnet,
  currentPage,
  maxProtonsAvailable,
  maxNeutronsAvailable,
}) => {
  const [amount, setAmount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isErrorInFusion, setIsErrorInFusion] = useState(false);
  // const [protonsPerTransaction, setProtonsPerTransaction] = useState(0);
  // const [neutronsPerTransaction, setNeutronsPerTransaction] = useState(0);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= maxAmount) {
      onPurchase(amount);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value;

    if (inputVal === "") {
      e.target.value = "0";
      setAmount(0);
      return;
    }
    const isFloat = /\d+\.\d+/.test(e.target.value);
    let input = parseFloat(e.target.value);
    if (Number.isNaN(parseFloat(e.target.value))) {
      e.target.value = "";
    }

    if (Number.isInteger(input) || isFloat) {
      let newInput = !Number.isNaN(input)
        ? replaceInput(parseFloat(e.target.value))
        : input;
      if (parseFloat(e.target.value) >= 1) {
        e.target.value = e.target.value.replace(/^0+/, "");
      }

      setAmount(input);
      setIsError(input > maxAmount || input <= 0 || isErrorInFusion);
    }
  };

  const replaceInput = (input: number) => {
    let stringedInput = input.toString();

    // Remove leading '0's only if the string does not represent a decimal number less than 1
    if (stringedInput.startsWith("0") && !stringedInput.startsWith("0.")) {
      stringedInput = stringedInput.replace(/^0+/, "");
    }
    return parseFloat(stringedInput);
  };
  const currencyShown = baseCurrency ?? `ERG`;
  return (
    <>
      {currentPage !== Fusion ? (
        <form className="token-purchase-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="payment-amount-static">Pay</label>
            {/* Use a span or a read-only input to display the currency */}
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />
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
              Receive:{" "}
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
            <label htmlFor="payment-amount-static">Receive</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />
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
            Wallet Balance
            <br />
            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setAmount(maxAmount);
                }}
              >
                {maxAmount} {currencyShown}
              </a>
              <br />
              {maxNeutronsAvailable} GAU
              <br />
              {maxProtonsAvailable} GAUC
            </div>
            <div>
              <br />
              Pay:{" "}
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
