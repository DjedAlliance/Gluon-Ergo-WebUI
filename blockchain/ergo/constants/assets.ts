export const NEUTRON_TOKEN_ID = (isMainnet: boolean): string =>
  (isMainnet
    ? process.env.NEXT_PUBLIC_TESTNET_NEUTRON
    : process.env.NEXT_PUBLIC_TESTNET_NEUTRON)!?.replace(/[\\/]+$/, "");

export const PROTON_TOKEN_ID = (isMainnet: boolean): string =>
  (isMainnet
    ? process.env.NEXT_PUBLIC_TESTNET_PROTON
    : process.env.NEXT_PUBLIC_TESTNET_PROTON)!?.replace(/[\\/]+$/, "");

export const NEUTRON_NAME = "GAU";
export const PROTON_NAME = "GAUC";
