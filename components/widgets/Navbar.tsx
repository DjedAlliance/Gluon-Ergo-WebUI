import React from "react";
import SettingPopup from "../SettingPopup";
import LogoIcon from "@/public/icons/logo.svg";
import ConnectWallet from "@/components/wallet/ConnectWallet";
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
import { useRouter } from "next/router";
import NetworkPicker from "../wallet/NetworkPicker";
interface IProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

const Navbar = (props: IProps) => {
  const router = useRouter();
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
      <div className="flex items-center justify-between mx-auto px-2 sm:px-3 lg:px-5 py-4 text-black">
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
            <NetworkPicker />
          </div>

          <div className="hidden sm:block">
            <ConnectWallet socket={socket} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
