import { OutputInfo, RegisterType, TransactionInfo } from "./explorerApi";
import {
  ErgoTransaction,
  ErgoTransactionOutput,
  Registers,
} from "@/types/nodeApi";
import { explorerClient, GLUONW_NODE_API_URL, NODE_API_URL } from "./constants";
import { NodeApi } from "./nodeApi/api";
import {
  APIFriendlyValue,
  UIFriendlyValue,
  removeBackslashes,
} from "./walletUtils/utils";
import { UnsignedTransaction } from "@nautilus-js/eip12-types";

export async function getUnConfirmedOrConfirmedTx(
  txId: string,
  isMainnet: boolean
): Promise<TransactionInfo | ErgoTransaction> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    return await nodeApi.transactionsUnconfirmedByTransactionId(txId);
  } catch (error) {
    try {
      return (await explorerClient(isMainnet).getApiV1TransactionsP1(txId))
        .data;
    } catch (e) {
      return {} as TransactionInfo;
    }
  }
}
export async function getFissionPrice(
  isMainnet: boolean,
  ergAmount: number
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    return await nodeApi.getFissionPrice(ergAmount);
  } catch (error) {
    throw error;
  }
}

export async function getFusionPrice(
  isMainnet: boolean,
  ergAmount: number
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    return await nodeApi.getFusionPrice(ergAmount);
  } catch (error) {
    throw error;
  }
}

export async function getNeutronsPrice(isMainnet: boolean): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    return await nodeApi.getNeutronsPrice();
  } catch (error) {
    throw error;
  }
}

export async function getProtonsPrice(isMainnet: boolean): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    return await nodeApi.getProtonsPrice();
  } catch (error) {
    throw error;
  }
}

export async function getTransmuteGoldToRsvRate(
  isMainnet: boolean,
  goldAmount: number
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    goldAmount = APIFriendlyValue(goldAmount, 9);
    return await nodeApi.getTransmuteGoldToRsvRate(goldAmount);
  } catch (error) {
    throw error;
  }
}

export async function getTransmuteRsvToGoldRate(
  isMainnet: boolean,
  rsvAmount: number
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    rsvAmount = APIFriendlyValue(rsvAmount, 9);
    return await nodeApi.getTransmuteRsvToGoldRate(rsvAmount);
  } catch (error) {
    throw error;
  }
}

export async function getMintGoldRate(
  isMainnet: boolean,
  ergAmount: string
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    return await nodeApi.getMintGoldRate(ergAmount);
  } catch (error) {
    throw error;
  }
}

export async function getMintRsvRate(
  isMainnet: boolean,
  ergAmount: string
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    return await nodeApi.getMintRsvRate(ergAmount);
  } catch (error) {
    throw error;
  }
}

export async function UnsignedTxForFission(
  isMainnet: boolean,
  walletAddress: string,
  ergAmount: number,
  isEIP12: boolean
): Promise<UnsignedTransaction> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    const response = await nodeApi.putFissionService(
      walletAddress,
      ergAmount,
      isEIP12
    );
    const parsedResponse = JSON.parse(removeBackslashes(response.data));
    console.log(parsedResponse);
    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function UnsignedTxForFusion(
  isMainnet: boolean,
  walletAddress: string,
  ergAmount: number,
  isEIP12: boolean
): Promise<UnsignedTransaction> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    const response = await nodeApi.putFusionService(
      walletAddress,
      ergAmount,
      isEIP12
    );
    const parsedResponse = JSON.parse(removeBackslashes(response.data));
    console.log(parsedResponse);
    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function UnsignedTxForTransmuteGoldToRsv(
  isMainnet: boolean,
  walletAddress: string,
  goldAmount: number,
  isEIP12: boolean
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    goldAmount = APIFriendlyValue(goldAmount, 9);
    const response = await nodeApi.putTransmuteGoldToRsv(
      walletAddress,
      goldAmount,
      isEIP12
    );
    const parsedResponse = JSON.parse(removeBackslashes(response.data));
    console.log(parsedResponse);
    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function UnsignedTxForTransmuteRsvToGold(
  isMainnet: boolean,
  walletAddress: string,
  rsvAmount: number,
  isEIP12: boolean
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    rsvAmount = APIFriendlyValue(rsvAmount, 9);
    const response = await nodeApi.putTransmuteRsvToGold(
      walletAddress,
      rsvAmount,
      isEIP12
    );
    const parsedResponse = JSON.parse(removeBackslashes(response.data));
    console.log(parsedResponse);
    return parsedResponse;
  } catch (error) {
    throw error;
  }
}

export async function UnsignedTxForMintGold(
  isMainnet: boolean,
  walletAddress: string,
  ergAmount: number,
  isEIP12: boolean
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    const response = await nodeApi.putMintGold(
      walletAddress,
      ergAmount,
      isEIP12
    );

    if (Array.isArray(response.data)) {
      const dataResponse = [];
      for (let i = 0; i < response.data.length; i++) {
        const result = JSON.parse(removeBackslashes(response.data[i]));
        dataResponse.push(result);
      }
      console.log(dataResponse);
      return dataResponse;
    } else {
      const parsedResponse = JSON.parse(removeBackslashes(response.data));
      console.log(parsedResponse);
      return parsedResponse;
    }
  } catch (error) {
    throw error;
  }
}

export async function UnsignedTxForMintRsv(
  isMainnet: boolean,
  walletAddress: string,
  ergAmount: number,
  isEIP12: boolean
): Promise<any> {
  const nodeApi = new NodeApi(
    NODE_API_URL(isMainnet),
    GLUONW_NODE_API_URL(isMainnet)
  );
  try {
    const response = await nodeApi.putMintRsv(
      walletAddress,
      ergAmount,
      isEIP12
    );
    if (Array.isArray(response.data)) {
      const dataResponse = [];
      for (let i = 0; i < response.data.length; i++) {
        const result = JSON.parse(removeBackslashes(response.data[i]));
        dataResponse.push(result);
      }
      console.log(dataResponse);
      return dataResponse;
    } else {
      const parsedResponse = JSON.parse(removeBackslashes(response.data));
      console.log(parsedResponse);
      return parsedResponse;
    }
  } catch (error) {
    throw error;
  }
}
