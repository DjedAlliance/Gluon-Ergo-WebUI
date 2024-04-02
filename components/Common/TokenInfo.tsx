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
      <div className="header-info">

      {/* this is where the logo will go*/}
      {/* <img src={logoUrl} alt={`${tokenName} logo`} className="token-logo" /> */}
      <h1>{tokenName}</h1>
      <div/>
      </div>
      {/* <p>{description}</p> */}
    </div>
  );
};

export default TokenInfo;
