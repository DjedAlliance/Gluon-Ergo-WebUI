import React from "react";
import TokenInfo from "./TokenInfo";

interface TokenContainerProps {
  tokenName: string;
  description: string;
  logoUrl: string;
  currentPage: string;
  children: React.ReactNode;
}

const TokenContainer: React.FC<TokenContainerProps> = ({
  tokenName,
  description,
  logoUrl,
  children,
  currentPage,
}) => {
  return (
    <div>
      <div className="flex md:hidden text-2xl py-2">{currentPage}</div>
      <TokenInfo
        tokenName={tokenName}
        description={description}
        logoUrl={logoUrl}
      />
      {children}
    </div>
  );
};

export default TokenContainer;
