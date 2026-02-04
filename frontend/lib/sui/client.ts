import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'mainnet' | 'testnet' | 'devnet';

export const suiClient = new SuiJsonRpcClient({
  network,
  url: getJsonRpcFullnodeUrl(network),
});

export { network };
