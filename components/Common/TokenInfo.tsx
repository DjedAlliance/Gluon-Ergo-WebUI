import React from "react";
// import "./TokenInfo.css";

interface TokenInfoProps {
  tokenName: string;
  description: string;
  logoUrl: string;
}

const TokenInfo: React.FC<TokenInfoProps> = ({
  tokenName,
  description,
  logoUrl,
}) => {
  return (
    <div className="token-info">
      <img src={logoUrl} alt={`${tokenName} logo`} className="token-logo" />
      <h1>{tokenName}</h1>
      <p>{description}</p>
    </div>
  );
};

export default TokenInfo;
