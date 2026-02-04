import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Sui Network
  suiNetwork: process.env.SUI_NETWORK || "testnet",
  suiRpcUrl: process.env.SUI_RPC_URL || "https://fullnode.testnet.sui.io:443",
  
  // DeepBook
  deepbookIndexerUrl: process.env.DEEPBOOK_INDEXER_URL || "https://deepbook-indexer.testnet.mystenlabs.com",
  
  // Server
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};

export function validateConfig() {
  const required = ["SUI_RPC_URL", "DEEPBOOK_INDEXER_URL"];
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing optional env vars: ${missing.join(", ")}`);
  }
  
  console.log("✅ Configuration loaded");
  console.log(`   Network: ${config.suiNetwork}`);
  console.log(`   Port: ${config.port}`);
}
