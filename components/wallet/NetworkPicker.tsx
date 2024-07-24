import React, { useEffect, useState } from "react";
import ErgoIcon from "../Common/ErgoIcon";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

const networks: Array<INetwork> = [
  {
    id: 1,
    name: "Mainnet",
    icon: ErgoIcon,
    network: "Ergo",
    isMainnet: true,
  },
  {
    id: 2,
    name: "Testnet",
    icon: ErgoIcon,
    network: "Ergo",
    isMainnet: false,
  },
];

interface INetwork {
  id: number;
  name: string;
  icon: typeof ErgoIcon;
  network: string;
  isMainnet: boolean;
}

const NetworkPicker: React.FC = () => {
  const [selected, setSelected] = useState<INetwork>(networks[0]);

  const handleMenuClick = (network: INetwork) => {
    console.log("Network isMainNet " + network.isMainnet);
    localStorage.setItem("IsMainnet", network.isMainnet ? "true" : "false");

    setSelected(network);
    localStorage.removeItem("walletConfig");
    window.location.reload();
  };

  useEffect(() => {
    const isMainnet = localStorage.getItem("IsMainnet");
    console.log("Storage Network isMainNet " + isMainnet);

    if (isMainnet === "true") {
      setSelected(networks[0]);
    } else {
      setSelected(networks[1]);
    }
  }, []);

  return (
    <Listbox
      value={selected}
      onChange={(selectedNetwork) => setSelected(selectedNetwork)}
    >
      <div className="relative">
        <ListboxButton className="relative rounded-full cursor-default rounded-md bg-neutraldark py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm sm:text-sm sm:leading-6">
          <div className="flex space-x-2 text-white font-thin text-sm items-center">
            <ErgoIcon />
            <div>{selected.name}</div>
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-200"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutraldark py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in text-sm"
        >
          {networks.map((network) => (
            <ListboxOption
              onClick={(e) => handleMenuClick(network)}
              key={network.id}
              value={network}
              className="group relative cursor-default select-none py-2 px-4 text-white data-[focus]:bg-gluongold/20 data-[focus]:text-white data-[selected]:bg-gluongold"
            >
              <div className="flex flex-row space-x-2 ">
                <span className="">
                  <network.icon aria-hidden="true" />
                </span>
                <span className="block truncate font-sm group-data-[selected]:font-semibold ">
                  {network.name}
                </span>
              </div>
              {/* <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden"></span> */}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default NetworkPicker;
