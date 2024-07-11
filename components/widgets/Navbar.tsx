import React from "react";
import SettingPopup from "../SettingPopup";
import LogoIcon from "@/public/icons/logo.svg";
import ConnectWallet from "@/components/wallet/ConnectWallet";
import DropDown from "@/components/wallet/DropDown";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Image from "next/image";
import {
  Fission,
  Fusion,
  TransmuteFromGold,
  TransmuteToGold,
  Reactor as ReactorTitle,
  GAU_Stablecoin,
  GAUC_Reservecoin,
  MintGold,
  MintRsv,
} from "../constant";
import hamburgerIcon from "@/public/hamburger.png";
import HeaderButton from "../shared/HeaderButton";
import Link from "next/link";
interface IProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

const Navbar = (props: IProps) => {
  const { activeTab, setActiveTab, socket } = props;
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  console.log("activeTab", activeTab);
  return (
    <>
      <nav className="hidden lg:flex container items-center justify-between mx-auto px-2 sm:px-3 lg:px-5 py-4 text-black">
        <div className="left-navbar">
          <div className="nav-container">
            {/* <HeaderButton title="Gluon Gold" setActiveTab={setActiveTab} active={activeTab === "Home"} /> */}
            <Image src={LogoIcon} alt="logo" width="120" height="32" />
            {/* <HeaderButton title={MintGold} setActiveTab={setActiveTab} active={activeTab === MintGold} disabled={true}/> */}
            {/* <HeaderButton title={MintRsv} setActiveTab={setActiveTab} active={activeTab === MintRsv} disabled={true}/> */}
            <HeaderButton
              title={ReactorTitle}
              setActiveTab={setActiveTab}
              active={activeTab === ReactorTitle}
              disabled={false}
            />
            <Link href="https://docs.stability.nexus" target="_blank">
              Docs
            </Link>

            {/* <HeaderButton title="Docs" setActiveTab={setActiveTab} active={activeTab === "Docs"} disabled={true}/> */}
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div>
            <DropDown />
          </div>

          <div className="hidden sm:block">
            <ConnectWallet socket={socket} />
          </div>
        </div>
      </nav>

      {/* Menu for small screens (Hamburguer)*/}
      <div>
        <button className="sm:hidden" onClick={toggleMenu}>
          <div className="flex items-center space-x-2">
            <Image src={hamburgerIcon} alt="Menu" width={46} height={46} />
            {activeTab}
          </div>
        </button>
        {isMenuOpen && (
          <ul className="menu-list">
            {/* <li className={`menu-item ${activeTab === "Home" ? "active" : ""}`} onClick={() => { setActiveTab("Home"); toggleMenu(); }}>Home</li> */}
            {/* <li className={`menu-item ${activeTab === MintGold ? "active" : ""}`} onClick={() => { setActiveTab(MintGold); toggleMenu(); }}>Mint Gold</li> */}
            {/* <li className={`menu-item ${activeTab === MintRsv ? "active" : ""}`} onClick={() => { setActiveTab(MintRsv); toggleMenu(); }}>Mint Reserve</li> */}
            <li
              className={`menu-item ${
                activeTab === ReactorTitle ? "active" : ""
              }`}
              onClick={() => handleMenuItemClick(ReactorTitle)}
            >
              Reactor
              <ul className="menu-submenu">
                <li
                  className={`menu-item-submenu ${
                    activeTab === Fission ? "active" : ""
                  }`}
                  onClick={() => handleMenuItemClick(Fission)}
                >
                  Fission
                </li>
                <li
                  className={`menu-item-submenu ${
                    activeTab === Fusion ? "active" : ""
                  }`}
                  onClick={() => handleMenuItemClick(Fusion)}
                >
                  Fusion
                </li>
                <li
                  className={`menu-item-submenu ${
                    activeTab === GAU_Stablecoin ? "active" : ""
                  }`}
                  onClick={() => handleMenuItemClick(GAU_Stablecoin)}
                >
                  Transmutation to Gold
                </li>
                <li
                  className={`menu-item-submenu ${
                    activeTab === GAUC_Reservecoin ? "active" : ""
                  }`}
                  onClick={() => handleMenuItemClick(GAUC_Reservecoin)}
                >
                  Transmutation from Gold
                </li>
              </ul>
            </li>
            <li className={`menu-item ${activeTab === "Docs" ? "active" : ""}`}>
              <Link href="https://docs.stability.nexus" target="_blank">
                Docs
              </Link>
            </li>
            {/* <li className={`menu-item ${activeTab === "Docs" ? "active" : ""}`} onClick={() => { setActiveTab("Docs"); toggleMenu(); }}>Docs</li> */}
            {/* <HeaderButton title={ReactorTitle} setActiveTab={setActiveTab}  active={activeTab === ReactorTitle} disabled={false}/> */}
          </ul>
        )}
        <div className="sm:hidden">
          <ConnectWallet socket={socket} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
