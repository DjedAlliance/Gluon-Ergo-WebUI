import React from "react";
import TokenInfo from "./TokenInfo";
import TokenPurchaseForm from "./TokenPurchaseForm";

interface TokenContainerProps {
  onPurchase: (amount: number) => Promise<void>;
  tokenName: string;
  description: string;
  logoUrl: string;
  baseCurrency?: string;
  maxAmount?: number;
}

const TokenContainer: React.FC<TokenContainerProps> = ({
  onPurchase,
  tokenName,
  description,
  logoUrl,
  baseCurrency,
  maxAmount,
}) => {
  return (
    <div className="token-container">
      <TokenInfo
        tokenName={tokenName}
        description={description}
        logoUrl={logoUrl}
      />
      <TokenPurchaseForm onPurchase={onPurchase} baseCurrency={baseCurrency} maxAmount={maxAmount}  />
    </div>
  );
};

export default TokenContainer;
