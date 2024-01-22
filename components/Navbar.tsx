import React from "react";
import SettingPopup from "./SettingPopup";
import { Logo } from "./Logo";
import ConnectWallet from "@/components/wallet/ConnectWallet";
import DropDown from "@/components/wallet/DropDown";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  Fission,
  Fusion,
  TransmuteFromGold,
  TransmuteToGold,
} from "./constant";

interface IProps {
  activeTab: string;
  setActiveTab: Function;
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
        <span className="mr-3">Gluon Gold on ErgoW</span>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <DropDown />

          <div className="hidden sm:block">
            <ConnectWallet socket={socket} />
          </div>
        </div>
      </nav>

      <div className="sm:hidden w-full ">
        <ConnectWallet socket={socket} />
      </div>
      <button className="sm:hidden" onClick={toggleMenu}>
        <button className="relative group">
          <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
            <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden group-focus:translate-x-1.5">
              <div className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:rotate-[42deg] group-focus:w-2/3 delay-150"></div>
              <div className="bg-white h-[2px] w-7 rounded transform transition-all duration-300 group-focus:translate-x-10"></div>
              <div className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:-rotate-[42deg] group-focus:w-2/3 delay-150"></div>
            </div>
          </div>
          {activeTab}
        </button>
      </button>

      {/* Hamburger menu content */}
      <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="primary-gradient py-3 flex flex-col items-center justify-center space-y-4">
          {/* Tab Buttons */}
          <TabButton
            title={Fission}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsMenuOpen={setIsMenuOpen}
          />
          <TabButton
            title={Fusion}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsMenuOpen={setIsMenuOpen}
          />
          <TabButton
            title={TransmuteToGold}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsMenuOpen={setIsMenuOpen}
          />
          <TabButton
            title={TransmuteFromGold}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>
      </div>

      {/* Regular display of tab buttons for larger screens */}
      <div className="hidden sm:flex primary-gradient w-full py-3 text-center items-center space-x-12 sm:space-x-20 justify-center">
        {/* Tab Buttons */}
        <TabButton
          title={Fission}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMenuOpen={setIsMenuOpen}
        />
        <TabButton
          title={Fusion}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMenuOpen={setIsMenuOpen}
        />
        <TabButton
          title={TransmuteToGold}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMenuOpen={setIsMenuOpen}
        />
        <TabButton
          title={TransmuteFromGold}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>
    </>
  );
};

const TabButton = ({ title, activeTab, setActiveTab, setIsMenuOpen }: any) => (
  <button
    onClick={() => {
      setIsMenuOpen(false);
      setActiveTab(title);
    }}
    className={`text-white font-medium font-inter text-lg uppercase transition-all duration-200 ease-in-out relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${
      activeTab === title ? "after:w-[130%]" : ""
    }`}
  >
    {title}
  </button>
);

export default Navbar;
