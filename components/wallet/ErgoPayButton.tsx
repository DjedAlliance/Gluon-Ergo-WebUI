import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import { addressConnectionQuery } from "@/blockchain/ergo/ergopay/addressConnectionQuery";
import { ErgoAddress, Network } from "@fleet-sdk/core";
import { toast } from "react-toastify";
import { noti_option_close } from "../Notifications/Toast";
import { handleCopyText } from "@/blockchain/ergo/wallet/utils";
import { NEXT_PUBLIC_NEST_API_URL } from "@/blockchain/ergo/constants";

const ErgoPayButton = ({
  setIsModalOpen,
  connectErgoPay,
  activeKey,
  isMainnet,
}: any) => {
  useEffect(() => {
    let intervalId: string | number | NodeJS.Timer | undefined;

    if (activeKey === "2") {
      intervalId = setInterval(() => {
        const uuid = sessionStorage.getItem("uuid");
        if (uuid) {
          addressConnectionQuery(uuid, isMainnet).then((address) => {
            if (address) {
              if (ErgoAddress.validate(address)) {
                if (
                  ErgoAddress.getNetworkType(address) !==
                  (isMainnet ? Network.Mainnet : Network.Testnet)
                ) {
                  sessionStorage.removeItem("uuid");
                  toast.dismiss();
                  toast.warn("wrong network", noti_option_close("try-again"));
                } else {
                  connectErgoPay("ergopay", address);
                }
              } else {
                sessionStorage.removeItem("uuid");
                toast.dismiss();
                toast.warn("invalid address", noti_option_close("try-again"));
              }
              setIsModalOpen(false);
              if (intervalId) {
                clearInterval(intervalId);
                intervalId = undefined; // set intervalId as undefined just to be safe
              }
            }
          });
        }
      }, 2000); // logs every 2 seconds
    }

    // this will clear the Interval when the component is unmounted or activeKey changes
    return () => {
      clearInterval(intervalId);
    };
  }, [activeKey]);

  let uuid = sessionStorage.getItem("uuid");
  if (!uuid) {
    uuid = uuidv4();
    sessionStorage.setItem("uuid", uuid);
  }

  const apiUrl = NEXT_PUBLIC_NEST_API_URL(isMainnet);
  const strippedUrl = apiUrl.replace(/^https?:\/\//, "");

  const link = `ergopay://${strippedUrl}/ergopay/generateAddressLink/${uuid}/#P2PK_ADDRESS#/`;
  const openLink = () => {
    (window as any).open(link);
  };
  return (
    <div style={{ fontFamily: `'Space Grotesk', sans-serif` }}>
      <div className="flex  justify-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
      <p className="text-center">Waiting for connection with ErgoPay</p>

      <h5 className="text-center">Scan QR code</h5>

      {/*  qr code*/}
      <div className="flex justify-center">
        <div style={{ background: "white", padding: "16px", maxWidth: 290 }}>
          {<QRCode value={link} />}
        </div>
      </div>
      <div className="text-center mt-2">
        <a
          href="https://ergoplatform.org/en/get-erg/#Wallets"
          style={{ color: "#6E64BF", textDecoration: "none" }}
          target="_blank"
          rel="noreferrer"
        >
          Find a ErgoPay compatible wallet
        </a>
      </div>

      <div className="flex justify-center mt-4">
        <Button
          block
          style={{ fontFamily: `'Space Grotesk', sans-serif` }}
          onClick={() => {
            navigator.clipboard.writeText(link);
            handleCopyText("Copied to clipboard!");
          }}
          className="mr-2"
        >
          Copy request
        </Button>

        <Button
          block
          style={{
            border: "none",
            color: "white",
            background: "#6F65C5",
            fontFamily: `'Space Grotesk', sans-serif`,
          }}
          onClick={openLink}
          className="ml-2"
        >
          Open with wallet
        </Button>
      </div>
    </div>
  );
};

export default ErgoPayButton;
