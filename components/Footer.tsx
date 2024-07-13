import React from "react";
import KnowYourAssumptionsModal from "./KnowYourAssumptionsModal";
import NetworkHeight from "./NetworkHeight";
import SocialLinks from "./SocialIcons";

const Footer = () => {
  return (
    <div
      className={
        "flex items-center justify-between bottom-0 w-screen fixed bg-gradient-to-t from-gluongold via-20% via-purplemist to-transparent"
      }
    >
      <SocialLinks />
      <NetworkHeight />
    </div>
  );
};

export default Footer;
