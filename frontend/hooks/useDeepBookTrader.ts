'use client';

import { useState, useCallback, useEffect } from 'react';

import { SuiGrpcClient } from '@mysten/sui/grpc';
import { deepbook, type DeepBookClient, type BalanceManager } from '@mysten/deepbook-v3';
import type { ClientWithExtensions } from '@mysten/sui/client';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { useTurnkey } from '@turnkey/react-wallet-kit';

const BALANCE_MANAGER_KEY = 'MANAGER_1';

class DeepBookTrader {
  client: ClientWithExtensions<{ deepbook: DeepBookClient }>;
  address: string;
  env: 'testnet' | 'mainnet';
  walletType: 'standard' | 'turnkey' | null;

  constructor(address: string, env: 'testnet' | 'mainnet', walletType: 'standard' | 'turnkey' | null) {
    this.address = address;
    this.env = env;
    this.walletType = walletType;
    this.client = this.#createClient(env);
  }

  #createClient(env: 'testnet' | 'mainnet', balanceManagers?: { [key: string]: BalanceManager }) {
    return new SuiGrpcClient({
      network: env,
      baseUrl:
        env === 'mainnet'
          ? 'https://fullnode.mainnet.sui.io:443'
          : 'https://fullnode.testnet.sui.io:443',
    }).$extend(
      deepbook({
        address: this.address,
        balanceManagers,
      }),
    );
  }

  getActiveAddress() {
    return this.address;
  }

  // Try alternative approach using the client's transaction creation
  createBalanceManagerTransactionAlt() {
    console.log('[DeepBookTrader] Trying alternative transaction approach');
    
    try {
      // Create transaction using the same pattern as the docs but with direct call
      const tx = new Transaction();
      
      // Try calling the SDK method directly without storing the function
      this.client.deepbook.balanceManager.createAndShareBalanceManager()(tx);
      
      console.log('[DeepBookTrader] Alternative approach succeeded');
      return tx;
    } catch (error) {
      console.error('[DeepBookTrader] Alternative approach failed:', error);
      throw error;
    }
  }

  // Create a Balance Manager and reinitialize client
  createBalanceManagerTransaction() {
    console.log('[DeepBookTrader] Starting transaction creation');
    console.log('[DeepBookTrader] Client details:', {
      hasDeepbook: !!this.client.deepbook,
      hasBalanceManager: !!this.client.deepbook?.balanceManager,
      address: this.address
    });
    
    try {
      // Use the Transaction from the same source as DeepBook SDK
      const tx = new Transaction();
      console.log('[DeepBookTrader] Transaction created:', tx);
      console.log('[DeepBookTrader] Transaction constructor name:', tx.constructor.name);
      
      // Get the builder function
      const builderFn = this.client.deepbook.balanceManager.createAndShareBalanceManager();
      console.log('[DeepBookTrader] Got builder function:', typeof builderFn);
      
      // The error happens here - let's see what the SDK expects
      console.log('[DeepBookTrader] About to call builder function with tx:', tx);
      
      // Try to call the builder function
      builderFn(tx);
      
      console.log('[DeepBookTrader] Builder function completed successfully');
      console.log('[DeepBookTrader] Final transaction:', tx);
      
      return tx;
    } catch (error) {
      console.error('[DeepBookTrader] Error building transaction:', error);
      console.error('[DeepBookTrader] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  // Extract balance manager address using exact documented pattern
  extractBalanceManagerFromDetails(result: any) {
    console.log('[DeepBookTrader] Extracting using documented pattern...');
    console.log('[DeepBookTrader] Full result structure:', JSON.stringify(result, null, 2));
    
    // Check if transaction failed first (from docs)
    if (result.$kind === 'FailedTransaction') {
      console.error('[DeepBookTrader] Transaction failed:', result.FailedTransaction);
      throw new Error('Transaction failed');
    }
    
    // Use exact pattern from DeepBook docs
    const objectTypes = result.Transaction?.objectTypes ?? {};
    const changedObjects = result.Transaction?.effects?.changedObjects ?? [];
    
    console.log('[DeepBookTrader] ObjectTypes:', objectTypes);
    console.log('[DeepBookTrader] ChangedObjects:', changedObjects);
    
    const balanceManagerAddress = changedObjects.find(
      (obj: any) => {
        const isCreated = obj.idOperation === 'Created';
        const isBalanceManager = objectTypes[obj.objectId]?.includes('BalanceManager');
        
        console.log('[DeepBookTrader] Checking object:', {
          objectId: obj.objectId,
          idOperation: obj.idOperation, 
          objectType: objectTypes[obj.objectId],
          isCreated,
          isBalanceManager
        });
        
        return isCreated && isBalanceManager;
      }
    )?.objectId;

    console.log('[DeepBookTrader] Extracted balance manager address:', balanceManagerAddress);
    return balanceManagerAddress;
  }

  // Reinitialize client with balance manager
  reinitializeWithBalanceManager(balanceManagerAddress: string) {
    const balanceManagers: { [key: string]: BalanceManager } = {
      [BALANCE_MANAGER_KEY]: {
        address: balanceManagerAddress,
        tradeCap: undefined,
      },
    };

    this.client = this.#createClient(this.env, balanceManagers);
  }

  // Create deposit transaction (for DEEP since it's the base token)
  createDepositTransaction(amount: number, tokenType: 'DEEP' | 'SUI' = 'SUI') {
    const tx = new Transaction();
    const builderFn = this.client.deepbook.balanceManager.depositIntoManager(BALANCE_MANAGER_KEY, tokenType, amount);
    builderFn(tx);
    return tx;
  }

  // Create market buy order transaction (Buy DEEP with SUI)
  createMarketBuyOrderTransaction(quantitySui: number, clientOrderId: string = Date.now().toString()) {
    const tx = new Transaction();
    
    const builderFn = this.client.deepbook.placeMarketOrder({
      poolKey: 'DEEP_SUI',  // DEEP is base, SUI is quote
      balanceManagerKey: BALANCE_MANAGER_KEY,
      clientOrderId,
      quantity: quantitySui,  // Amount of SUI to spend (quote)
      isBid: true,  // Buy DEEP (base) with SUI (quote)
      payWithDeep: false,  // Pay fees with SUI
    });
    builderFn(tx);

    return tx;
  }

  // Create market sell order transaction (Sell DEEP for SUI)  
  createMarketSellOrderTransaction(quantityDeep: number, clientOrderId: string = Date.now().toString()) {
    const tx = new Transaction();
    
    const builderFn = this.client.deepbook.placeMarketOrder({
      poolKey: 'DEEP_SUI',  // DEEP is base, SUI is quote
      balanceManagerKey: BALANCE_MANAGER_KEY,
      clientOrderId,
      quantity: quantityDeep,  // Amount of DEEP to sell (base)
      isBid: false,  // Sell DEEP (base) for SUI (quote)
      payWithDeep: false,  // Pay fees with SUI
    });
    builderFn(tx);

    return tx;
  }

  // Create limit buy order transaction (Buy DEEP with SUI at specific price)
  createLimitBuyOrderTransaction(quantityDeep: number, pricePerDeep: number, clientOrderId: string = Date.now().toString()) {
    const tx = new Transaction();
    
    const builderFn = this.client.deepbook.placeLimitOrder({
      poolKey: 'DEEP_SUI',
      balanceManagerKey: BALANCE_MANAGER_KEY,
      clientOrderId,
      quantity: quantityDeep,  // Amount of DEEP to buy
      price: pricePerDeep,     // Price in SUI per DEEP
      isBid: true,  // Buy order
      timeInForce: 'GTC',  // Good Till Canceled
      selfMatchingOption: 'CANCEL_OLDEST',
      payWithDeep: false,
    });
    builderFn(tx);

    return tx;
  }

  // Create limit sell order transaction (Sell DEEP for SUI at specific price)
  createLimitSellOrderTransaction(quantityDeep: number, pricePerDeep: number, clientOrderId: string = Date.now().toString()) {
    const tx = new Transaction();
    
    const builderFn = this.client.deepbook.placeLimitOrder({
      poolKey: 'DEEP_SUI',
      balanceManagerKey: BALANCE_MANAGER_KEY,
      clientOrderId,
      quantity: quantityDeep,  // Amount of DEEP to sell  
      price: pricePerDeep,     // Price in SUI per DEEP
      isBid: false,  // Sell order
      timeInForce: 'GTC',
      selfMatchingOption: 'CANCEL_OLDEST', 
      payWithDeep: false,
    });
    builderFn(tx);

    return tx;
  }

  // Check manager balance for a token
  async checkManagerBalance(coinType: string) {
    try {
      return await this.client.deepbook.checkManagerBalance(BALANCE_MANAGER_KEY, coinType);
    } catch (error) {
      console.error(`[DeepBookTrader] Error checking ${coinType} balance:`, error);
      return '0';
    }
  }
}

export function useDeepBookTrader(walletAddress?: string, walletType?: 'standard' | 'turnkey' | null) {
  const [trader, setTrader] = useState<DeepBookTrader | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [balanceManagerAddress, setBalanceManagerAddress] = useState<string | null>(null);

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const { wallets: turnkeyWallets } = useTurnkey();

  // Initialize trader when wallet connects
  const initializeTrader = useCallback(() => {
    if (walletAddress && walletType) {
      const newTrader = new DeepBookTrader(walletAddress, 'testnet', walletType);
      setTrader(newTrader);
    }
  }, [walletAddress, walletType]);

  // Initialize trader on mount or wallet change
  useEffect(() => {
    initializeTrader();
  }, [initializeTrader]);

  const createBalanceManager = useCallback(async () => {
    if (!trader) throw new Error('Trader not initialized');

    return new Promise(async (resolve, reject) => {
      try {
        // Try the alternative approach first
        let tx;
        try {
          tx = trader.createBalanceManagerTransactionAlt();
          console.log('[useDeepBookTrader] Alternative transaction creation succeeded');
        } catch (altError) {
          console.log('[useDeepBookTrader] Alternative failed, trying original:', altError.message);
          tx = trader.createBalanceManagerTransaction();
        }
        
        console.log('[useDeepBookTrader] Raw transaction:', tx);
        console.log('[useDeepBookTrader] Transaction methods available:', Object.getOwnPropertyNames(tx));

        if (walletType === 'standard') {
          // The dapp-kit hook doesn't provide detailed object information
          // So we'll use the digest to query the transaction details
          signAndExecute(
            { 
              transaction: tx
            },
            {
              onSuccess: async (result) => {
                console.log('[useDeepBookTrader] Transaction succeeded with digest:', result.digest);
                
                try {
                  // Since dapp-kit doesn't provide object details, wait for transaction to be indexed
                  console.log('[useDeepBookTrader] Waiting for transaction to be indexed...');
                  
                  const txDetails = await trader.client.core.waitForTransaction({
                    digest: result.digest,
                    timeout: 30_000, // 30 second timeout
                    include: {
                      effects: true,
                      objectTypes: true,
                      transaction: true,
                    }
                  });
                  
                  console.log('[useDeepBookTrader] Transaction details:', txDetails);
                  
                  // Extract balance manager from the detailed transaction
                  const address = trader.extractBalanceManagerFromDetails(txDetails);
                  
                  if (address) {
                    console.log('[useDeepBookTrader] Successfully extracted address:', address);
                    setBalanceManagerAddress(address);
                    trader.reinitializeWithBalanceManager(address);
                    setIsInitialized(true);
                    resolve(result);
                  } else {
                    console.error('[useDeepBookTrader] No balance manager address found in transaction details');
                    reject(new Error('Failed to extract balance manager address from transaction details'));
                  }
                } catch (queryError) {
                  console.error('[useDeepBookTrader] Error querying transaction details:', queryError);
                  reject(queryError);
                }
              },
              onError: async (error) => {
                console.error('[useDeepBookTrader] dapp-kit hook failed:', error);
                
                // Fallback to core client approach as per docs
                try {
                  console.log('[useDeepBookTrader] Trying core client approach...');
                  
                  if (!currentAccount?.address) {
                    reject(new Error('No wallet address available'));
                    return;
                  }

                  // This uses the documented pattern from DeepBook docs
                  const result = await trader.client.core.signAndExecuteTransaction({
                    transaction: tx,
                    // Note: We don't have direct access to the private key here
                    // This would need wallet adapter integration
                    include: { effects: true, objectTypes: true },
                  });

                  if (result.$kind === 'FailedTransaction') {
                    throw new Error('Transaction failed');
                  }

                  const address = trader.extractBalanceManagerAddress(result.Transaction);
                  
                  if (address) {
                    setBalanceManagerAddress(address);
                    trader.reinitializeWithBalanceManager(address);
                    setIsInitialized(true);
                    resolve(result);
                  } else {
                    reject(new Error('Failed to extract balance manager address'));
                  }
                } catch (coreError) {
                  console.error('[useDeepBookTrader] Core client also failed:', coreError);
                  reject(coreError);
                }
              }
            }
          );
        } else {
          // TODO: Implement Turnkey signing
          reject(new Error('Turnkey signing not implemented yet'));
        }
      } catch (error) {
        console.error('[useDeepBookTrader] Error creating transaction:', error);
        reject(error);
      }
    });
  }, [trader, walletType, signAndExecute, currentAccount]);

  const depositUsdt = useCallback(async (amount: number) => {
    if (!trader || !isInitialized) throw new Error('Trader not initialized or balance manager not created');

    return new Promise((resolve, reject) => {
      try {
        const tx = trader.createDepositTransaction(amount);

        if (walletType === 'standard') {
          signAndExecute(
            { 
              transaction: tx,
              options: {
                showEffects: true,
                showObjectChanges: true,
              }
            },
            {
              onSuccess: (result) => {
                console.log('[useDeepBookTrader] USDT deposited:', result);
                resolve(result);
              },
              onError: (error) => {
                console.error('[useDeepBookTrader] Failed to deposit USDT:', error);
                reject(error);
              }
            }
          );
        } else {
          // TODO: Implement Turnkey signing
          reject(new Error('Turnkey signing not implemented yet'));
        }
      } catch (error) {
        console.error('[useDeepBookTrader] Error creating deposit transaction:', error);
        reject(error);
      }
    });
  }, [trader, isInitialized, walletType, signAndExecute]);

  const buySuiWithUsdtMarket = useCallback(async (quantityUsdt: number) => {
    if (!trader || !isInitialized) throw new Error('Trader not initialized or balance manager not created');

    return new Promise((resolve, reject) => {
      const clientOrderId = Date.now().toString(); // Simple order ID
      const tx = trader.createBuyOrderTransaction(quantityUsdt, clientOrderId);

      if (walletType === 'standard') {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('[useDeepBookTrader] Buy order executed:', result);
              resolve(result);
            },
            onError: (error) => {
              console.error('[useDeepBookTrader] Failed to execute buy order:', error);
              reject(error);
            }
          }
        );
      } else {
        // TODO: Implement Turnkey signing
        reject(new Error('Turnkey signing not implemented yet'));
      }
    });
  }, [trader, isInitialized, walletType, signAndExecute]);

  const sellSuiForUsdtMarket = useCallback(async (quantitySui: number) => {
    if (!trader || !isInitialized) throw new Error('Trader not initialized or balance manager not created');

    return new Promise((resolve, reject) => {
      const clientOrderId = Date.now().toString(); // Simple order ID
      const tx = trader.createSellOrderTransaction(quantitySui, clientOrderId);

      if (walletType === 'standard') {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('[useDeepBookTrader] Sell order executed:', result);
              resolve(result);
            },
            onError: (error) => {
              console.error('[useDeepBookTrader] Failed to execute sell order:', error);
              reject(error);
            }
          }
        );
      } else {
        // TODO: Implement Turnkey signing
        reject(new Error('Turnkey signing not implemented yet'));
      }
    });
  }, [trader, isInitialized, walletType, signAndExecute]);

  const checkManagerBalance = useCallback(async (coinType: string) => {
    if (!trader || !isInitialized) return '0';
    return trader.checkManagerBalance(coinType);
  }, [trader, isInitialized]);

  return {
    trader,
    isInitialized,
    balanceManagerAddress,
    createBalanceManager,
    depositUsdt,
    buySuiWithUsdtMarket,
    sellSuiForUsdtMarket,
    checkManagerBalance
  };
}