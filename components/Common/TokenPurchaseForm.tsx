import React, { useState } from "react";
// import "./TokenPurchaseForm.css";

interface TokenPurchaseFormProps {
  onPurchase: (amount: number) => Promise<void>;
  baseCurrency?: string;
  maxAmount?: number;
}

const TokenPurchaseForm: React.FC<TokenPurchaseFormProps> = ({
  onPurchase,
  baseCurrency,
  maxAmount = 0,
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

    // const newAmount = Number(e.target.value);
    setAmount(newAmount);
    setIsError(newAmount > maxAmount || newAmount <= 0);
  };

  const currencyShown = baseCurrency ?? `USDT`;

  return (
    <form className="token-purchase-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="payment-amount">Payment In</label>
        <select id="payment-amount">
          <option value="Ergo">{currencyShown}</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
        />
        <button type="button" onClick={() => setAmount(maxAmount)}>
          MAX
        </button>
      </div>
      {(isError && amount > 0) && (
        <p style={{ color: "red" }}>
          Amount exceeds the maximum limit of {maxAmount}.
        </p>
      )}
      {(isError && amount <= 0) && (
        <p style={{ color: "red" }}>
          Amount must be greater than zero.
        </p>
      )}
      <div className="conversion-info">
        <p>
          Wallet Balance: {maxAmount} {currencyShown}
        </p>

        <p>Expected receive: {amount * 1.0094} STRACE</p>
      </div>
      <button type="submit" className="buy-button" disabled={isError}>
        Buy Now
      </button>
    </form>
  );
};

export default TokenPurchaseForm;
