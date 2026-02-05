import { SuiGrpcClient } from '@mysten/sui/grpc';
import { deepbook, type DeepBookClient } from '@mysten/deepbook-v3';
import type { ClientWithExtensions } from '@mysten/sui/client';

export type DeepBookExtendedClient = ClientWithExtensions<{ deepbook: DeepBookClient }>;

export function createDeepBookClient(address: string, env: 'testnet' | 'mainnet'): DeepBookExtendedClient {
	return new SuiGrpcClient({
		network: env,
		baseUrl:
			env === 'mainnet'
				? 'https://fullnode.mainnet.sui.io:443'
				: 'https://fullnode.testnet.sui.io:443',
	}).$extend(
		deepbook({
			address,
		}),
	);
}
