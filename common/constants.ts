const TESTNET_NEUTRON_ID = process.env.NEXT_PUBLIC_TESTNET_NEUTRON ?? "";
const TESTNET_PROTON_ID = process.env.NEXT_PUBLIC_TESTNET_PROTON ?? "";
const MAINNET_NEUTRON_ID = process.env.NEXT_PUBLIC_MAINNET_NEUTRON ?? "";
const MAINNET_PROTON_ID = process.env.NEXT_PUBLIC_MAINNET_PROTON ?? "";

export const getNeutronId = (isMainnet: boolean): string => {
  return isMainnet ? MAINNET_NEUTRON_ID : TESTNET_NEUTRON_ID;
};

export const getProtonId = (isMainnet: boolean): string => {
  return isMainnet ? MAINNET_PROTON_ID : TESTNET_PROTON_ID;
};
