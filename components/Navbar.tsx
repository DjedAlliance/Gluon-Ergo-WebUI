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
      <nav className="flex container items-center justify-between mx-auto px-2 sm:px-3 lg:px-5 py-4 text-black">
        <div className="left-navbar">
          <div className="nav-container">
            <HeaderButton title="Home" setActiveTab={setActiveTab} active={activeTab === "Home"} />
            <HeaderButton title={GAU_Stablecoin} setActiveTab={setActiveTab} active={activeTab === GAU_Stablecoin}/>
            <HeaderButton title={GAUC_Reservecoin} setActiveTab={setActiveTab} active={activeTab === GAUC_Reservecoin}/>
            <HeaderButton title={ReactorTitle} setActiveTab={setActiveTab}  active={activeTab === ReactorTitle}/>
            <HeaderButton title="Docs" setActiveTab={setActiveTab} active={activeTab === "Docs"}/>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div

          // style={{
          //   backgroundImage:
          //     "linear-gradient(to right, #C8B209, #FFBF00) !important",
          // }}
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
      <button className="sm:hidden" onClick={toggleMenu}>
        <div className="flex items-center space-x-2 ">
          <Image src={hamburgerIcon} alt="Logo" width={46} height={46} />
          {activeTab}
        </div>
      </button>
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
