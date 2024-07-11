import type { NextApiRequest, NextApiResponse } from "next";
import {
  apiPrecision,
  BANK_SINGLETON_TOKEN_ID,
  explorerClient,
} from "@/blockchain/ergo/constants";

type BankAPIData = {
  ergPerToken: number;
  emissionAmount: number;
  tvl: number;
  protocolFeesCollected: number;
};

type APIResponse = {
  hodlERG3: BankAPIData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  const bankBox = (
    await explorerClient(true).getApiV1BoxesUnspentBytokenidP1(
      BANK_SINGLETON_TOKEN_ID(true)
    )
  ).data.items![0];

  const currentPrice = 123;
  const tvl = 123;

  const currentPriceUI = Number(123) / apiPrecision;

  const circulatingSupplyUI = 123;

  const tvlUI = 123;

  const protocolFeesCollectedUI = 123;

  res.status(200).json({
    hodlERG3: {
      ergPerToken: currentPriceUI,
      emissionAmount: circulatingSupplyUI,
      tvl: tvlUI,
      protocolFeesCollected: protocolFeesCollectedUI,
    },
  });
}
