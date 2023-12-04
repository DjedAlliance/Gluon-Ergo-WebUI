import {OutputInfo, TransactionInfo} from "@/blockchain/ergo/explorerApi";

export async function getTotalBalance(explorerClient: any, address: string): Promise<any[]>{
  const convertedResponse: any[] = [];
  const balance = (await explorerClient.getApiV1AddressesP1BalanceConfirmed(address)).data

  const ergBalance = {
    tokenId: "ERG",
    balance: balance.nanoErgs.toString(),
  };

  convertedResponse.push(ergBalance);

  for (const token of balance.tokens) {
    const tokenIssuanceBox = await getTokenIssuanceBox(explorerClient, token.tokenId);
    if(isTokenAsset(tokenIssuanceBox)){
      const tokenBalance = {
        tokenId: token.tokenId,
        balance: token.amount.toString(),
      };
      convertedResponse.push(tokenBalance);
    }
  }

  return convertedResponse;
}

async function getTokenIssuanceBox(explorerClient: any, tokenId: string): Promise<OutputInfo> {
  const tokenIssuerBox: OutputInfo = (await explorerClient.getApiV1BoxesP1(tokenId)).data;
  const spentTransactionId: string = tokenIssuerBox.spentTransactionId!;

  const mintTx: TransactionInfo = (await explorerClient.getApiV1TransactionsP1(spentTransactionId)).data;

  return mintTx.outputs!.find((o) => o.assets?.find((a) => a.tokenId === tokenId))!;
}

function isTokenAsset(issuanceBox: OutputInfo): boolean {
  return issuanceBox.additionalRegisters.R7 === undefined;
}