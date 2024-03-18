import React from "react";
import KnowYourAssumptionsModal from "./KnowYourAssumptionsModal";

const Footer = () => {
  return (
    <footer className="primary-gradient py-8 lg:py-10 font-inter text-white w-full">
      <div className="w-full px-2 sm:px-3 lg:px-5">
        {/* First Row */}
        <div className="flex justify-between flex-wrap mb-4">
          <div className="text-center flex-1">
            <a
              className="font-bold uppercase transition-all duration-200 ease-in-out hover:text-opacity-80"
              target="_blank"
              rel="noopener noreferrer"
              href="https://x.com/DjedAlliance"
            >
              Twitter
            </a>
          </div>
          <div className="text-center flex-1">
            <a
              className="font-bold uppercase transition-all duration-200 ease-in-out hover:text-opacity-80"
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.me/GluonGold"
            >
              Telegram
            </a>
          </div>
          <div className="text-center flex-1">
            <a
              className="font-bold uppercase transition-all duration-200 ease-in-out hover:text-opacity-80"
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/YzDKeEfWtS"
            >
              Discord
            </a>
          </div>
        </div>
        {/* Second Row */}
        <div className="flex justify-between flex-wrap">
          <div className="text-center flex-1">
            <a
              className="font-bold uppercase transition-all duration-200 ease-in-out hover:text-opacity-80"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.youtube.com/watch?v=tnvm1we6xts"
            >
              How it works
            </a>
          </div>
          <div className="text-center flex-1">
            <a
              className="font-bold uppercase transition-all duration-200 ease-in-out hover:text-opacity-80"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/DjedAlliance/GluonW-Ergo-Backend"
            >
              Github
            </a>
          </div>
          <div className="text-center flex-1">
            <KnowYourAssumptionsModal />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
