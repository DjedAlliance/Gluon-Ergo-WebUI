import axios from "axios";
import { ErgoTransaction } from "@/types/nodeApi";
import { GLUONW_NODE_API_URL } from "../constants";
import { timeout } from "rxjs";

export class NodeApi {
  private readonly nodeBaseURI: string;
  private readonly gluownNodeBaseURI: string;
  constructor(nodeBaseURI: string, gluownNodeBaseURI: string) {
    this.nodeBaseURI = nodeBaseURI.replace(/[\\/]+$/, "");
    this.gluownNodeBaseURI = gluownNodeBaseURI.replace(/[\\/]+$/, "");
  }

  async transactionsUnconfirmedByTransactionId(
    txId: string
  ): Promise<ErgoTransaction> {
    const url = `${this.nodeBaseURI}/transactions/unconfirmed/byTransactionId/${txId}`;
    const response = await axios.get(url);
    return response.data;
  }
  async getNeutronsPrice(): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/neutrons/price`;
    return await axios.get(url);
  }
  async getProtonsPrice(): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/protons/price`;
    return await axios.get(url);
  }
  async getFissionPrice(ergAmount: number): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/fission/${ergAmount}`;
    return await axios.get(url);
  }
  async getTransmuteGoldToRsvRate(goldAmount: number): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/transmute/toProtons/${goldAmount}`;
    return await axios.get(url);
  }
  async getTransmuteRsvToGoldRate(rsvAmount: number): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/transmute/toNeutrons/${rsvAmount}`;
    return await axios.get(url);
  }
  async getMintGoldRate(ergAmount: string): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/mint/neutrons/${ergAmount}`;
    return await axios.get(url);
  }
  async getMintRsvRate(ergAmount: string): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/mint/protons/${ergAmount}`;
    return await axios.get(url);
  }
  async putFissionService(
    walletAddress: string,
    ergAmount: number,
    isEIP12: boolean
  ): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/fission/${ergAmount}/${isEIP12}`;
    const response = await axios.put(url, {
      walletAddress: walletAddress,
    });
    return response;
  }
  async putTransmuteGoldToRsv(
    walletAddress: string,
    goldAmount: number,
    isEIP12: boolean
  ): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/transmute/toProtons/${goldAmount}/${isEIP12}`;
    const response = await axios.put(url, {
      walletAddress: walletAddress,
    });
    return response;
  }
  async putTransmuteRsvToGold(
    walletAddress: string,
    rsvAmount: number,
    isEIP12: boolean
  ): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/transmute/toNeutrons/${rsvAmount}/${isEIP12}`;
    const response = await axios.put(url, {
      walletAddress: walletAddress,
    });
    return response;
  }
  async putMintGold(
    walletAddress: string,
    ergAmount: number,
    isEIP12: boolean
  ): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/mint/neutrons/${ergAmount}/${isEIP12}`;
    const response = await axios.put(
      url,
      {
        walletAddress: walletAddress,
      },
      {
        timeout: 20000,
      }
    );
    return response;
  }
  async putMintRsv(
    walletAddress: string,
    ergAmount: number,
    isEIP12: boolean
  ): Promise<any> {
    const url = `${this.gluownNodeBaseURI}/mint/protons/${ergAmount}/${isEIP12}`;
    const response = await axios.put(
      url,
      {
        walletAddress: walletAddress,
      },
      {
        timeout: 20000,
      }
    );
    return response;
  }
}
