import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import CustomTooltip from "./CustomTooltip";
import {
  MIN_MINER_FEE,
  MIN_TX_OPERATOR_FEE,
} from "@/blockchain/ergo/constants";
import { hasDecimals, localStorageKeyExists } from "@/common/utils";
import { toast } from "react-toastify";
import { noti_option_close } from "@/components/Notifications/Toast";

export default function SettingPopup() {
  const [nitroValue, setNitroValue] = useState<number | string>("1.000");
  const [minerNitroValue, setMinerNitroValue] = useState<number | string>(
    "1.000"
  );

  useEffect(() => {
    if (localStorageKeyExists("txOperatorFee")) {
      setNitroValue(
        Number(
          Number(localStorage.getItem("txOperatorFee")!) /
            Number(MIN_TX_OPERATOR_FEE)
        ).toFixed(3)
      );
    }
    if (localStorageKeyExists("minerFee")) {
      setMinerNitroValue(
        Number(
          Number(localStorage.getItem("minerFee")!) / Number(MIN_MINER_FEE)
        ).toFixed(3)
      );
    }
  }, []);
  const handleNitro = (nitroValue: number) => {
    if (hasDecimals(nitroValue * 1e3)) {
      toast.dismiss();
      toast.warn("max 3 decimals", noti_option_close("try-again"));
      return;
    }
    const txOperatorFee =
      (BigInt(MIN_TX_OPERATOR_FEE) * BigInt(nitroValue * 1e3)) / BigInt(1e3);

    setNitroValue(nitroValue);
    localStorage.setItem("txOperatorFee", txOperatorFee.toString());
  };

  const handleMinerNitro = (nitroValue: number) => {
    if (hasDecimals(nitroValue * 1e3)) {
      toast.dismiss();
      toast.warn("max 3 decimals", noti_option_close("try-again"));
      return;
    }
    const minerFee =
      (BigInt(MIN_MINER_FEE) * BigInt(nitroValue * 1e3)) / BigInt(1e3);

    setMinerNitroValue(nitroValue);
    localStorage.setItem("minerFee", minerFee.toString());
  };

  return (
    <Popover className="relative">
      {() => (
        <>
          <Popover.Button className="flex items-center outline-none">
            <SettingIcon />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-0px sm:left-1/2 z-10 mt-6 w-screen max-w-xs md:max-w-sm -translate-x-1/2 transform">
              <div className="bg-white border border-primary px-4 py-3 shadow-xl rounded-md">
                <h3 className="text-black font-semibold text-xl mb-2">
                  Transaction Settings
                </h3>

                {/* NITRO  */}
                <div className="mb-2">
                  <label
                    htmlFor="Nitro"
                    className="flex items-center font-medium space-x-1 py-1"
                  >
                    Nitro{" "}
                    <CustomTooltip text="Tx operator fee multiplier. The minimum value of the tx operator fee is 0.001 ERG">
                      <InfoIcon />
                    </CustomTooltip>
                  </label>

                  <div className="border border-gray p-1 flex items-center justify-between rounded-md space-x-2">
                    <button
                      className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded-md text-md px-3 sm:px-5 py-2 sm:py-2.5"
                      onClick={() => {
                        localStorage.setItem(
                          "txOperatorFee",
                          MIN_TX_OPERATOR_FEE.toString()
                        );
                        setNitroValue("1.000");
                      }}
                    >
                      Minimum
                    </button>
                    <div className="border border-gray rounded-md">
                      <input
                        type="number"
                        // defaultValue={localStorageKeyExists("txOperatorFee") ? (BigInt(localStorage.getItem("txOperatorFee")!)/BigInt(MIN_TX_OPERATOR_FEE)).toString() : "1.00"}
                        value={nitroValue}
                        className="w-full outline-none border-0 text-right focus-within:outline-none focus:shadow-none focus:ring-0 focus:outline-none rounded-md"
                        onChange={(e) =>
                          handleNitro(parseFloat(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* MINER FEE  */}
                <div className="mb-2">
                  <label
                    htmlFor="Nitro"
                    className="flex items-center font-medium space-x-1 py-1"
                  >
                    Miner Nitro{" "}
                    <CustomTooltip text="Miner fee multiplier. The minimum value of the miner fee is 0.001 ERG.">
                      <InfoIcon />
                    </CustomTooltip>
                  </label>

                  <div className="border border-gray p-1 flex items-center justify-between rounded-md space-x-2">
                    <button
                      className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded-md text-md px-3 sm:px-5 py-2 sm:py-2.5"
                      onClick={() => {
                        localStorage.setItem(
                          "minerFee",
                          MIN_MINER_FEE.toString()
                        );
                        setMinerNitroValue("1.000");
                      }}
                    >
                      Minimum
                    </button>
                    <div className="border border-gray rounded-md">
                      <input
                        type="number"
                        value={minerNitroValue}
                        onChange={(e) =>
                          handleMinerNitro(parseFloat(e.target.value))
                        }
                        className="w-full outline-none border-0 text-right focus-within:outline-none focus:shadow-none focus:ring-0 focus:outline-none rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/*/!* BOX VALUE  *!/*/}
                {/*<div className="mb-2">*/}
                {/*  <label*/}
                {/*    htmlFor="Nitro"*/}
                {/*    className="flex items-center font-medium space-x-1 py-1"*/}
                {/*  >*/}
                {/*    Box Value{" "}*/}
                {/*    <CustomTooltip text="Your transaction will revert if the price changes unfavorably by more than this percentage">*/}
                {/*      <InfoIcon />*/}
                {/*    </CustomTooltip>*/}
                {/*  </label>*/}

                {/*  <div className="border border-gray p-1 flex items-center justify-between rounded-md space-x-2">*/}
                {/*    <button className="focus:outline-none text-white primary-gradient hover:opacity-80 focus:ring-4 focus:ring-purple-300 font-medium rounded-md text-md px-3 sm:px-5 py-2 sm:py-2.5">*/}
                {/*      Minimum*/}
                {/*    </button>*/}
                {/*    <div className="border border-gray rounded-md">*/}
                {/*      <input*/}
                {/*        type="number"*/}
                {/*        className="w-full outline-none border-0 text-right focus-within:outline-none focus:shadow-none focus:ring-0 focus:outline-none rounded-md"*/}
                {/*      />*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

export const SettingIcon = () => {
  return (
    <>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_43_2)">
          <path
            d="M11.078 1.82514e-06C11.372 1.82514e-06 11.635 0.183002 11.734 0.457002L12.44 2.414C12.693 2.477 12.91 2.54 13.094 2.606C13.295 2.678 13.554 2.787 13.874 2.936L15.518 2.066C15.6522 1.99491 15.8058 1.96925 15.9558 1.99287C16.1058 2.01649 16.2441 2.08811 16.35 2.197L17.796 3.692C17.988 3.891 18.042 4.182 17.934 4.436L17.163 6.243C17.291 6.478 17.393 6.679 17.471 6.847C17.555 7.03 17.659 7.282 17.783 7.607L19.58 8.377C19.85 8.492 20.017 8.762 19.999 9.051L19.867 11.126C19.858 11.2608 19.8096 11.39 19.7278 11.4975C19.646 11.6051 19.5345 11.6863 19.407 11.731L17.705 12.336C17.656 12.571 17.605 12.772 17.551 12.942C17.4639 13.2045 17.3645 13.4628 17.253 13.716L18.108 15.606C18.1683 15.7388 18.1846 15.8874 18.1544 16.0301C18.1241 16.1728 18.049 16.3021 17.94 16.399L16.314 17.851C16.2069 17.9462 16.0733 18.0064 15.931 18.0236C15.7888 18.0408 15.6447 18.014 15.518 17.947L13.842 17.059C13.5798 17.1978 13.3093 17.3204 13.032 17.426L12.3 17.7L11.65 19.5C11.6018 19.6318 11.5149 19.746 11.4007 19.8276C11.2865 19.9091 11.1503 19.9542 11.01 19.957L9.11 20C8.96596 20.0038 8.82429 19.9628 8.70449 19.8828C8.58468 19.8027 8.49263 19.6875 8.441 19.553L7.675 17.526C7.41365 17.4367 7.15488 17.34 6.899 17.236C6.68972 17.1454 6.48359 17.0477 6.281 16.943L4.381 17.755C4.25581 17.8084 4.11779 17.8243 3.98374 17.8007C3.8497 17.777 3.72541 17.715 3.626 17.622L2.22 16.303C2.11532 16.2052 2.04403 16.077 2.01622 15.9365C1.9884 15.796 2.00547 15.6503 2.065 15.52L2.882 13.74C2.77334 13.5292 2.67261 13.3144 2.58 13.096C2.4719 12.8287 2.37186 12.5583 2.28 12.285L0.49 11.74C0.344501 11.696 0.217595 11.6052 0.12899 11.4817C0.0403855 11.3582 -0.00495847 11.2089 3.04513e-07 11.057L0.0700003 9.136C0.0749829 9.01066 0.114137 8.88907 0.183228 8.78438C0.25232 8.67968 0.348719 8.59587 0.462 8.542L2.34 7.64C2.427 7.321 2.503 7.073 2.57 6.892C2.66434 6.65025 2.76911 6.41269 2.884 6.18L2.07 4.46C2.00823 4.32938 1.98947 4.18254 2.01642 4.04059C2.04337 3.89864 2.11465 3.76889 2.22 3.67L3.624 2.344C3.72242 2.25117 3.84557 2.18876 3.97863 2.16428C4.11169 2.1398 4.24898 2.15429 4.374 2.206L6.272 2.99C6.482 2.85 6.672 2.737 6.844 2.646C7.049 2.537 7.323 2.423 7.668 2.3L8.328 0.459002C8.37679 0.32427 8.46598 0.207883 8.58339 0.125733C8.7008 0.0435827 8.84071 -0.000326251 8.984 1.82514e-06H11.078ZM10.024 7.019C8.357 7.019 7.006 8.354 7.006 10.002C7.006 11.65 8.357 12.986 10.024 12.986C11.69 12.986 13.041 11.65 13.041 10.002C13.041 8.354 11.691 7.019 10.024 7.019Z"
            fill="black"
          />
        </g>
        <defs>
          <clipPath id="clip0_43_2">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};
export const InfoIcon = () => {
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667 12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48 10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825 4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267 15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667 22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175 19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
          fill="black"
        />
      </svg>
    </>
  );
};
