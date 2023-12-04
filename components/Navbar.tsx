import React from "react";
import SettingPopup from "./SettingPopup";
import { Logo } from "./Logo";
import ConnectWallet from "@/components/wallet/ConnectWallet";
import DropDown from "@/components/wallet/DropDown";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

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
        <span className="mr-3">{/* <Logo /> */}GLUONW</span>

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
      {/* <div className="primary-gradient w-full py-3 text-center flex items-center space-x-12 sm:space-x-20 justify-center">
        <button
          onClick={() => setActiveTab("TransmuteSigGoldToRsv")}
          className={`text-white font-medium font-inter text-lg uppercase transition-all duration-200 ease-in-out after:transition-all
           after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${
             activeTab === "TransmuteSigGoldToRsv" ? "after:w-[130%] " : ""
           }`}
        >
          TransmuteSigGoldToRsv
        </button>
        <button
          onClick={() => setActiveTab("TransmuteRsvToGold")}
          className={`text-white font-medium font-inter text-lg uppercase transition-all duration-200 ease-in-out after:transition-all
           after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${
             activeTab === "TransmuteRsvToGold" ? "after:w-[130%] " : ""
           }`}
        >
          TransmuteRsvToGold
        </button>
        <button
          onClick={() => setActiveTab("Fission")}
          className={`text-white font-medium font-inter text-lg uppercase transition-all duration-200 ease-in-out after:transition-all
           after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${
             activeTab === "Fission" ? "after:w-[130%] " : ""
           }`}
        >
          Fission
        </button>
        <button
          onClick={() => setActiveTab("MintGold")}
          className={`text-white font-medium font-inter text-lg uppercase transition-all duration-200 ease-in-out after:transition-all
           after:ease-in-out after:duration-200 relative after:absolute after:-bottom-[11px] after:left-1/2 after:-translate-x-1/2 after:bg-white after:h-1 ${
             activeTab === "MintGold" ? "after:w-[130%] " : ""
           }`}
        >
          MintGold
        </button>
      </div>
    </>
  );
}; */}

      <button className="sm:hidden" onClick={toggleMenu}>
        {/* Hamburger icon */}
        {`HamburgerIcon -> ${activeTab}`}
      </button>

      {/* Hamburger menu content */}
      <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="primary-gradient py-3 flex flex-col items-center justify-center space-y-4">
          {/* Tab Buttons */}
          <TabButton
            title="TransmuteGoldToRsv"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsMenuOpen={setIsMenuOpen}
          />
          <TabButton
            title="TransmuteRsvToGold"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsMenuOpen={setIsMenuOpen}
          />
          <TabButton
            title="Fission"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsMenuOpen={setIsMenuOpen}
          />
          <TabButton
            title="MintGold"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsMenuOpen={setIsMenuOpen}
          />
          <TabButton
            title="MintRsv"
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
          title="TransmuteSigGoldToRsv"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMenuOpen={setIsMenuOpen}
        />
        <TabButton
          title="TransmuteRsvToGold"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMenuOpen={setIsMenuOpen}
        />
        <TabButton
          title="Fission"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMenuOpen={setIsMenuOpen}
        />
        <TabButton
          title="MintGold"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMenuOpen={setIsMenuOpen}
        />
        <TabButton
          title="MintRsv"
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
