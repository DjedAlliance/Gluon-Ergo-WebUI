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
      <div className="token-links">
        <a
          href="https://www.coingecko.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CoinGecko
        </a>
        <a
          href="https://coinmarketcap.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CoinMarketCap
        </a>
      </div>
    </div>
  );
};

export default TokenInfo;
