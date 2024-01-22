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
import TransmuteGoldToRsv from "./TransumuteGoldToRsv";
import TransmuteRsvToGold from "./TransumuteRsvToGold";
import MintGold from "./MintGold";
import MintRsv from "./MintRsv";
import {
  Fission as fissionTitle,
  Fusion as fusionTitle,
  TransmuteFromGold as transmuteFromGoldTitle,
  TransmuteToGold as transmuteToGoldTitle,
} from "./constant";

const Main = () => {
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("Fission");
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
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        socket={socket}
      />
      {activeTab === "Home" && <Fission />}
      {activeTab === transmuteToGoldTitle && <TransmuteRsvToGold />}
      {activeTab === transmuteFromGoldTitle && <TransmuteGoldToRsv />}
      {activeTab === fissionTitle && <Fission />}
      {activeTab === "MintGold" && <MintGold />}
      {activeTab === "MintRsv" && <MintRsv />}
      {/* {activeTab === "refund" && <Refund />} */}
      <Footer />
    </>
  );
};

export default Main;
