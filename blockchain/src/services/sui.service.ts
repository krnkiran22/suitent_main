import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { DeepBookClient } from "@mysten/deepbook-v3";
import { config } from "../config/index.js";

export class SuiService {
  private client: SuiJsonRpcClient;

  constructor() {
    // JSON-RPC client for regular operations with explicit 'testnet' network
    this.client = new SuiJsonRpcClient({
      network: 'testnet', // Must be explicit 'testnet' or 'mainnet'
      url: config.suiRpcUrl,
    });
    
    console.log("[SuiService] Sui client created with network:", (this.client as any).network);
  }

  getClient(): SuiJsonRpcClient {
    return this.client;
  }

  getDeepBookClient(address: string): DeepBookClient {
    console.log("[SuiService] Creating DeepBookClient for address:", address);
    console.log("[SuiService] Client network:", (this.client as any).network);
    console.log("[SuiService] Config network:", config.suiNetwork);
    
    // Use DeepBookClient directly
    // Pass network explicitly since auto-detection from client doesn't work
    const deepBookClient = new DeepBookClient({
      address: address,
      client: this.client,
      network: 'testnet', // Try passing network directly instead of env
    } as any); // Type cast since we're trying undocumented parameter
    
    console.log("[SuiService] DeepBookClient created");
    console.log("[SuiService] DeepBookClient type:", typeof deepBookClient);
    console.log("[SuiService] DeepBookClient keys:", Object.keys(deepBookClient));
    
    // Check for swap methods on deepBook property
    console.log("[SuiService] Has deepBook.swapExactBaseForQuote:", 'swapExactBaseForQuote' in (deepBookClient as any).deepBook);
    console.log("[SuiService] deepBook.swapExactBaseForQuote type:", typeof (deepBookClient as any).deepBook.swapExactBaseForQuote);
    
    return deepBookClient;
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
