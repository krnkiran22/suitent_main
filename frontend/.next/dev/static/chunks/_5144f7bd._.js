(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/useDeepBookTrader.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDeepBookTrader",
    ()=>useDeepBookTrader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$grpc$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/sui/dist/grpc/client.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$deepbook$2d$v3$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@mysten/deepbook-v3/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$deepbook$2d$v3$2f$dist$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/deepbook-v3/dist/client.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/sui/dist/transactions/Transaction.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/dapp-kit/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/providers/client/Hook.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const BALANCE_MANAGER_KEY = 'MANAGER_1';
class DeepBookTrader {
    client;
    address;
    env;
    walletType;
    constructor(address, env, walletType){
        this.address = address;
        this.env = env;
        this.walletType = walletType;
        this.client = this.#createClient(env);
    }
    #createClient(env, balanceManagers) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$grpc$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SuiGrpcClient"]({
            network: env,
            baseUrl: env === 'mainnet' ? 'https://fullnode.mainnet.sui.io:443' : 'https://fullnode.testnet.sui.io:443'
        }).$extend((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$deepbook$2d$v3$2f$dist$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepbook"])({
            address: this.address,
            balanceManagers
        }));
    }
    getActiveAddress() {
        return this.address;
    }
    // Try alternative approach using the client's transaction creation
    createBalanceManagerTransactionAlt() {
        console.log('[DeepBookTrader] Trying alternative transaction approach');
        try {
            // Create transaction using the same pattern as the docs but with direct call
            const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
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
            const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
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
    extractBalanceManagerFromDetails(result) {
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
        const balanceManagerAddress = changedObjects.find((obj)=>{
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
        })?.objectId;
        console.log('[DeepBookTrader] Extracted balance manager address:', balanceManagerAddress);
        return balanceManagerAddress;
    }
    // Reinitialize client with balance manager
    reinitializeWithBalanceManager(balanceManagerAddress) {
        const balanceManagers = {
            [BALANCE_MANAGER_KEY]: {
                address: balanceManagerAddress,
                tradeCap: undefined
            }
        };
        this.client = this.#createClient(this.env, balanceManagers);
    }
    // Create deposit transaction (for DEEP since it's the base token)
    createDepositTransaction(amount, tokenType = 'SUI') {
        const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
        const builderFn = this.client.deepbook.balanceManager.depositIntoManager(BALANCE_MANAGER_KEY, tokenType, amount);
        builderFn(tx);
        return tx;
    }
    // Create market buy order transaction (Buy DEEP with SUI)
    createMarketBuyOrderTransaction(quantitySui, clientOrderId = Date.now().toString()) {
        const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
        const builderFn = this.client.deepbook.placeMarketOrder({
            poolKey: 'DEEP_SUI',
            balanceManagerKey: BALANCE_MANAGER_KEY,
            clientOrderId,
            quantity: quantitySui,
            isBid: true,
            payWithDeep: false
        });
        builderFn(tx);
        return tx;
    }
    // Create market sell order transaction (Sell DEEP for SUI)  
    createMarketSellOrderTransaction(quantityDeep, clientOrderId = Date.now().toString()) {
        const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
        const builderFn = this.client.deepbook.placeMarketOrder({
            poolKey: 'DEEP_SUI',
            balanceManagerKey: BALANCE_MANAGER_KEY,
            clientOrderId,
            quantity: quantityDeep,
            isBid: false,
            payWithDeep: false
        });
        builderFn(tx);
        return tx;
    }
    // Create limit buy order transaction (Buy DEEP with SUI at specific price)
    createLimitBuyOrderTransaction(quantityDeep, pricePerDeep, clientOrderId = Date.now().toString()) {
        const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
        const builderFn = this.client.deepbook.placeLimitOrder({
            poolKey: 'DEEP_SUI',
            balanceManagerKey: BALANCE_MANAGER_KEY,
            clientOrderId,
            quantity: quantityDeep,
            price: pricePerDeep,
            isBid: true,
            timeInForce: 'GTC',
            selfMatchingOption: 'CANCEL_OLDEST',
            payWithDeep: false
        });
        builderFn(tx);
        return tx;
    }
    // Create limit sell order transaction (Sell DEEP for SUI at specific price)
    createLimitSellOrderTransaction(quantityDeep, pricePerDeep, clientOrderId = Date.now().toString()) {
        const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
        const builderFn = this.client.deepbook.placeLimitOrder({
            poolKey: 'DEEP_SUI',
            balanceManagerKey: BALANCE_MANAGER_KEY,
            clientOrderId,
            quantity: quantityDeep,
            price: pricePerDeep,
            isBid: false,
            timeInForce: 'GTC',
            selfMatchingOption: 'CANCEL_OLDEST',
            payWithDeep: false
        });
        builderFn(tx);
        return tx;
    }
    // Check manager balance for a token
    async checkManagerBalance(coinType) {
        try {
            return await this.client.deepbook.checkManagerBalance(BALANCE_MANAGER_KEY, coinType);
        } catch (error) {
            console.error(`[DeepBookTrader] Error checking ${coinType} balance:`, error);
            return '0';
        }
    }
}
function useDeepBookTrader(walletAddress, walletType) {
    _s();
    const [trader, setTrader] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [balanceManagerAddress, setBalanceManagerAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { mutate: signAndExecute } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignAndExecuteTransaction"])();
    const currentAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"])();
    const { wallets: turnkeyWallets } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"])();
    // Initialize trader when wallet connects
    const initializeTrader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDeepBookTrader.useCallback[initializeTrader]": ()=>{
            if (walletAddress && walletType) {
                const newTrader = new DeepBookTrader(walletAddress, 'testnet', walletType);
                setTrader(newTrader);
            }
        }
    }["useDeepBookTrader.useCallback[initializeTrader]"], [
        walletAddress,
        walletType
    ]);
    // Initialize trader on mount or wallet change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDeepBookTrader.useEffect": ()=>{
            initializeTrader();
        }
    }["useDeepBookTrader.useEffect"], [
        initializeTrader
    ]);
    const createBalanceManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDeepBookTrader.useCallback[createBalanceManager]": async ()=>{
            if (!trader) throw new Error('Trader not initialized');
            return new Promise({
                "useDeepBookTrader.useCallback[createBalanceManager]": async (resolve, reject)=>{
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
                            signAndExecute({
                                transaction: tx
                            }, {
                                onSuccess: {
                                    "useDeepBookTrader.useCallback[createBalanceManager]": async (result)=>{
                                        console.log('[useDeepBookTrader] Transaction succeeded with digest:', result.digest);
                                        try {
                                            // Since dapp-kit doesn't provide object details, wait for transaction to be indexed
                                            console.log('[useDeepBookTrader] Waiting for transaction to be indexed...');
                                            const txDetails = await trader.client.core.waitForTransaction({
                                                digest: result.digest,
                                                timeout: 30_000,
                                                include: {
                                                    effects: true,
                                                    objectTypes: true,
                                                    transaction: true
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
                                    }
                                }["useDeepBookTrader.useCallback[createBalanceManager]"],
                                onError: {
                                    "useDeepBookTrader.useCallback[createBalanceManager]": async (error)=>{
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
                                                include: {
                                                    effects: true,
                                                    objectTypes: true
                                                }
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
                                }["useDeepBookTrader.useCallback[createBalanceManager]"]
                            });
                        } else {
                            // TODO: Implement Turnkey signing
                            reject(new Error('Turnkey signing not implemented yet'));
                        }
                    } catch (error) {
                        console.error('[useDeepBookTrader] Error creating transaction:', error);
                        reject(error);
                    }
                }
            }["useDeepBookTrader.useCallback[createBalanceManager]"]);
        }
    }["useDeepBookTrader.useCallback[createBalanceManager]"], [
        trader,
        walletType,
        signAndExecute,
        currentAccount
    ]);
    const depositUsdt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDeepBookTrader.useCallback[depositUsdt]": async (amount)=>{
            if (!trader || !isInitialized) throw new Error('Trader not initialized or balance manager not created');
            return new Promise({
                "useDeepBookTrader.useCallback[depositUsdt]": (resolve, reject)=>{
                    try {
                        const tx = trader.createDepositTransaction(amount);
                        if (walletType === 'standard') {
                            signAndExecute({
                                transaction: tx,
                                options: {
                                    showEffects: true,
                                    showObjectChanges: true
                                }
                            }, {
                                onSuccess: {
                                    "useDeepBookTrader.useCallback[depositUsdt]": (result)=>{
                                        console.log('[useDeepBookTrader] USDT deposited:', result);
                                        resolve(result);
                                    }
                                }["useDeepBookTrader.useCallback[depositUsdt]"],
                                onError: {
                                    "useDeepBookTrader.useCallback[depositUsdt]": (error)=>{
                                        console.error('[useDeepBookTrader] Failed to deposit USDT:', error);
                                        reject(error);
                                    }
                                }["useDeepBookTrader.useCallback[depositUsdt]"]
                            });
                        } else {
                            // TODO: Implement Turnkey signing
                            reject(new Error('Turnkey signing not implemented yet'));
                        }
                    } catch (error) {
                        console.error('[useDeepBookTrader] Error creating deposit transaction:', error);
                        reject(error);
                    }
                }
            }["useDeepBookTrader.useCallback[depositUsdt]"]);
        }
    }["useDeepBookTrader.useCallback[depositUsdt]"], [
        trader,
        isInitialized,
        walletType,
        signAndExecute
    ]);
    const buySuiWithUsdtMarket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDeepBookTrader.useCallback[buySuiWithUsdtMarket]": async (quantityUsdt)=>{
            if (!trader || !isInitialized) throw new Error('Trader not initialized or balance manager not created');
            return new Promise({
                "useDeepBookTrader.useCallback[buySuiWithUsdtMarket]": (resolve, reject)=>{
                    const clientOrderId = Date.now().toString(); // Simple order ID
                    const tx = trader.createBuyOrderTransaction(quantityUsdt, clientOrderId);
                    if (walletType === 'standard') {
                        signAndExecute({
                            transaction: tx
                        }, {
                            onSuccess: {
                                "useDeepBookTrader.useCallback[buySuiWithUsdtMarket]": (result)=>{
                                    console.log('[useDeepBookTrader] Buy order executed:', result);
                                    resolve(result);
                                }
                            }["useDeepBookTrader.useCallback[buySuiWithUsdtMarket]"],
                            onError: {
                                "useDeepBookTrader.useCallback[buySuiWithUsdtMarket]": (error)=>{
                                    console.error('[useDeepBookTrader] Failed to execute buy order:', error);
                                    reject(error);
                                }
                            }["useDeepBookTrader.useCallback[buySuiWithUsdtMarket]"]
                        });
                    } else {
                        // TODO: Implement Turnkey signing
                        reject(new Error('Turnkey signing not implemented yet'));
                    }
                }
            }["useDeepBookTrader.useCallback[buySuiWithUsdtMarket]"]);
        }
    }["useDeepBookTrader.useCallback[buySuiWithUsdtMarket]"], [
        trader,
        isInitialized,
        walletType,
        signAndExecute
    ]);
    const sellSuiForUsdtMarket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDeepBookTrader.useCallback[sellSuiForUsdtMarket]": async (quantitySui)=>{
            if (!trader || !isInitialized) throw new Error('Trader not initialized or balance manager not created');
            return new Promise({
                "useDeepBookTrader.useCallback[sellSuiForUsdtMarket]": (resolve, reject)=>{
                    const clientOrderId = Date.now().toString(); // Simple order ID
                    const tx = trader.createSellOrderTransaction(quantitySui, clientOrderId);
                    if (walletType === 'standard') {
                        signAndExecute({
                            transaction: tx
                        }, {
                            onSuccess: {
                                "useDeepBookTrader.useCallback[sellSuiForUsdtMarket]": (result)=>{
                                    console.log('[useDeepBookTrader] Sell order executed:', result);
                                    resolve(result);
                                }
                            }["useDeepBookTrader.useCallback[sellSuiForUsdtMarket]"],
                            onError: {
                                "useDeepBookTrader.useCallback[sellSuiForUsdtMarket]": (error)=>{
                                    console.error('[useDeepBookTrader] Failed to execute sell order:', error);
                                    reject(error);
                                }
                            }["useDeepBookTrader.useCallback[sellSuiForUsdtMarket]"]
                        });
                    } else {
                        // TODO: Implement Turnkey signing
                        reject(new Error('Turnkey signing not implemented yet'));
                    }
                }
            }["useDeepBookTrader.useCallback[sellSuiForUsdtMarket]"]);
        }
    }["useDeepBookTrader.useCallback[sellSuiForUsdtMarket]"], [
        trader,
        isInitialized,
        walletType,
        signAndExecute
    ]);
    const checkManagerBalance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDeepBookTrader.useCallback[checkManagerBalance]": async (coinType)=>{
            if (!trader || !isInitialized) return '0';
            return trader.checkManagerBalance(coinType);
        }
    }["useDeepBookTrader.useCallback[checkManagerBalance]"], [
        trader,
        isInitialized
    ]);
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
_s(useDeepBookTrader, "2p0JrLlH3Bnm6qUt4k8WQh6sOSw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignAndExecuteTransaction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useTraderBalances.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTraderBalances",
    ()=>useTraderBalances
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useTraderBalances(trader, isInitialized = false) {
    _s();
    const [balances, setBalances] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchBalances = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTraderBalances.useCallback[fetchBalances]": async ()=>{
            if (!trader || !isInitialized) {
                setLoading(false);
                setBalances({});
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const [suiBalance, usdtBalance, deepBalance] = await Promise.allSettled([
                    trader.checkManagerBalance('SUI'),
                    trader.checkManagerBalance('DBUSDT'),
                    trader.checkManagerBalance('DEEP')
                ]);
                const newBalances = {};
                if (suiBalance.status === 'fulfilled' && suiBalance.value) {
                    // checkManagerBalance returns {coinType, balance} object, extract balance
                    const balanceObj = suiBalance.value;
                    newBalances['SUI'] = typeof balanceObj === 'object' ? balanceObj.balance || '0' : balanceObj || '0';
                } else {
                    newBalances['SUI'] = '0';
                }
                if (usdtBalance.status === 'fulfilled' && usdtBalance.value) {
                    const balanceObj = usdtBalance.value;
                    newBalances['USDT'] = typeof balanceObj === 'object' ? balanceObj.balance || '0' : balanceObj || '0';
                } else {
                    newBalances['USDT'] = '0';
                }
                if (deepBalance.status === 'fulfilled' && deepBalance.value) {
                    const balanceObj = deepBalance.value;
                    newBalances['DEEP'] = typeof balanceObj === 'object' ? balanceObj.balance || '0' : balanceObj || '0';
                } else {
                    newBalances['DEEP'] = '0';
                }
                console.log('[useTraderBalances] Processed balances:', newBalances);
                setBalances(newBalances);
            } catch (err) {
                console.error('[useTraderBalances] Error fetching balances:', err);
                setError(err.message || 'Failed to fetch balances');
            } finally{
                setLoading(false);
            }
        }
    }["useTraderBalances.useCallback[fetchBalances]"], [
        trader,
        isInitialized
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTraderBalances.useEffect": ()=>{
            fetchBalances();
        }
    }["useTraderBalances.useEffect"], [
        fetchBalances,
        isInitialized
    ]);
    const refetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTraderBalances.useCallback[refetch]": ()=>{
            return fetchBalances();
        }
    }["useTraderBalances.useCallback[refetch]"], [
        fetchBalances
    ]);
    return {
        balances,
        loading,
        error,
        refetch
    };
}
_s(useTraderBalances, "+/mGG0r38SE0J3f+JKviIddGQjI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/trade/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TradePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/dapp-kit/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/providers/client/Hook.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDeepBookTrader$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDeepBookTrader.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTraderBalances$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useTraderBalances.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function TradePage() {
    _s();
    const [quantityUsdt, setQuantityUsdt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [depositAmount, setDepositAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const currentAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"])();
    const { wallets: turnkeyWallets } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"])();
    const turnkeyWallet = turnkeyWallets?.[0];
    const turnkeyAddress = turnkeyWallet?.addresses?.[0];
    const walletAddress = currentAccount?.address || turnkeyAddress;
    const walletType = currentAccount ? 'standard' : turnkeyAddress ? 'turnkey' : null;
    const { trader, isInitialized, createBalanceManager, depositUsdt, buySuiWithUsdtMarket, sellSuiForUsdtMarket, checkManagerBalance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDeepBookTrader$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeepBookTrader"])(walletAddress, walletType);
    const { balances, loading: balancesLoading, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTraderBalances$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTraderBalances"])(trader, isInitialized);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradePage.useEffect": ()=>{
            setError(null);
            setSuccess(null);
        }
    }["TradePage.useEffect"], [
        quantityUsdt,
        depositAmount
    ]);
    const handleCreateBalanceManager = async ()=>{
        if (!trader) return;
        setIsLoading(true);
        setError(null);
        try {
            await createBalanceManager();
            setSuccess('Balance Manager created successfully!');
            await refetch();
        } catch (err) {
            setError(err.message || 'Failed to create Balance Manager');
        } finally{
            setIsLoading(false);
        }
    };
    const handleDeposit = async ()=>{
        if (!trader || !depositAmount) return;
        setIsLoading(true);
        setError(null);
        try {
            const amount = parseFloat(depositAmount);
            await depositUsdt(amount);
            setSuccess(`Deposited ${amount} USDT successfully!`);
            setDepositAmount('');
            await refetch();
        } catch (err) {
            setError(err.message || 'Failed to deposit USDT');
        } finally{
            setIsLoading(false);
        }
    };
    const handleBuyOrder = async ()=>{
        if (!trader || !quantityUsdt) return;
        setIsLoading(true);
        setError(null);
        try {
            const quantity = parseFloat(quantityUsdt);
            const result = await buySuiWithUsdtMarket(quantity);
            setSuccess(`Buy order executed! Transaction: ${result.digest}`);
            setQuantityUsdt('');
            await refetch();
        } catch (err) {
            setError(err.message || 'Failed to execute buy order');
        } finally{
            setIsLoading(false);
        }
    };
    const handleSellOrder = async ()=>{
        if (!trader || !quantityUsdt) return;
        setIsLoading(true);
        setError(null);
        try {
            const quantity = parseFloat(quantityUsdt);
            const result = await sellSuiForUsdtMarket(quantity);
            setSuccess(`Sell order executed! Transaction: ${result.digest}`);
            setQuantityUsdt('');
            await refetch();
        } catch (err) {
            setError(err.message || 'Failed to execute sell order');
        } finally{
            setIsLoading(false);
        }
    };
    if (!walletAddress) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-slush-bg via-slush-bg to-slush-card flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slush-card border border-slush-border rounded-3xl p-8 max-w-md w-full mx-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white mb-4",
                            children: "DeepBook Trading"
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 125,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slush-text mb-6",
                            children: "Connect your wallet to start trading"
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 126,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/trade/page.tsx",
                    lineNumber: 124,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/trade/page.tsx",
                lineNumber: 123,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/trade/page.tsx",
            lineNumber: 122,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-slush-bg via-slush-bg to-slush-card py-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 max-w-4xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-white mb-8 text-center",
                    children: "DeepBook Trading"
                }, void 0, false, {
                    fileName: "[project]/app/trade/page.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slush-card border border-slush-border rounded-3xl p-6 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-white mb-4",
                            children: "Wallet Information"
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slush-text",
                                            children: "Wallet Type:"
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 143,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white capitalize",
                                            children: walletType || 'Not connected'
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 144,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/trade/page.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slush-text",
                                            children: "Address:"
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 147,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white font-mono text-sm",
                                            children: [
                                                walletAddress?.slice(0, 8),
                                                "...",
                                                walletAddress?.slice(-8)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 148,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/trade/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slush-text",
                                            children: "Balance Manager:"
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 153,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `${isInitialized ? 'text-green-400' : 'text-yellow-400'}`,
                                            children: isInitialized ? 'Ready' : 'Not Created'
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 154,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/trade/page.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/trade/page.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this),
                !isInitialized && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slush-card border border-slush-border rounded-3xl p-6 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-white mb-4",
                            children: "Setup Balance Manager"
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 164,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slush-text mb-4",
                            children: "Before trading, you need to create a Balance Manager. This is a one-time setup."
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 165,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCreateBalanceManager,
                            disabled: isLoading,
                            className: "w-full bg-sui-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-colors",
                            children: isLoading ? 'Creating...' : 'Create Balance Manager'
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 168,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/trade/page.tsx",
                    lineNumber: 163,
                    columnNumber: 11
                }, this),
                isInitialized && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slush-card border border-slush-border rounded-3xl p-6 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-white mb-4",
                            children: "Manager Balances"
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 181,
                            columnNumber: 13
                        }, this),
                        balancesLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-pulse text-slush-text",
                                children: "Loading balances..."
                            }, void 0, false, {
                                fileName: "[project]/app/trade/page.tsx",
                                lineNumber: 184,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 183,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: Object.entries(balances || {}).map(([token, balance])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center bg-slush-bg rounded-xl p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white font-semibold",
                                            children: token
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 190,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slush-text",
                                            children: balance
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 191,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, token, true, {
                                    fileName: "[project]/app/trade/page.tsx",
                                    lineNumber: 189,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 187,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/trade/page.tsx",
                    lineNumber: 180,
                    columnNumber: 11
                }, this),
                isInitialized && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slush-card border border-slush-border rounded-3xl p-6 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-white mb-4",
                            children: "Deposit USDT"
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slush-text mb-4",
                            children: "Deposit USDT into your Balance Manager to start trading"
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 203,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-slush-text text-sm mb-2",
                                            children: "Amount (USDT)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 206,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: depositAmount,
                                            onChange: (e)=>setDepositAmount(e.target.value),
                                            placeholder: "Enter amount to deposit",
                                            className: "w-full bg-slush-bg border border-slush-border rounded-xl px-4 py-3 text-white placeholder-slush-text focus:outline-none focus:border-sui-blue"
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/trade/page.tsx",
                                    lineNumber: 205,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleDeposit,
                                    disabled: isLoading || !depositAmount,
                                    className: "w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-colors",
                                    children: isLoading ? 'Depositing...' : 'Deposit USDT'
                                }, void 0, false, {
                                    fileName: "[project]/app/trade/page.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 204,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/trade/page.tsx",
                    lineNumber: 201,
                    columnNumber: 11
                }, this),
                isInitialized && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slush-card border border-slush-border rounded-3xl p-6 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-white mb-4",
                            children: "Market Orders"
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slush-text mb-4",
                            children: "Place market orders to buy or sell SUI using USDT"
                        }, void 0, false, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-slush-text text-sm mb-2",
                                            children: "Quantity (USDT for buy, SUI for sell)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 234,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: quantityUsdt,
                                            onChange: (e)=>setQuantityUsdt(e.target.value),
                                            placeholder: "Enter quantity",
                                            className: "w-full bg-slush-bg border border-slush-border rounded-xl px-4 py-3 text-white placeholder-slush-text focus:outline-none focus:border-sui-blue"
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 235,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/trade/page.tsx",
                                    lineNumber: 233,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleBuyOrder,
                                            disabled: isLoading || !quantityUsdt,
                                            className: "bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-colors",
                                            children: isLoading ? 'Processing...' : 'Buy SUI'
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 245,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSellOrder,
                                            disabled: isLoading || !quantityUsdt,
                                            className: "bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-colors",
                                            children: isLoading ? 'Processing...' : 'Sell SUI'
                                        }, void 0, false, {
                                            fileName: "[project]/app/trade/page.tsx",
                                            lineNumber: 253,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/trade/page.tsx",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/trade/page.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/trade/page.tsx",
                    lineNumber: 228,
                    columnNumber: 11
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-400",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/trade/page.tsx",
                        lineNumber: 268,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/trade/page.tsx",
                    lineNumber: 267,
                    columnNumber: 11
                }, this),
                success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-green-400",
                        children: success
                    }, void 0, false, {
                        fileName: "[project]/app/trade/page.tsx",
                        lineNumber: 274,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/trade/page.tsx",
                    lineNumber: 273,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/trade/page.tsx",
            lineNumber: 135,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/trade/page.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
_s(TradePage, "dLWN8EIAnXr+N5QrdVZYBNzlojY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDeepBookTrader$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeepBookTrader"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTraderBalances$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTraderBalances"]
    ];
});
_c = TradePage;
var _c;
__turbopack_context__.k.register(_c, "TradePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_5144f7bd._.js.map