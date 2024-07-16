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
    <div className="pb-3 pt-4">
      <div className="header-info">
        {/* this is where the logo will go*/}
        {/* <img src={logoUrl} alt={`${tokenName} logo`} className="token-logo" /> */}
        <h4 className="font-thin text-md">{tokenName}</h4>
        <div />
      </div>
      {/* <p>{description}</p> */}
    </div>
  );
};

export default TokenInfo;
