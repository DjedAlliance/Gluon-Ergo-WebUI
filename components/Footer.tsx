import React, { useEffect, useState } from "react";
import KnowYourAssumptionsModal from "./KnowYourAssumptionsModal";
import NetworkHeight from "./NetworkHeight";
import SocialLinks from "./SocialIcons";
const KYA_STORAGE_KEY = "knowYourAssumptionsAccepted";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const isKYAAccepted = localStorage.getItem(KYA_STORAGE_KEY);
    if (!isKYAAccepted) {
      setIsOpen(true);
    }
  }, []);

  return (
    <div
      className={
        "flex items-center justify-between bottom-0 w-screen fixed bg-gradient-to-t from-gluongold via-20% via-purplemist to-transparent"
      }
    >
      <div className="flex flex-row">
        <SocialLinks />
        <button onClick={() => setIsOpen(true)} className="flex font-bold my-4">
          KYA
        </button>
      </div>
      <NetworkHeight />
      <KnowYourAssumptionsModal
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
      />
    </div>
  );
};

export default Footer;
