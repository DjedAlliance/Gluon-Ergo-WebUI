import React, { useState } from "react";
// import "./TokenPurchaseForm.css";

interface TokenPurchaseFormProps {
  onPurchase: (amount: string) => void;
  baseCurrency?: string;
}

const TokenPurchaseForm: React.FC<TokenPurchaseFormProps> = ({
  onPurchase,
  baseCurrency,
}) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPurchase(amount);
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
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <button type="button" onClick={() => setAmount("100")}>
          MAX
        </button>
      </div>
      <div className="conversion-info">
        <p>Wallet Balance: 104.0967</p>
        <p>Conversion rate: 1 USDT = 1.0094 STRACE</p>
        <p>Expected receive: {parseFloat(amount) * 1.0094} STRACE</p>
      </div>
      <button type="submit" className="buy-button">
        Buy Now
      </button>
    </form>
  );
};

export default TokenPurchaseForm;
