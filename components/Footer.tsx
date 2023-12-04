import React from "react";
import { LogoFooter } from "./Logo";
import KnowYourAssumptionsModal from "./KnowYourAssumptionsModal";

const Footer = () => {
  return (
    <>
      <footer className="primary-gradient py-8 lg:py-10 font-inter">
        <div className="grid w-full text-white place-content-center gap-5 lg:gap-5 grid-cols-2 lg:grid-cols-4 container mx-auto  px-2 sm:px-3 lg:px-5">
          <div>
            <LogoFooter />
            <p className="mt-[18px] lg:ml-4 text-[13px] sm:text-base">
              The Phoenix Finance Team
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase pb-3 ">Open Source</h4>
            <ul className="space-y-2 sm:space-y-1.5 text-[13px] sm:text-base">
              <li>
                <a
                  href="https://github.com/PhoenixErgo/phoenix-hodlcoin-contracts"
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contracts
                </a>
              </li>
              <li>
                <a
                  href="https://eprint.iacr.org/2023/1029"
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HodlCoin Game Paper
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/PhoenixErgo/Phoenix-Interface"
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  User Interface
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase pb-3">Social</h4>
            <ul className="space-y-2 sm:space-y-1.5 text-[13px] sm:text-base">
              <li>
                <a
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://twitter.com/PhoenixErgo"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://t.me/hodlCoinGame"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/PhoenixErgo"
                  className="transition-all duration-200 ease-in-out hover:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase pb-3">KYA</h4>
            <ul className="space-y-2 sm:space-y-1.5 text-[13px] sm:text-base">
              <li>
                <KnowYourAssumptionsModal />
              </li>
              {/*<li>*/}
              {/*  <a*/}
              {/*    href="https://sigmafi.gitbook.io/sigmafi-docs/"*/}
              {/*    target="_blank"*/}
              {/*    className="transition-all duration-200 ease-in-out hover:text-opacity-80"*/}
              {/*    rel="noopener noreferrer"*/}
              {/*  >*/}
              {/*    Docs*/}
              {/*  </a>*/}
              {/*</li>*/}
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
