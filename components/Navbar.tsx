import React from "react";
import SettingPopup from "./SettingPopup";
import { Logo } from "./Logo";
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
  MintRsv
} from "./constant";
import hamburgerIcon from "../public/hamburger.png";
interface IProps {
  activeTab: string;
  setActiveTab:(tab: string) => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

const Navbar = (props: IProps) => {
  const { activeTab, setActiveTab, socket } = props;
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
  <nav className="hidden lg:flex container items-center justify-between mx-auto px-2 sm:px-3 lg:px-5 py-4 text-black">
        <div className="left-navbar">
          <div className="nav-container">
            <HeaderButton title="Gluon Gold" setActiveTab={setActiveTab} active={activeTab === "Home"} />
            <HeaderButton title={MintGold} setActiveTab={setActiveTab} active={activeTab === MintGold}/>
            <HeaderButton title={MintRsv} setActiveTab={setActiveTab} active={activeTab === MintRsv}/>
            <HeaderButton title={ReactorTitle} setActiveTab={setActiveTab}  active={activeTab === ReactorTitle}/>
            <HeaderButton title="Docs" setActiveTab={setActiveTab} active={activeTab === "Docs"}/>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div
          >
            <DropDown />
          </div>

          <div className="hidden sm:block">
            <ConnectWallet socket={socket} />
          </div>
        </div>
      </nav>

      <div className="sm:hidden w-full ">
        <ConnectWallet socket={socket} />
      </div>
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
            <li className={`menu-item ${activeTab === "Home" ? "active" : ""}`} onClick={() => { setActiveTab("Home"); toggleMenu(); }}>Home</li>
            <li className={`menu-item ${activeTab === MintGold ? "active" : ""}`} onClick={() => { setActiveTab(MintGold); toggleMenu(); }}>Mint Gold</li>
            <li className={`menu-item ${activeTab === MintRsv ? "active" : ""}`} onClick={() => { setActiveTab(MintRsv); toggleMenu(); }}>Mint Reserve</li>
            <li className={`menu-item ${activeTab === ReactorTitle ? "active" : ""}`} onClick={() => { setActiveTab(ReactorTitle); toggleMenu(); }}>Reactor
              <ul className="menu-submenu">
              <li className={`menu-item-submenu ${activeTab === MintGold ? "active" : ""}`} onClick={() => { setActiveTab(Fission); toggleMenu(); }}>Fission</li>
              <li className={`menu-item-submenu ${activeTab === MintGold ? "active" : ""}`} onClick={() => { setActiveTab(Fusion); toggleMenu(); }}>Fusion</li>
              <li className={`menu-item-submenu ${activeTab === MintGold ? "active" : ""}`} onClick={() => { setActiveTab(GAU_Stablecoin); toggleMenu(); }}>Beta Decay +</li>
              <li className={`menu-item-submenu ${activeTab === MintGold ? "active" : ""}`} onClick={() => { setActiveTab(GAUC_Reservecoin); toggleMenu(); }}>Beta Decay -</li>
              </ul>
            </li>
            <li className={`menu-item ${activeTab === "Docs" ? "active" : ""}`} onClick={() => { setActiveTab("Docs"); toggleMenu(); }}>Docs</li>
          </ul>
        )}
      </div>
    </>
  );
};

const HeaderButton = ({ title, setActiveTab, active }: { title: string, setActiveTab: (tab: string) => void, active: boolean }) => (
  <button
    className={`nav-button ${active ? 'active' : ''}`}
    onClick={() => setActiveTab(title)}
  >
    {title}
  </button>
);


export default Navbar;
