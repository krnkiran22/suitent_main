import { Transaction } from '@mysten/sui/transactions';

/**
 * Create a simple transfer transaction
 */
export function createTransferTransaction(
  recipient: string,
  amount: bigint,
  coinType: string = '0x2::sui::SUI'
) {
  const tx = new Transaction();
  
  const [coin] = tx.splitCoins(tx.gas, [amount]);
  tx.transferObjects([coin], recipient);
  
  return tx;
}

/**
 * Create a swap transaction (placeholder - integrate with DeepBook/Cetus)
 */
export function createSwapTransaction(
  fromCoin: string,
  toCoin: string,
  amount: bigint
) {
  // TODO: Integrate with actual DEX
  const tx = new Transaction();
  return tx;
}
