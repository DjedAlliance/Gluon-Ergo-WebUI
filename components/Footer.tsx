import React from "react";
import { LogoFooter } from "./Logo";
import KnowYourAssumptionsModal from "./KnowYourAssumptionsModal";

const Footer = () => {
  return (
    <>
      <footer className="primary-gradient py-8 lg:py-10 font-inter">
        <div className="grid w-full text-white place-content-center gap-1 lg:gap-1 grid-cols-2 lg:grid-cols-4 container mx-auto  px-2 sm:px-3 lg:px-5">
          {/* <div> */}
          <h2 className="font-bold uppercase pb-3">
            <a
              className="transition-all duration-200 ease-in-out hover:text-opacity-80"
              target="_blank"
              rel="noopener noreferrer"
              href="https://x.com/DjedAlliance"
            >
              Twitter
            </a>
          </h2>
          <h2 className="font-bold uppercase pb-3">
            <a
              className="transition-all duration-200 ease-in-out hover:text-opacity-80"
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.me/GluonGold"
            >
              Telegram
            </a>
          </h2>
          <h2 className="font-bold uppercase pb-3">
            <a
              href="https://github.com/DjedAlliance/GluonW-Ergo-Backend"
              className="transition-all duration-200 ease-in-out hover:text-opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </h2>
          <h2 className="font-bold uppercase pb-3">
            <a
              href="https://discord.gg/YzDKeEfWtS"
              className="transition-all duration-200 ease-in-out hover:text-opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
          </h2>
        </div>
        <div className="grid w-full text-white place-content-center container mx-auto  px-2 sm:px-3 lg:px-5">
          <h2 className="font-bold uppercase pb-3">
            <KnowYourAssumptionsModal />
          </h2>
        </div>
      </footer>
    </>
  );
};

export default Footer;
