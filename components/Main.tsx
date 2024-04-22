import React, { useContext, useEffect, useState } from "react";
import Loader from "./Loader";
import Navbar from "./Navbar";
import {
  BANK_SINGLETON_TOKEN_ID,
  explorerClient,
  NEXT_PUBLIC_NEST_API_URL,
  precision,
  precisionBigInt,
  UIMultiplier,
} from "@/blockchain/ergo/constants";
import Footer from "./Footer";
import { fromEvent } from "rxjs";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { getWalletConfig } from "@/blockchain/ergo/wallet/utils";
import { getWalletConnection } from "@/blockchain/ergo/walletUtils/utils";
import { Fission } from "./Fission";
import Home from "./Home";
import TransmuteGoldToRsv from "./TransumuteGoldToRsv";
import TransmuteRsvToGold from "./TransumuteRsvToGold";
import MintGold from "./MintGold";
import MintRsv from "./MintRsv";
import Docs from "./Docs";
import Reactor from "./Reactor";
import {
  Fission as fissionTitle,
  Fusion as fusionTitle,
  TransmuteFromGold as transmuteFromGoldTitle,
  TransmuteToGold as transmuteToGoldTitle,
  Reactor as reactorTitle,
  GAU_Stablecoin as gauStablecoinTitle,
  GAUC_Reservecoin as gaucReservecoinTitle,
  MintGold as mintGoldTitle,
  MintRsv as mintRsvTitle
} from "./constant";
import { Fusion } from "./Fusion";

const Main = () => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("Fission");
  const [reactorActiveTab, setReactorActiveTab] = useState("Fission");
  const [lastBlock, setLastBlock] = useState(null);

  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >(undefined);

  useEffect(() => {
    const socket = io(NEXT_PUBLIC_NEST_API_URL(isMainnet!));
    setSocket(socket);

    const msgSubscription = fromEvent(socket, "new_block").subscribe((msg) => {
      setLastBlock(msg);
      console.log("Received message: ", msg);
    });

    return () => {
      msgSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    setIsMainnet(isMainnet);

    const walletConfig = getWalletConfig();

    if (walletConfig && walletConfig.walletName === "nautilus") {
      getWalletConnection();
    }
  }, []);

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;
    console.log(`isMainnet: ${isMainnet}`);
  }, [lastBlock]);

  return (
    <>
      <div>
        <div className="main-content" style={{ paddingBottom: "100px" }}>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            socket={socket}
          />
          {activeTab === "Gluon Gold" && <Home />}
          {activeTab === fissionTitle && <Fission />}
          {activeTab === fusionTitle && <Fusion />}
          {activeTab === mintGoldTitle && <MintGold />}
          {activeTab === mintRsvTitle && <MintRsv />}
          {activeTab == reactorTitle && <Reactor reactorActiveTab={reactorActiveTab} setReactorActiveTab={setReactorActiveTab}/>}
          {activeTab == gauStablecoinTitle && <TransmuteGoldToRsv />}
          {activeTab == gaucReservecoinTitle && <TransmuteRsvToGold />}
          {activeTab == "Docs" && <Docs />}
          {/* {activeTab === "refund" && <Refund />} */}
        </div>

      </div>
    </>
  );
};

export default Main;
