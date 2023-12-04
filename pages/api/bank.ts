import type { NextApiRequest, NextApiResponse } from "next";
import {
    apiPrecision,
    apiPrecisionBigInt,
    BANK_SINGLETON_TOKEN_ID,
    explorerClient,
    UIMultiplier,
} from "@/blockchain/ergo/constants";
import { HodlBankContract } from "@/blockchain/ergo/phoenixContracts/BankContracts/HodlBankContract";

type BankAPIData = {
    ergPerToken: number;
    emissionAmount: number;
    tvl: number;
    protocolFeesCollected: number;
    height: number;
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
    const hodlBankContract = new HodlBankContract(bankBox);

    const currentPrice = hodlBankContract.mintAmount(BigInt(1e9));
    const tvl = hodlBankContract.getTVL();

    const currentPriceUI =
        Number((currentPrice * apiPrecisionBigInt) / UIMultiplier) / apiPrecision;

    const circulatingSupplyUI =
        Number(
            (hodlBankContract.getHodlERG3EmissionAmount() * apiPrecisionBigInt) /
            UIMultiplier
        ) / apiPrecision;

    const tvlUI =
        Number((tvl * apiPrecisionBigInt) / UIMultiplier) / apiPrecision;

    const protocolFeesCollectedUI =
        Number(
            (hodlBankContract.getProtocolFeesCollected() * apiPrecisionBigInt) /
            UIMultiplier
        ) / apiPrecision;

    res.status(200).json({
        hodlERG3: {
            ergPerToken: currentPriceUI,
            emissionAmount: circulatingSupplyUI,
            tvl: tvlUI,
            protocolFeesCollected: protocolFeesCollectedUI,
            height: hodlBankContract.getBoxBlockHeight(),
        },
    });
}
