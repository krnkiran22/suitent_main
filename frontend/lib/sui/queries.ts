import { suiClient } from './client';

/**
 * Get the balance of an address
 */
export async function getBalance(address: string) {
  try {
    const balance = await suiClient.getBalance({ owner: address });
    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
}

/**
 * Get all coin balances for an address
 */
export async function getAllBalances(address: string) {
  try {
    const balances = await suiClient.getAllBalances({ owner: address });
    return balances;
  } catch (error) {
    console.error('Error fetching all balances:', error);
    return [];
  }
}

/**
 * Get owned objects by address
 */
export async function getOwnedObjects(address: string) {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: address,
      options: {
        showType: true,
        showContent: true,
        showDisplay: true,
      },
    });
    return objects.data;
  } catch (error) {
    console.error('Error fetching owned objects:', error);
    return [];
  }
}

/**
 * Get transaction details
 */
export async function getTransaction(digest: string) {
  try {
    const tx = await suiClient.getTransactionBlock({
      digest,
      options: {
        showEffects: true,
        showEvents: true,
        showInput: true,
        showObjectChanges: true,
      },
    });
    return tx;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}
