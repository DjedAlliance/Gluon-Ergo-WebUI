import React from "react";
import TokenInfo from "./TokenInfo";
import TokenPurchaseForm from "./TokenPurchaseForm";

interface TokenContainerProps {
  onPurchase: (amount: string) => void;
  tokenName: string;
  description: string;
  logoUrl: string;
}

const TokenContainer: React.FC<TokenContainerProps> = ({
  onPurchase,
  tokenName,
  description,
  logoUrl,
}) => {
  return (
    <div className="token-container">
      <TokenInfo
        tokenName={tokenName}
        description={description}
        logoUrl={logoUrl}
      />
      <TokenPurchaseForm onPurchase={onPurchase} />
    </div>
  );
};

export default TokenContainer;
