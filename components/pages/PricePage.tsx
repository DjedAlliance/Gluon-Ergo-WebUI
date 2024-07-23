import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer";

import s from "@/styles/general.module.css";
import { useEffect, useState } from "react";

import { NEXT_PUBLIC_NEST_API_URL } from "@/blockchain/ergo/constants";
import { fromEvent } from "rxjs";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { getWalletConfig } from "@/blockchain/ergo/wallet/utils";
import { getWalletConnection } from "@/blockchain/ergo/walletUtils/utils";
import classNames from "classnames";
import Header from "../Header";
import { useRouter } from "next/router";

interface AppPageProps {
  children: React.ReactNode;
}

export default function AppPage({ children }: AppPageProps) {
  const router = useRouter();

  const [isMainnet, setIsMainnet] = useState<boolean>(true);
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
    <div className={s.mainWrapper}>
      <Head>
        <title>Gluon Gold</title>
        <link rel="shortcut icon" href="" />
      </Head>
      <ToastContainer />
      <main className={classNames("bg-[#24222C] pb-8", "flex flex-col ")}>
        <div className="">
          <Header currentHref={router.pathname} socket={socket} />
        </div>
        <div className="flex flex-row px-8 md:space-x-8 lg:space-x-16 w-full justify-center md:pt-12 pb-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
