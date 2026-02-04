import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'mainnet' | 'testnet' | 'devnet';

export const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

export { network };
