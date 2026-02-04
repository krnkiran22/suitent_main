import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import { config } from "../config";

export class SuiService {
  private client: SuiJsonRpcClient;

  constructor() {
    this.client = new SuiJsonRpcClient({
      network: config.suiNetwork as "mainnet" | "testnet" | "devnet",
      url: config.suiRpcUrl,
    });
  }

  getClient(): SuiJsonRpcClient {
    return this.client;
  }

  async getBalance(address: string, coinType: string): Promise<string> {
    try {
      const balance = await this.client.getBalance({
        owner: address,
        coinType,
      });
      return balance.totalBalance;
    } catch (error) {
      console.error(`Error fetching balance for ${coinType}:`, error);
      return "0";
    }
  }

  async getAllBalances(address: string) {
    try {
      const balances = await this.client.getAllBalances({
        owner: address,
      });
      return balances;
    } catch (error) {
      console.error("Error fetching all balances:", error);
      return [];
    }
  }

  async getTransactionStatus(digest: string) {
    try {
      const tx = await this.client.getTransactionBlock({
        digest,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });
      return tx;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  }

  async getReferenceGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.client.getReferenceGasPrice();
      return gasPrice.toString();
    } catch (error) {
      console.error("Error fetching gas price:", error);
      return "1000";
    }
  }
}

export const suiService = new SuiService();
