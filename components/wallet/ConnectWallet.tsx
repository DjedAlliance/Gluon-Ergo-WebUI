import {
  faArrowUpRightFromSquare,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Space, Tabs, TabsProps, Tooltip } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import NautilusLogo from "../../public/NautilusLogo.png";
import ErgoLogoDark from "../../public/ergo-icon.png";
import commonStyle from "../../styles/common.module.css";
import DisconnectNautilusWalletButton from "./DisconnectNautilusWalletButton";
import ErgoPayButton from "./ErgoPayButton";
import NautilusWalletButton from "./NautilusWalletButton";
import { EXPLORER_API_URL, EXPLORER_URL } from "@/blockchain/ergo/constants";
import {
  Configuration,
  DefaultApiFactory,
} from "@/blockchain/ergo/explorerApi";
import {
  WrongNetworkException,
  connectErgoPayWallet,
  connectNautilusWallet,
  disconnectWallet,
} from "@/blockchain/ergo/wallet/connection";
import {
  syncAssetBalance,
  syncErgBalance,
} from "@/blockchain/ergo/wallet/sync";
import {
  handleCopyText,
  numberWithCommas,
  rateLimitedCoinGeckoERGUSD,
  reduceAddress,
} from "@/blockchain/ergo/wallet/utils";
import ErgoIconModal from "@/components/Common/ErgoIconModal";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { fromEvent, Subscription } from "rxjs";
import { Socket } from "socket.io-client";
import { noti_option_close } from "../Notifications/Toast";
import { CopyOutlined } from "@ant-design/icons";

interface Token {
  tokenId: string;
  amount: number;
  decimals: number;
  name: string;
  tokenType: string;
  usdValue: number;
}
export interface walletLocalStorage {
  walletConnected: boolean;
  walletName: string;
  walletAddress: string[];
}

interface IProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const ConnectWallet: React.FC<IProps> = (props) => {
  const { socket } = props;

  const [activeTabValue, setActiveTabValue] = useState("1"); // Initial value for desktop

  useEffect(() => {
    const handleResize = () => {
      // Check if the window object is available
      if (typeof window !== "undefined") {
        // Update the value based on screen width
        if (window.innerWidth <= 768) {
          setActiveTabValue("2"); // Mobile value
        } else {
          setActiveTabValue("1"); // Desktop value
        }
      }
    };

    // Initial call
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNautilusOpen, setIsNautilusOpen] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [activeKey, setActiveKey] = useState(activeTabValue);
  const [isLoading, setIsLoading] = useState(false);

  const [isMainnet, setIsMainnet] = useState<boolean | undefined>(undefined);
  const [walletConnected, setWalletConnected] = useState<boolean | undefined>(
    undefined
  );
  const [walletName, setWalletName] = useState<string | undefined>(undefined);
  const [walletAddress, setWalletAddress] = useState<string[] | undefined>(
    undefined
  );
  const [walletAssets, setWalletAssets] = useState<Token[]>([]);

  const [explorerApiClient, setExplorerApiClient] = useState<any>(null);
  const [usdOracle, setUsdOracle] = useState<number>(0);
  const [ergBalance, setErgBalance] = useState<string>("0");
  const [ergUSDValue, setErgUSDValue] = useState<any>("0");
  const [isEyeOpen, setEyeOpen] = useState<boolean | undefined>(false);

  useEffect(() => {
    if (walletConnected && walletAddress) {
      rateLimitedCoinGeckoERGUSD().then((res: () => Promise<number>) => {
        res().then((oracle) => {
          syncWallet(oracle);
        });
      });
    }
  }, [walletAddress]);

  useEffect(() => {
    let msgSubscription: Subscription;
    if (walletConnected && walletAddress) {
      rateLimitedCoinGeckoERGUSD().then((res: () => Promise<number>) => {
        msgSubscription = fromEvent(socket!, "new_block").subscribe((msg) => {
          res().then((oracle) => {
            syncWallet(oracle);
            console.log("syncing:", msg);
          });
        });
      });

      return () => {
        if (msgSubscription) {
          msgSubscription.unsubscribe();
        }
      };
    }
  }, [walletConnected]);

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet")
      ? (JSON.parse(localStorage.getItem("IsMainnet")!) as boolean)
      : true;

    setIsMainnet(isMainnet);

    const walletConfig = localStorage.getItem("walletConfig")
      ? (JSON.parse(
          localStorage.getItem("walletConfig")!
        ) as walletLocalStorage)
      : undefined;

    if (walletConfig) {
      setWalletConnected(walletConfig.walletConnected);
      setWalletName(walletConfig.walletName);
      setWalletAddress(walletConfig.walletAddress);
    }

    rateLimitedCoinGeckoERGUSD().then((res: () => Promise<number>) => {
      res().then((value) => setUsdOracle(value));
    });

    const explorerConf = new Configuration({
      basePath: EXPLORER_API_URL(isMainnet),
    });
    const explorerClient = DefaultApiFactory(explorerConf);
    setExplorerApiClient(explorerClient);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
    window.document.documentElement.classList.add("overflow-hidden");
    setActiveKey(activeTabValue);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    window.document.documentElement.classList.remove("overflow-hidden");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    window.document.documentElement.classList.remove("overflow-hidden");
  };

  const showNautilusModal = () => {
    setIsNautilusOpen(true);
    window.document.documentElement.classList.add("overflow-hidden");
  };
  const handleNautilusOk = () => {
    setIsNautilusOpen(false);
    window.document.documentElement.classList.remove("overflow-hidden");
  };

  const handleNautilusCancel = () => {
    setIsNautilusOpen(false);
    window.document.documentElement.classList.remove("overflow-hidden");
  };

  const onChange = (key: any) => {
    setActiveKey(key);
  };

  const toggleSelector = () => {
    if (!walletConnected) setShowSelector(!showSelector);
  };

  const syncWallet = async (oracle: number) => {
    syncErgBalance(
      walletAddress!,
      explorerApiClient,
      oracle,
      setErgBalance,
      setErgUSDValue
    );
    syncAssetBalance(
      walletAddress!,
      explorerApiClient,
      oracle,
      setWalletAssets
    );
  };

  const connectWallet = async (walletName: string, address?: string) => {
    if (walletName === "nautilus") {
      try {
        await connectNautilusWallet(
          setWalletConnected,
          walletName,
          setWalletName,
          setWalletAddress,
          setIsLoading,
          isMainnet!
        );
      } catch (error) {
        if (error instanceof WrongNetworkException) {
          toast.dismiss();
          toast.warn("wrong network", noti_option_close("try-again"));
        }
        console.log(error);
      }
      setIsModalOpen(false);
    } else if (walletName === "ergopay") {
      connectErgoPayWallet(
        address!,
        setWalletConnected,
        walletName,
        setWalletName,
        setWalletAddress,
        isMainnet!
      );
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Browser wallet`,
      children: (
        <NautilusWalletButton
          connectNautilus={() => connectWallet("nautilus")}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ),
    },
    {
      key: "2",
      // disabled: true,
      label: `ErgoPay`,
      children: (
        <ErgoPayButton
          setIsModalOpen={setIsModalOpen}
          connectErgoPay={connectWallet}
          activeKey={activeKey}
          isMainnet={isMainnet!}
        />
      ),
    },
  ];

  return (
    <>
      <div
        className={`flex items-center space-x-2 mx-2 sm:mx-3 sm:ml-6 mb-4 sm:mb-0  ${
          walletConnected
            ? "py-1 px-2 sm:px-[10px] border-[#d9d9d9] border rounded-[5px] "
            : ""
        }`}
      >
        <Space
          className="site-button-ghost-wrapper   connectWalletBtn w-full"
          wrap
          onClick={walletConnected ? showNautilusModal : showModal}
          style={{ fontFamily: `'Space Grotesk', sans-serif` }}
        >
          {walletConnected ? (
            walletName && walletName === "ergopay" ? (
              <div className="flex w-full">
                <button className="w-full  space-x-2 font-VelaSansRegular flex  text-black rounded-[5px] font-normal">
                  <p
                    className={`${
                      isEyeOpen ? "blur-sm" : ""
                    }  font-VelaSansRegular text-black font-normal`}
                  >
                    {numberWithCommas(parseInt(ergBalance), 9)} ERG
                  </p>
                  <span>
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="12" fill="black"></circle>
                      <path
                        d="M20.6979 11.7378L18.3358 6.03509C18.2663 5.86717 18.1328 5.73375 17.9649 5.66419L12.2622 3.30213C12.0943 3.23262 11.9057 3.23262 11.7377 3.30213L6.03522 5.66419C5.86729 5.73375 5.73387 5.86717 5.6643 6.03509L3.30225 11.7378C3.26776 11.8209 3.25 11.91 3.25 12C3.25 12.09 3.26776 12.1792 3.30225 12.2623L5.6643 17.9648C5.73387 18.1327 5.86729 18.2661 6.03522 18.3357L11.7377 20.6978C11.8209 20.7322 11.91 20.75 12 20.75C12.09 20.75 12.1791 20.7322 12.2622 20.6978L17.9649 18.3357C18.1328 18.2661 18.2663 18.1327 18.3358 17.9648L20.6979 12.2623C20.7674 12.0944 20.7674 11.9057 20.6979 11.7378ZM14.832 9.75245H11.5165L13.5717 11.9047L11.4444 14.2474H14.8311V15.8212H9.16874V14.3907L11.3969 11.9241L9.17944 9.61326V8.17888H14.8312L14.832 9.75245Z"
                        fill="white"
                      ></path>
                    </svg>
                  </span>
                  <p
                    className={`font-VelaSansRegular ${
                      isEyeOpen ? "blur-sm" : ""
                    } `}
                  >
                    {reduceAddress(walletAddress![0])}
                  </p>
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center whitespace-nowrap">
                <span
                  className={`${
                    isEyeOpen ? "blur-sm" : ""
                  } font-VelaSansRegular py-1`}
                >
                  {numberWithCommas(parseInt(ergBalance), 9)} ERG
                </span>
                <button
                  className="w-full font-VelaSansRegular"
                  style={{
                    borderRadius: 5,
                    background: "#FAFAFA",
                    color: "black",
                    marginLeft: 10,
                    padding: "3px 10px",
                  }}
                >
                  <div className="flex w-full font-VelaSansRegular space-x-3">
                    <Image alt="img" width="25" src={NautilusLogo} />
                    <p
                      className={`${
                        isEyeOpen ? "blur-sm" : ""
                      } font-VelaSansRegular`}
                    >
                      {reduceAddress(walletAddress![0])}
                    </p>
                  </div>
                </button>
              </div>
            )
          ) : (
            <button
              type="button"
              className="focus:outline-none text-white w-full sm:w-fit primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded text-md px-3 sm:px-5 py-2 sm:py-2.5"
            >
              CONNECT WALLET
            </button>
          )}
        </Space>
        {walletConnected && (
          <button
            className="border border-[#d9d9d9] min-w-[24px] min-h-[24px]  flex items-center justify-center rounded-md"
            onClick={() => setEyeOpen(!isEyeOpen)}
          >
            {isEyeOpen ? (
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="eye-invisible"
                width="1em"
                height="1em"
                fill="#262626"
                aria-hidden="true"
              >
                <path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"></path>
                <path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"></path>
              </svg>
            ) : (
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="eye"
                width="1em"
                height="1em"
                fill="#262626"
                aria-hidden="true"
              >
                <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
              </svg>
            )}
          </button>
        )}
      </div>
      {/*main modal*/}
      <Modal
        className="browser-wallet-modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        style={{ fontFamily: `'Space Grotesk', sans-serif`, maxWidth: 464 }}
      >
        <h5 className="font-VelaSansRegular">Select a wallet</h5>
        <Tabs
          defaultActiveKey={activeTabValue}
          centered
          items={items}
          onChange={onChange}
          animated
          activeKey={activeKey}
          className="font-VelaSansRegular mt-2"
        />
      </Modal>

      {/*nautilus wallet button*/}
      <Modal
        className="ergo-pay-wallet-modal"
        open={isNautilusOpen}
        onOk={handleNautilusOk}
        onCancel={handleNautilusCancel}
        footer={null}
        style={{ fontFamily: `'Space Grotesk', sans-serif`, maxWidth: 464 }}
      >
        {walletName && walletName === "ergopay" ? (
          <div
            style={{
              fontFamily: `'Space Grotesk', sans-serif`,
            }}
          >
            <div className="flex items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="black"></circle>
                <path
                  d="M20.6979 11.7378L18.3358 6.03509C18.2663 5.86717 18.1328 5.73375 17.9649 5.66419L12.2622 3.30213C12.0943 3.23262 11.9057 3.23262 11.7377 3.30213L6.03522 5.66419C5.86729 5.73375 5.73387 5.86717 5.6643 6.03509L3.30225 11.7378C3.26776 11.8209 3.25 11.91 3.25 12C3.25 12.09 3.26776 12.1792 3.30225 12.2623L5.6643 17.9648C5.73387 18.1327 5.86729 18.2661 6.03522 18.3357L11.7377 20.6978C11.8209 20.7322 11.91 20.75 12 20.75C12.09 20.75 12.1791 20.7322 12.2622 20.6978L17.9649 18.3357C18.1328 18.2661 18.2663 18.1327 18.3358 17.9648L20.6979 12.2623C20.7674 12.0944 20.7674 11.9057 20.6979 11.7378ZM14.832 9.75245H11.5165L13.5717 11.9047L11.4444 14.2474H14.8311V15.8212H9.16874V14.3907L11.3969 11.9241L9.17944 9.61326V8.17888H14.8312L14.832 9.75245Z"
                  fill="white"
                ></path>
              </svg>
              <h3 className="mx-2.5 m-0 font-bold text-darkblack text-[20px]">
                ErgoPay
              </h3>

              <button
                onClick={() => setEyeOpen(!isEyeOpen)}
                className="w-6 h-6 rounded-lg flex items-center justify-center border border-[#d9d9d9] group"
              >
                {isEyeOpen ? (
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="eye-invisible"
                    width="1em"
                    height="1em"
                    fill="#262626"
                    aria-hidden="true"
                  >
                    <path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"></path>
                    <path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"></path>
                  </svg>
                ) : (
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="eye"
                    width="1em"
                    height="1em"
                    fill="#262626"
                    aria-hidden="true"
                  >
                    <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                  </svg>
                )}
              </button>
            </div>
            <div>
              <p className="mb-2 mt-4 text-[14px] font-semibold text-darkblack font-VelaSanSemiBold ">
                Total balance
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className={`${commonStyle.ergoBalanceDiv} font-VelaSansRegular`}
            >
              <div className="flex items-center">
                <ErgoIconModal />
                <p
                  className={`${commonStyle.ergoBalanceText} ${
                    isEyeOpen ? "blur-sm" : ""
                  } font-SpaceGrotesk`}
                >
                  {numberWithCommas(parseInt(ergBalance), 9)} ERG
                </p>
              </div>
              <div>
                <p
                  className={`${
                    isEyeOpen ? "blur-sm" : ""
                  } m-0 text-[12px] font-semibold font-VelaSanSemiBold text-[#595959]`}
                >
                  ${numberWithCommas(parseInt(ergBalance), 9)}
                </p>
              </div>
            </div>
            <div className="flex items-center mb-2 mt-4">
              <p className="text-[14px] font-semibold text-darkblack ont-VelaSanSemiBold">
                Active address
              </p>{" "}
              <Tooltip
                placement="top"
                title="Assets will be received at this address"
                className={commonStyle.addressIcons}
              >
                <svg
                  className="ml-1 cursor-pointer"
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="info-circle"
                  width="1em"
                  height="1em"
                  fill="#BFBFBF"
                  aria-hidden="true"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </Tooltip>
            </div>
            <div
              className={`${commonStyle.ergoBalanceDiv} flex items-center justify-between`}
            >
              {/* FOR DESKTOP  */}
              <p
                className={`${commonStyle.ergoBalanceAdd} ${
                  isEyeOpen ? "blur-sm" : ""
                } font-SpaceGrotesk hidden sm:inline-block`}
              >
                {walletAddress
                  ? walletAddress[0].slice(0, 18) +
                    "..." +
                    walletAddress[0].slice(-8)
                  : ""}
              </p>
              {/* FOR MOBILE  */}
              <p
                className={`${commonStyle.ergoBalanceAdd} ${
                  isEyeOpen ? "blur-sm" : ""
                } font-SpaceGrotesk sm:hidden`}
              >
                {walletAddress
                  ? walletAddress[0].slice(0, 13) +
                    "..." +
                    walletAddress[0].slice(-6)
                  : ""}
              </p>
              <div className="flex items-center space-x-1.5">
                <div className="cursor-pointer">
                  <CopyToClipboard
                    text={walletAddress![0]}
                    onCopy={(e) =>
                      handleCopyText("Address successfully copied!")
                    }
                  >
                    <Tooltip placement="top" title="Copy Address to clipboard.">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center border border-[#d9d9d9] group">
                        <svg
                          className="group-hover:fill-primary fill-darkblack"
                          width="14"
                          height="14"
                          viewBox="0 0 13 13"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M10 2H0.5C0.223437 2 0 2.22344 0 2.5V12C0 12.2766 0.223437 12.5 0.5 12.5H10C10.2766 12.5 10.5 12.2766 10.5 12V2.5C10.5 2.22344 10.2766 2 10 2ZM9.375 11.375H1.125V3.125H9.375V11.375ZM12 0H2.375C2.30625 0 2.25 0.05625 2.25 0.125V1C2.25 1.06875 2.30625 1.125 2.375 1.125H11.375V10.125C11.375 10.1938 11.4313 10.25 11.5 10.25H12.375C12.4438 10.25 12.5 10.1938 12.5 10.125V0.5C12.5 0.223437 12.2766 0 12 0Z"></path>
                        </svg>
                      </span>
                    </Tooltip>
                  </CopyToClipboard>
                </div>

                <div className="cursor-pointer">
                  <a
                    href={`${EXPLORER_URL(isMainnet!)}/addresses/${
                      walletAddress![0]
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Tooltip placement="top" title="View on explorer.">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center border border-[#d9d9d9] group">
                        <svg
                          className="group-hover:fill-primary fill-darkblack"
                          width="14"
                          height="14"
                          viewBox="0 0 12 12"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M10.6667 10.6667H1.33333V1.33333H6V0H1.33333C0.593333 0 0 0.6 0 1.33333V10.6667C0 11.4 0.593333 12 1.33333 12H10.6667C11.4 12 12 11.4 12 10.6667V6H10.6667V10.6667ZM7.33333 0V1.33333H9.72667L3.17333 7.88667L4.11333 8.82667L10.6667 2.27333V4.66667H12V0H7.33333Z"></path>
                        </svg>
                      </span>
                    </Tooltip>
                  </a>
                </div>
              </div>
            </div>
            {walletAssets.length > 0 && (
              <div>
                <p className="mb-2 mt-4 text-[14px] sm:text-[16px] font-VelaSanSemiBold text-darkblack">
                  Tokens
                </p>
              </div>
            )}

            <div
              style={
                walletAssets.length > 4
                  ? { maxHeight: 275, overflowY: "scroll" }
                  : undefined
              }
            >
              {walletAssets.map((item: Token) => (
                <div
                  key={item.tokenId}
                  className={`flex items-center justify-between ${commonStyle.ergoTokenBalanceDiv}`}
                >
                  <div className="flex items-center">
                    <Image
                      src={`https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/ergo/${item.tokenId}.svg`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = `https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/empty.svg`;
                      }}
                      alt="logo"
                      width={25}
                      height={25}
                    />
                    <div>
                      <p className={commonStyle.ergoBalanceTokenP}>
                        {item.name}
                      </p>
                    </div>
                  </div>
                  <div className={`${isEyeOpen ? "blur-sm" : ""}`}>
                    <p className="m-0">
                      {numberWithCommas(item.amount, item.decimals)}
                    </p>
                    <small
                      className="m-0 flex justify-end"
                      style={{
                        color: "#A6A6A6",
                      }}
                    >
                      ${item.usdValue === 0 ? "0.00" : item.usdValue}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <DisconnectNautilusWalletButton
              disconnectWallet={() =>
                disconnectWallet(
                  setWalletConnected,
                  walletName,
                  setWalletName,
                  setWalletAddress
                )
              }
              setIsNautilusOpen={setIsNautilusOpen}
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3">
              <Image alt="img" height="32" width="32" src={NautilusLogo} />
              <h5 className="ms-3 m-0 text-[18px] font-bold text-black font-SpaceGrotesk">
                Nautilus Wallet
              </h5>
              <button
                className="border border-[#d9d9d9] min-w-[24px] min-h-[24px]  flex items-center justify-center rounded-md"
                onClick={() => setEyeOpen(!isEyeOpen)}
              >
                {isEyeOpen ? (
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="eye-invisible"
                    width="1em"
                    height="1em"
                    fill="#262626"
                    aria-hidden="true"
                  >
                    <path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"></path>
                    <path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"></path>
                  </svg>
                ) : (
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="eye"
                    width="1em"
                    height="1em"
                    fill="#262626"
                    aria-hidden="true"
                  >
                    <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                  </svg>
                )}
              </button>
            </div>

            <div>
              <p className="mb-2 mt-4 text-[14px] font-semibold text-darkblack font-VelaSanSemiBold">
                Total balance
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className={`${commonStyle.ergoBalanceDiv}`}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <ErgoIconModal />
                <p
                  className={`${commonStyle.ergoBalanceText} ${
                    isEyeOpen ? "blur-sm" : ""
                  } `}
                >
                  {numberWithCommas(parseInt(ergBalance), 9)} ERG
                </p>
              </div>
              <div>
                <p
                  className={`${
                    isEyeOpen ? "blur-sm" : ""
                  } m-0 text-[12px] font-semibold font-VelaSanSemiBold text-[#595959]`}
                >
                  ${ergUSDValue}
                </p>
              </div>
            </div>

            <div className="flex items-center mb-2 mt-4">
              <p className=" text-[14px] font-semibold text-darkblack font-VelaSanSemiBold">
                Active address
              </p>
              <Tooltip
                placement="top"
                title="Assets will be received at this address"
                className={commonStyle.addressIcons}
              >
                <svg
                  className="ml-1 cursor-pointer"
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="info-circle"
                  width="1em"
                  height="1em"
                  fill="#BFBFBF"
                  aria-hidden="true"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </Tooltip>
            </div>
            <div
              className={`flex align-items-center justify-between ${commonStyle.ergoBalanceDiv}`}
            >
              <div>
                <p
                  className={`${commonStyle.ergoBalanceAdd} ${
                    isEyeOpen ? "blur-sm" : ""
                  } hidden sm:block`}
                >
                  {walletAddress
                    ? walletAddress[0].slice(0, 18) +
                      "..." +
                      walletAddress[0].slice(-8)
                    : ""}
                </p>{" "}
                <p
                  className={`${commonStyle.ergoBalanceAdd} ${
                    isEyeOpen ? "blur-sm" : ""
                  } sm:hidden`}
                >
                  {walletAddress
                    ? walletAddress[0].slice(0, 14) +
                      "..." +
                      walletAddress[0].slice(-6)
                    : ""}
                </p>
              </div>

              <div className="flex items-start">
                <div className="mr-3 cursor-pointer">
                  <CopyToClipboard
                    text={walletAddress ? walletAddress[0] : ""}
                    onCopy={(e) =>
                      handleCopyText("Address successfully copied!")
                    }
                  >
                    <Tooltip placement="top" title="Copy Address to clipboard.">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center border border-[#d9d9d9] group">
                        <svg
                          className="group-hover:fill-primary fill-darkblack"
                          width="14"
                          height="14"
                          viewBox="0 0 13 13"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M10 2H0.5C0.223437 2 0 2.22344 0 2.5V12C0 12.2766 0.223437 12.5 0.5 12.5H10C10.2766 12.5 10.5 12.2766 10.5 12V2.5C10.5 2.22344 10.2766 2 10 2ZM9.375 11.375H1.125V3.125H9.375V11.375ZM12 0H2.375C2.30625 0 2.25 0.05625 2.25 0.125V1C2.25 1.06875 2.30625 1.125 2.375 1.125H11.375V10.125C11.375 10.1938 11.4313 10.25 11.5 10.25H12.375C12.4438 10.25 12.5 10.1938 12.5 10.125V0.5C12.5 0.223437 12.2766 0 12 0Z"></path>
                        </svg>
                      </span>
                    </Tooltip>
                  </CopyToClipboard>
                </div>
                <div className="cursor-pointer">
                  <a
                    href={`${EXPLORER_URL(isMainnet!)}/addresses/${
                      walletAddress ? walletAddress[0] : ""
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Tooltip placement="top" title="View on explorer.">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center border border-[#d9d9d9] group">
                        <svg
                          className="group-hover:fill-primary fill-darkblack"
                          width="14"
                          height="14"
                          viewBox="0 0 12 12"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M10.6667 10.6667H1.33333V1.33333H6V0H1.33333C0.593333 0 0 0.6 0 1.33333V10.6667C0 11.4 0.593333 12 1.33333 12H10.6667C11.4 12 12 11.4 12 10.6667V6H10.6667V10.6667ZM7.33333 0V1.33333H9.72667L3.17333 7.88667L4.11333 8.82667L10.6667 2.27333V4.66667H12V0H7.33333Z"></path>
                        </svg>
                      </span>
                    </Tooltip>
                  </a>
                </div>
              </div>
            </div>
            {walletAssets.length > 0 && (
              <div>
                <p className="mb-2 mt-4 text-[14px] font-semibold text-darkblack font-VelaSanSemiBold">
                  Tokens
                </p>
              </div>
            )}

            <div
              style={
                walletAssets.length > 4
                  ? { maxHeight: 275, overflowY: "scroll" }
                  : undefined
              }
            >
              {walletAssets.map((item: Token) => (
                <div
                  key={item.tokenId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className={`${commonStyle.ergoTokenBalanceDiv} font-VelaSansRegular`}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                      src={`https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/ergo/${item.tokenId}.svg`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = `https://raw.githubusercontent.com/spectrum-finance/token-logos/master/logos/empty.svg`;
                      }}
                      alt="logo"
                      width={25}
                      height={25}
                    />
                    <div>
                      <p className={commonStyle.ergoBalanceTokenP}>
                        {item.name}
                      </p>
                    </div>
                  </div>
                  <div className={`${isEyeOpen ? "blur-sm" : ""}`}>
                    <p className="m-0 font-bold">
                      {numberWithCommas(item.amount, item.decimals)}
                    </p>
                    <small
                      className="m-0 flex justify-end"
                      style={{
                        color: "#949494",
                      }}
                    >
                      ${item.usdValue === 0 ? "0.00" : item.usdValue}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <DisconnectNautilusWalletButton
              disconnectWallet={() =>
                disconnectWallet(
                  setWalletConnected,
                  walletName,
                  setWalletName,
                  setWalletAddress
                )
              }
              setIsNautilusOpen={setIsNautilusOpen}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ConnectWallet;
