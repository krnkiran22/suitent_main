(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils/format.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Format a Sui address for display
 */ __turbopack_context__.s([
    "formatAddress",
    ()=>formatAddress,
    "formatBalance",
    ()=>formatBalance,
    "formatDate",
    ()=>formatDate,
    "formatNumber",
    ()=>formatNumber,
    "formatPercent",
    ()=>formatPercent,
    "formatRelativeTime",
    ()=>formatRelativeTime,
    "formatUSD",
    ()=>formatUSD
]);
function formatAddress(address, chars = 4) {
    if (!address) return "";
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
function formatNumber(num, decimals = 2) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}
function formatBalance(balance, decimals = 9) {
    const balanceBigInt = typeof balance === "string" ? BigInt(balance) : balance;
    const divisor = BigInt(10 ** decimals);
    const whole = balanceBigInt / divisor;
    const fraction = balanceBigInt % divisor;
    const fractionStr = fraction.toString().padStart(decimals, "0");
    const trimmedFraction = fractionStr.replace(/0+$/, "");
    if (trimmedFraction === "") {
        return whole.toString();
    }
    return `${whole}.${trimmedFraction}`;
}
function formatUSD(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}
function formatPercent(value, decimals = 2) {
    return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}
function formatDate(timestamp) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(timestamp));
}
function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useClickOutside.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useClickOutside",
    ()=>useClickOutside
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useClickOutside(ref, handler) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useClickOutside.useEffect": ()=>{
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    handler();
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "useClickOutside.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["useClickOutside.useEffect"];
        }
    }["useClickOutside.useEffect"], [
        ref,
        handler
    ]);
}
_s(useClickOutside, "OD7bBpZva5O2jO+Puf00hKivP7c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useWalletBalances.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWalletBalances",
    ()=>useWalletBalances
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$jsonRpc$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/sui/dist/jsonRpc/client.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$jsonRpc$2f$network$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/sui/dist/jsonRpc/network.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useWalletBalances(address) {
    _s();
    const [balances, setBalances] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWalletBalances.useEffect": ()=>{
            if (!address) {
                setBalances([]);
                return;
            }
            async function fetchBalances() {
                setIsLoading(true);
                setError(null);
                try {
                    const suiClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$jsonRpc$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SuiJsonRpcClient"]({
                        network: "testnet",
                        url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$jsonRpc$2f$network$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getJsonRpcFullnodeUrl"])("testnet")
                    });
                    console.log("Fetching balances for:", address);
                    // 1. Get all coin balances
                    const allBalances = await suiClient.getAllBalances({
                        owner: address
                    });
                    console.log("Got balances:", allBalances);
                    if (!allBalances || allBalances.length === 0) {
                        setBalances([]);
                        setIsLoading(false);
                        return;
                    }
                    // 2. Fetch metadata for each coin type
                    const balancesWithMetadata = await Promise.all(allBalances.map({
                        "useWalletBalances.useEffect.fetchBalances": async (bal)=>{
                            try {
                                const metadata = await suiClient.getCoinMetadata({
                                    coinType: bal.coinType
                                });
                                const decimals = metadata?.decimals ?? 9;
                                const formattedBalance = formatBalance(bal.totalBalance, decimals);
                                return {
                                    coinType: bal.coinType,
                                    symbol: metadata?.symbol ?? extractSymbol(bal.coinType),
                                    name: metadata?.name ?? "Unknown Token",
                                    balance: formattedBalance,
                                    balanceRaw: bal.totalBalance,
                                    decimals,
                                    iconUrl: metadata?.iconUrl ?? null
                                };
                            } catch (err) {
                                console.log("Error fetching metadata for", bal.coinType, err);
                                // If metadata fetch fails, use defaults
                                return {
                                    coinType: bal.coinType,
                                    symbol: extractSymbol(bal.coinType),
                                    name: "Unknown Token",
                                    balance: formatBalance(bal.totalBalance, 9),
                                    balanceRaw: bal.totalBalance,
                                    decimals: 9,
                                    iconUrl: null
                                };
                            }
                        }
                    }["useWalletBalances.useEffect.fetchBalances"]));
                    // 3. Sort: SUI first, then by balance
                    balancesWithMetadata.sort({
                        "useWalletBalances.useEffect.fetchBalances": (a, b)=>{
                            if (a.symbol === "SUI") return -1;
                            if (b.symbol === "SUI") return 1;
                            return parseFloat(b.balance) - parseFloat(a.balance);
                        }
                    }["useWalletBalances.useEffect.fetchBalances"]);
                    setBalances(balancesWithMetadata);
                } catch (err) {
                    console.error("Error fetching balances:", err);
                    setError("Failed to fetch balances");
                } finally{
                    setIsLoading(false);
                }
            }
            fetchBalances();
        }
    }["useWalletBalances.useEffect"], [
        address
    ]);
    return {
        balances,
        isLoading,
        error
    };
}
_s(useWalletBalances, "dhniR0ZXQkM7z46Kl4NYolEP+30=");
// Helper: Format raw balance to human readable
function formatBalance(rawBalance, decimals) {
    const balance = BigInt(rawBalance);
    const divisor = BigInt(10 ** decimals);
    const integerPart = balance / divisor;
    const fractionalPart = balance % divisor;
    if (fractionalPart === 0n) {
        return integerPart.toString();
    }
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.slice(0, 4).replace(/0+$/, '');
    if (!trimmedFractional) {
        return integerPart.toString();
    }
    return `${integerPart}.${trimmedFractional}`;
}
// Helper: Extract symbol from coin type string
function extractSymbol(coinType) {
    // coinType format: "0x...::module::SYMBOL"
    const parts = coinType.split("::");
    return parts[parts.length - 1] || "???";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wallet/TokenBalanceItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TokenBalanceItem",
    ()=>TokenBalanceItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function TokenBalanceItem({ symbol, name, balance, iconUrl }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 rounded-full bg-sui-blue/20 flex items-center justify-center overflow-hidden",
                        children: iconUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: iconUrl,
                            alt: symbol,
                            className: "w-full h-full object-cover"
                        }, void 0, false, {
                            fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
                            lineNumber: 16,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-bold text-sui-blue",
                            children: symbol[0]
                        }, void 0, false, {
                            fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
                            lineNumber: 18,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-semibold text-white",
                                children: symbol
                            }, void 0, false, {
                                fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: name
                            }, void 0, false, {
                                fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-right",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-bold text-white",
                    children: balance
                }, void 0, false, {
                    fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wallet/TokenBalanceItem.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = TokenBalanceItem;
var _c;
__turbopack_context__.k.register(_c, "TokenBalanceItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wallet/TokenBalanceList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TokenBalanceList",
    ()=>TokenBalanceList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useWalletBalances$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useWalletBalances.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$TokenBalanceItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wallet/TokenBalanceItem.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function TokenBalanceList({ address }) {
    _s();
    const { balances, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useWalletBalances$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletBalances"])(address);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                1,
                2,
                3
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-14 bg-white/5 rounded-xl animate-pulse"
                }, i, false, {
                    fileName: "[project]/components/wallet/TokenBalanceList.tsx",
                    lineNumber: 15,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/wallet/TokenBalanceList.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-8 text-gray-400 text-sm",
            children: "Failed to load balances"
        }, void 0, false, {
            fileName: "[project]/components/wallet/TokenBalanceList.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    if (balances.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-8 text-gray-400 text-sm",
            children: "No tokens found"
        }, void 0, false, {
            fileName: "[project]/components/wallet/TokenBalanceList.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1",
        children: balances.map((token)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$TokenBalanceItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenBalanceItem"], {
                coinType: token.coinType,
                symbol: token.symbol,
                name: token.name,
                balance: token.balance,
                iconUrl: token.iconUrl
            }, token.coinType, false, {
                fileName: "[project]/components/wallet/TokenBalanceList.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/wallet/TokenBalanceList.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(TokenBalanceList, "UpstaaQWSPaFcj58wxC1Ecp+rv8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useWalletBalances$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletBalances"]
    ];
});
_c = TokenBalanceList;
var _c;
__turbopack_context__.k.register(_c, "TokenBalanceList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wallet/WalletDropdown.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WalletDropdown",
    ()=>WalletDropdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useClickOutside$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useClickOutside.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$TokenBalanceList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wallet/TokenBalanceList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function WalletDropdown({ address, onClose, onDisconnect }) {
    _s();
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Close when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useClickOutside$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClickOutside"])(dropdownRef, onClose);
    const copyAddress = ()=>{
        navigator.clipboard.writeText(address);
    // TODO: Show toast notification
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: dropdownRef,
        className: "absolute top-[calc(100%+8px)] right-0 w-[340px] bg-[#0a0a0f]/95 backdrop-blur-xl border border-sui-blue/20 rounded-2xl shadow-[0_0_30px_rgba(77,162,255,0.15)] overflow-hidden animate-dropdown z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-white/5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: copyAddress,
                    className: "w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-mono text-white",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAddress"])(address, 6)
                        }, void 0, false, {
                            fileName: "[project]/components/wallet/WalletDropdown.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-4 h-4 text-gray-400 group-hover:text-sui-blue transition-colors",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "9",
                                    y: "9",
                                    width: "13",
                                    height: "13",
                                    rx: "2",
                                    ry: "2"
                                }, void 0, false, {
                                    fileName: "[project]/components/wallet/WalletDropdown.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                                }, void 0, false, {
                                    fileName: "[project]/components/wallet/WalletDropdown.tsx",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/wallet/WalletDropdown.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/wallet/WalletDropdown.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wallet/WalletDropdown.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pt-3 pb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-2 h-2 bg-green-500 rounded-full animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/components/wallet/WalletDropdown.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs font-semibold text-green-400",
                            children: "Sui Testnet"
                        }, void 0, false, {
                            fileName: "[project]/components/wallet/WalletDropdown.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/wallet/WalletDropdown.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wallet/WalletDropdown.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2",
                        children: "Your Tokens"
                    }, void 0, false, {
                        fileName: "[project]/components/wallet/WalletDropdown.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-[300px] overflow-y-auto custom-scrollbar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$TokenBalanceList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenBalanceList"], {
                            address: address
                        }, void 0, false, {
                            fileName: "[project]/components/wallet/WalletDropdown.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/wallet/WalletDropdown.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wallet/WalletDropdown.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-white/5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onDisconnect,
                    className: "w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-semibold text-sm transition-all flex items-center justify-center gap-2 group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-4 h-4 group-hover:rotate-12 transition-transform",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            }, void 0, false, {
                                fileName: "[project]/components/wallet/WalletDropdown.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/wallet/WalletDropdown.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        "Disconnect Wallet"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/wallet/WalletDropdown.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wallet/WalletDropdown.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wallet/WalletDropdown.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(WalletDropdown, "RRRW0CkUVY8kGQySMcN3JH0R+Oo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useClickOutside$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClickOutside"]
    ];
});
_c = WalletDropdown;
var _c;
__turbopack_context__.k.register(_c, "WalletDropdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wallet/WalletSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WalletSelector",
    ()=>WalletSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function WalletSelector({ isOpen, onClose, onSelectTurnkey, onSelectSui }) {
    _s();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WalletSelector.useEffect": ()=>{
            setMounted(true);
            // Optional: Lock body scroll when modal is open
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }
            return ({
                "WalletSelector.useEffect": ()=>{
                    document.body.style.overflow = 'unset';
                }
            })["WalletSelector.useEffect"];
        }
    }["WalletSelector.useEffect"], [
        isOpen
    ]);
    // Don't render until client-side hydration is complete
    if (!mounted || !isOpen) return null;
    // THE FIX: createPortal teleports this div to document.body
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] grid place-items-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200",
                onClick: onClose,
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/components/wallet/WalletSelector.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-[400px] bg-[#0D111C] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center p-6 pb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold text-white tracking-wide",
                                children: "Connect Wallet"
                            }, void 0, false, {
                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "p-2 -mr-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/components/wallet/WalletSelector.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 pt-4 flex flex-col gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onSelectTurnkey,
                                className: "group relative flex items-center justify-between p-4 rounded-[24px] bg-[#131825] border border-white/5 hover:border-sui-blue/50 transition-all hover:bg-[#1A2133] text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "22",
                                                    height: "22",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    className: "text-black",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: "3",
                                                            y: "11",
                                                            width: "18",
                                                            height: "11",
                                                            rx: "2",
                                                            ry: "2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                            lineNumber: 66,
                                                            columnNumber: 138
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M7 11V7a5 5 0 0 1 10 0v4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                            lineNumber: 66,
                                                            columnNumber: 201
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                    lineNumber: 66,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                lineNumber: 64,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-white font-bold text-[17px]",
                                                        children: "Turnkey Wallet"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                        lineNumber: 69,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400 text-sm",
                                                        children: "Email & Passkey login"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                        lineNumber: 70,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                lineNumber: 68,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                                        lineNumber: 63,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-sui-blue group-hover:text-white transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "18",
                                            height: "18",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 18l6-6-6-6"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                lineNumber: 74,
                                                columnNumber: 113
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/wallet/WalletSelector.tsx",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                                        lineNumber: 73,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onSelectSui,
                                className: "group relative flex items-center justify-between p-4 rounded-[24px] bg-[#131825] border border-white/5 hover:border-sui-blue/50 transition-all hover:bg-[#1A2133] text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-11 h-11 rounded-full bg-[#4DA2FF]/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-5 h-6 bg-sui-blue rounded-b-full drop-shadow-[0_0_10px_rgba(77,162,255,0.8)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                lineNumber: 84,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-white font-bold text-[17px]",
                                                        children: "Sui Wallets"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                        lineNumber: 89,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-400 text-sm",
                                                        children: "Slush, Welldone, etc."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                        lineNumber: 90,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                lineNumber: 88,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                                        lineNumber: 83,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-sui-blue group-hover:text-white transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "18",
                                            height: "18",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 18l6-6-6-6"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                                lineNumber: 94,
                                                columnNumber: 113
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/wallet/WalletSelector.tsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wallet/WalletSelector.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 pt-2 text-center bg-[#131825]/50 border-t border-white/5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500 leading-relaxed",
                            children: [
                                "By connecting, you agree to our ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sui-blue hover:underline cursor-pointer",
                                    children: "Terms"
                                }, void 0, false, {
                                    fileName: "[project]/components/wallet/WalletSelector.tsx",
                                    lineNumber: 103,
                                    columnNumber: 49
                                }, this),
                                " and ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sui-blue hover:underline cursor-pointer",
                                    children: "Privacy Policy"
                                }, void 0, false, {
                                    fileName: "[project]/components/wallet/WalletSelector.tsx",
                                    lineNumber: 103,
                                    columnNumber: 129
                                }, this),
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/wallet/WalletSelector.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/wallet/WalletSelector.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wallet/WalletSelector.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wallet/WalletSelector.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this), document.body // This is the magic part that moves it out of the navbar
    );
}
_s(WalletSelector, "LrrVfNW3d1raFE0BNzCTILYmIfo=");
_c = WalletSelector;
var _c;
__turbopack_context__.k.register(_c, "WalletSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wallet/ConnectButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConnectButton",
    ()=>ConnectButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/dapp-kit/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/providers/client/Hook.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$WalletDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wallet/WalletDropdown.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$WalletSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wallet/WalletSelector.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function ConnectButton() {
    _s();
    const currentAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"])();
    const { mutate: disconnect } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDisconnectWallet"])();
    const { logout: turnkeyLogout, handleLogin, wallets: turnkeyWallets } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"])();
    const [isDropdownOpen, setIsDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSuiModalOpen, setIsSuiModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const turnkeyAddress = turnkeyWallets?.[0]?.accounts?.[0]?.address;
    const isTurnkeyConnected = !!turnkeyAddress;
    // Handler: Turnkey Selected
    const handleTurnkeySelect = async ()=>{
        setIsModalOpen(false);
        try {
            await handleLogin();
        } catch (e) {
            console.error("Turnkey login failed", e);
        }
    };
    // Handler: Sui Wallet Selected
    const handleSuiSelect = ()=>{
        setIsModalOpen(false);
        setIsSuiModalOpen(true);
    };
    // Handle Turnkey disconnect
    const handleTurnkeyDisconnect = async ()=>{
        try {
            await turnkeyLogout();
            // Clear all Turnkey-related localStorage
            Object.keys(localStorage).forEach((key)=>{
                if (key.includes('turnkey') || key.includes('Turnkey')) {
                    localStorage.removeItem(key);
                }
            });
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("[ConnectButton] Turnkey disconnect failed:", error);
        }
    };
    // Show Turnkey wallet if connected
    if (isTurnkeyConnected) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setIsDropdownOpen(!isDropdownOpen),
                    className: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-6 py-2.5 rounded-full font-medium text-sm transition-all border border-purple-500/30",
                    children: [
                        "🔐 ",
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAddress"])(turnkeyAddress, 4)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/wallet/ConnectButton.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this),
                isDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-[calc(100%+8px)] right-0 w-[300px] bg-[#0a0a0f]/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden z-50 p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-purple-400 mb-1",
                                    children: "🔐 Turnkey Wallet"
                                }, void 0, false, {
                                    fileName: "[project]/components/wallet/ConnectButton.tsx",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-mono text-white",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAddress"])(turnkeyAddress, 6)
                                }, void 0, false, {
                                    fileName: "[project]/components/wallet/ConnectButton.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/wallet/ConnectButton.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleTurnkeyDisconnect,
                            className: "w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-semibold text-sm transition-all",
                            children: "Disconnect"
                        }, void 0, false, {
                            fileName: "[project]/components/wallet/ConnectButton.tsx",
                            lineNumber: 76,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/wallet/ConnectButton.tsx",
                    lineNumber: 71,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/wallet/ConnectButton.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this);
    }
    // Show browser wallet if connected
    if (currentAccount) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setIsDropdownOpen(!isDropdownOpen),
                    className: "bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all border border-white/10",
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAddress"])(currentAccount.address, 4)
                }, void 0, false, {
                    fileName: "[project]/components/wallet/ConnectButton.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                isDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$WalletDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletDropdown"], {
                    address: currentAccount.address,
                    onClose: ()=>setIsDropdownOpen(false),
                    onDisconnect: ()=>{
                        disconnect();
                        setIsDropdownOpen(false);
                    }
                }, void 0, false, {
                    fileName: "[project]/components/wallet/ConnectButton.tsx",
                    lineNumber: 100,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/wallet/ConnectButton.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsModalOpen(true),
                className: "bg-sui-blue hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-[0_0_15px_rgba(77,162,255,0.4)] hover:shadow-[0_0_25px_rgba(77,162,255,0.6)]",
                children: "Connect Wallet"
            }, void 0, false, {
                fileName: "[project]/components/wallet/ConnectButton.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConnectModal"], {
                trigger: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "hidden"
                }, void 0, false, {
                    fileName: "[project]/components/wallet/ConnectButton.tsx",
                    lineNumber: 124,
                    columnNumber: 18
                }, void 0),
                open: isSuiModalOpen,
                onOpenChange: setIsSuiModalOpen
            }, void 0, false, {
                fileName: "[project]/components/wallet/ConnectButton.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$WalletSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletSelector"], {
                isOpen: isModalOpen,
                onClose: ()=>setIsModalOpen(false),
                onSelectTurnkey: handleTurnkeySelect,
                onSelectSui: handleSuiSelect
            }, void 0, false, {
                fileName: "[project]/components/wallet/ConnectButton.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(ConnectButton, "/BNUFW2SBi+ZsIdUJqt1ScM6ZJ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDisconnectWallet"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"]
    ];
});
_c = ConnectButton;
var _c;
__turbopack_context__.k.register(_c, "ConnectButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$ConnectButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wallet/ConnectButton.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
function Header() {
    const navLinks = [
        "Swap",
        "Chat",
        "Portfolio",
        "Orders",
        "History"
    ];
    return(// 1. Fixed positioning z-50 ensures it's always on top of the Hero image
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "pointer-events-auto flex items-center justify-between min-w-[320px] md:min-w-[650px] py-3 px-5 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "hover:scale-105 transition-transform",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/suitentlogo.png",
                            alt: "SuiTent Logo",
                            width: 40,
                            height: 40,
                            className: "rounded-full object-cover shadow-lg shadow-sui-blue/20"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/Header.tsx",
                            lineNumber: 19,
                            columnNumber: 16
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Header.tsx",
                        lineNumber: 18,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/Header.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex items-center justify-center gap-6 flex-1 relative z-20",
                    children: navLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${link.toLowerCase()}`,
                            className: "text-base font-extrabold text-white hover:text-sui-blue transition-colors tracking-wide relative z-20",
                            style: {
                                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                            },
                            children: link
                        }, link, false, {
                            fileName: "[project]/components/layout/Header.tsx",
                            lineNumber: 32,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/layout/Header.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "[&_button]:bg-white [&_button]:text-black [&_button]:px-6 [&_button]:py-2.5 [&_button]:rounded-full [&_button]:font-bold [&_button]:text-sm [&_button]:hover:bg-gray-200 [&_button]:transition-all [&_button]:shadow-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$ConnectButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConnectButton"], {}, void 0, false, {
                            fileName: "[project]/components/layout/Header.tsx",
                            lineNumber: 47,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Header.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/Header.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/Header.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/Header.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this));
}
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useUniversalSwap.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUniversalSwap",
    ()=>useUniversalSwap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/dapp-kit/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/providers/client/Hook.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/sui/dist/transactions/Transaction.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$deepbook$2d$v3$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@mysten/deepbook-v3/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$deepbook$2d$v3$2f$dist$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/deepbook-v3/dist/client.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$keypairs$2f$ed25519$2f$publickey$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/sui/dist/keypairs/ed25519/publickey.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$cryptography$2f$intent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/sui/dist/cryptography/intent.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$blake2b$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@noble/hashes/esm/blake2b.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@noble/hashes/esm/utils.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function useUniversalSwap() {
    _s();
    // Browser wallets (Suiet, Welldone, Sui Wallet)
    const currentAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"])();
    const { mutate: signAndExecute } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignAndExecuteTransaction"])();
    const suiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSuiClient"])();
    // Turnkey wallet
    const turnkeyHook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"])();
    const { wallets: turnkeyWallets } = turnkeyHook;
    const turnkeyWallet = turnkeyWallets?.[0];
    const turnkeyAddress = turnkeyWallet?.accounts?.[0]?.address;
    const turnkeyPublicKey = turnkeyWallet?.accounts?.[0]?.publicKey;
    const httpClient = turnkeyHook.httpClient;
    // Determine which wallet is connected
    const walletAddress = currentAccount?.address || turnkeyAddress;
    const walletType = currentAccount ? 'standard' : turnkeyAddress ? 'turnkey' : null;
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [txDigest, setTxDigest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    console.log(`[useUniversalSwap] Wallet Type: ${walletType}, Address: ${walletAddress}`);
    // Execute swap with automatic wallet detection
    const executeSwap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUniversalSwap.useCallback[executeSwap]": async (tokenIn, tokenOut, amountIn, slippage = 0.01)=>{
            console.log(`[useUniversalSwap] executeSwap: ${amountIn} ${tokenIn} -> ${tokenOut} (${walletType})`);
            if (!walletAddress) {
                const error = "Wallet not connected";
                console.error("[useUniversalSwap]", error);
                setError(error);
                return null;
            }
            setLoading(true);
            setError(null);
            setTxDigest(null);
            try {
                // For simplicity: Use 0 as minOut to avoid slippage issues during testing
                // TODO: Implement proper quote mechanism using SDK dry-run methods
                const minAmountOut = "0";
                console.log("[useUniversalSwap] Using minAmountOut=0 (no slippage protection for testing)");
                // Build transaction on frontend
                console.log("[useUniversalSwap] Building transaction on frontend...");
                const tx = await buildSwapTransactionFrontend(tokenIn, tokenOut, amountIn, minAmountOut, walletAddress, suiClient);
                // Execute transaction based on wallet type
                console.log(`[useUniversalSwap] Executing with ${walletType} wallet...`);
                let resultDigest;
                if (walletType === 'standard') {
                    // Browser wallet execution
                    resultDigest = await new Promise({
                        "useUniversalSwap.useCallback[executeSwap]": (resolve, reject)=>{
                            signAndExecute({
                                transaction: tx
                            }, {
                                onSuccess: {
                                    "useUniversalSwap.useCallback[executeSwap]": (result)=>{
                                        console.log("[useUniversalSwap] ✅ Swap successful! Digest:", result.digest);
                                        resolve(result.digest);
                                    }
                                }["useUniversalSwap.useCallback[executeSwap]"],
                                onError: {
                                    "useUniversalSwap.useCallback[executeSwap]": (err)=>{
                                        console.error("[useUniversalSwap] ❌ Swap failed:", err);
                                        reject(err);
                                    }
                                }["useUniversalSwap.useCallback[executeSwap]"]
                            });
                        }
                    }["useUniversalSwap.useCallback[executeSwap]"]);
                } else if (walletType === 'turnkey') {
                    // Turnkey wallet execution (following official docs)
                    console.log("[useUniversalSwap] Signing with Turnkey...");
                    if (!httpClient || !turnkeyPublicKey) {
                        throw new Error("Turnkey client or public key not available");
                    }
                    // Build transaction bytes
                    const { SuiGrpcClient } = await __turbopack_context__.A("[project]/node_modules/@mysten/sui/dist/grpc/index.mjs [app-client] (ecmascript, async loader)");
                    const grpcClient = new SuiGrpcClient({
                        network: 'testnet',
                        baseUrl: 'https://fullnode.testnet.sui.io:443'
                    });
                    // Build transaction to get raw bytes
                    const builtTx = await tx.build({
                        client: grpcClient
                    });
                    // Create digest for signing (following Turnkey docs)
                    const intentMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$cryptography$2f$intent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["messageWithIntent"])('TransactionData', builtTx);
                    const digest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$blake2b$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blake2b"])(intentMessage, {
                        dkLen: 32
                    });
                    const hexDigest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$noble$2f$hashes$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToHex"])(digest);
                    console.log("[useUniversalSwap] Transaction digest:", hexDigest);
                    // Sign with Turnkey using signRawPayload (official pattern)
                    const signResponse = await httpClient.signRawPayload({
                        signWith: turnkeyAddress,
                        payload: hexDigest,
                        encoding: 'PAYLOAD_ENCODING_HEXADECIMAL',
                        hashFunction: 'HASH_FUNCTION_NOT_APPLICABLE'
                    });
                    console.log("[useUniversalSwap] Signature received from Turnkey");
                    // Serialize signature for Sui (official pattern)
                    const publicKey = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$keypairs$2f$ed25519$2f$publickey$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Ed25519PublicKey"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(turnkeyPublicKey, 'hex'));
                    const signatureBytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(signResponse.r + signResponse.s, 'hex');
                    const publicKeyBytes = publicKey.toRawBytes();
                    const serializedSignature = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
                            0x00
                        ]),
                        signatureBytes,
                        publicKeyBytes
                    ]).toString('base64');
                    // Execute transaction
                    const result = await grpcClient.executeTransaction({
                        transaction: builtTx,
                        signature: serializedSignature
                    });
                    resultDigest = result.digest;
                    console.log("[useUniversalSwap] ✅ Turnkey swap successful! Digest:", resultDigest);
                } else {
                    throw new Error("No wallet connected");
                }
                console.log(`[useUniversalSwap] ✅ SUCCESS! Digest: ${resultDigest}`);
                // Wait a bit for the transaction to be processed
                await new Promise({
                    "useUniversalSwap.useCallback[executeSwap]": (resolve)=>setTimeout(resolve, 2000)
                }["useUniversalSwap.useCallback[executeSwap]"]);
                // Check DEEP balance after swap
                try {
                    const deepCoins = await suiClient.getCoins({
                        owner: walletAddress,
                        coinType: "0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP"
                    });
                    const deepBalance = deepCoins.data.reduce({
                        "useUniversalSwap.useCallback[executeSwap].deepBalance": (sum, coin)=>sum + BigInt(coin.balance)
                    }["useUniversalSwap.useCallback[executeSwap].deepBalance"], 0n);
                    console.log(`[useUniversalSwap] DEEP balance after swap: ${deepBalance} (${Number(deepBalance) / 1e6} DEEP)`);
                    console.log(`[useUniversalSwap] DEEP coins found:`, deepCoins.data.length);
                } catch (e) {
                    console.error("[useUniversalSwap] Error checking DEEP balance:", e);
                }
                setTxDigest(resultDigest);
                return resultDigest;
            } catch (err) {
                console.error("[useUniversalSwap] Error:", err);
                setError(err.message || "Swap failed");
                return null;
            } finally{
                setLoading(false);
            }
        }
    }["useUniversalSwap.useCallback[executeSwap]"], [
        walletAddress,
        walletType,
        currentAccount,
        signAndExecute,
        turnkeyWallet,
        turnkeyAddress,
        turnkeyPublicKey,
        httpClient,
        turnkeyHook,
        suiClient
    ]);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUniversalSwap.useCallback[reset]": ()=>{
            setError(null);
            setTxDigest(null);
        }
    }["useUniversalSwap.useCallback[reset]"], []);
    return {
        loading,
        error,
        txDigest,
        executeSwap,
        reset,
        walletType
    };
}
_s(useUniversalSwap, "xG69UT+oTtw/SfofIzmxvcFkm5Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignAndExecuteTransaction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSuiClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"]
    ];
});
// Build swap transaction using DeepBook SDK
async function buildSwapTransactionFrontend(tokenIn, tokenOut, amountIn, minAmountOut, walletAddress, suiClient) {
    console.log(`[buildSwapTransactionFrontend] Building ${tokenIn} -> ${tokenOut} swap with DeepBook SDK`);
    const { SuiGrpcClient } = await __turbopack_context__.A("[project]/node_modules/@mysten/sui/dist/grpc/index.mjs [app-client] (ecmascript, async loader)");
    const deepbookClient = new SuiGrpcClient({
        network: 'testnet',
        baseUrl: 'https://fullnode.testnet.sui.io:443'
    }).$extend((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$deepbook$2d$v3$2f$dist$2f$client$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepbook"])({
        address: walletAddress
    }));
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$sui$2f$dist$2f$transactions$2f$Transaction$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
    tx.setSender(walletAddress);
    // SDK expects decimal amounts (e.g., 1.0 for 1 SUI), not base units
    // The SDK internally handles conversion to base units
    const amount = parseFloat(amountIn);
    const minOut = parseFloat(minAmountOut);
    console.log(`[buildSwapTransactionFrontend] Amount: ${amount} ${tokenIn}`);
    console.log(`[buildSwapTransactionFrontend] MinOut: ${minOut} ${tokenOut}`);
    // Determine swap direction
    if (tokenIn === "SUI" && tokenOut === "DEEP") {
        // SUI -> DEEP: In DEEP_SUI pool, DEEP is base, SUI is quote
        // So we swap quote -> base
        console.log("[SDK] swapExactQuoteForBase: SUI (quote) -> DEEP (base)");
        // Manually split SUI from tx.gas before passing to SDK
        const amountInMist = BigInt(Math.floor(amount * 1e9));
        const [suiCoin] = tx.splitCoins(tx.gas, [
            amountInMist
        ]);
        const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactQuoteForBase({
            poolKey: 'DEEP_SUI',
            amount,
            deepAmount: 0,
            minOut,
            quoteCoin: suiCoin
        })(tx);
        tx.transferObjects([
            baseOut,
            quoteOut,
            deepOut
        ], walletAddress);
    } else if (tokenIn === "DEEP" && tokenOut === "SUI") {
        // DEEP -> SUI: swap base -> quote
        console.log("[SDK] swapExactBaseForQuote: DEEP (base) -> SUI (quote)");
        const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactBaseForQuote({
            poolKey: 'DEEP_SUI',
            amount,
            deepAmount: 0,
            minOut
        })(tx);
        tx.transferObjects([
            baseOut,
            quoteOut,
            deepOut
        ], walletAddress);
    } else if (tokenIn === "SUI" && tokenOut === "DBUSDC") {
        // SUI -> DBUSDC: In SUI_DBUSDC pool, SUI is base, DBUSDC is quote
        console.log("[SDK] swapExactBaseForQuote: SUI (base) -> DBUSDC (quote)");
        // Manually split SUI from tx.gas before passing to SDK
        const amountInMist = BigInt(Math.floor(amount * 1e9));
        const [suiCoin] = tx.splitCoins(tx.gas, [
            amountInMist
        ]);
        const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactBaseForQuote({
            poolKey: 'SUI_DBUSDC',
            amount,
            deepAmount: 1,
            minOut,
            baseCoin: suiCoin
        })(tx);
        tx.transferObjects([
            baseOut,
            quoteOut,
            deepOut
        ], walletAddress);
    } else if (tokenIn === "DBUSDC" && tokenOut === "SUI") {
        // DBUSDC -> SUI: swap quote -> base
        console.log("[SDK] swapExactQuoteForBase: DBUSDC (quote) -> SUI (base)");
        const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactQuoteForBase({
            poolKey: 'SUI_DBUSDC',
            amount,
            deepAmount: 1,
            minOut
        })(tx);
        tx.transferObjects([
            baseOut,
            quoteOut,
            deepOut
        ], walletAddress);
    } else {
        throw new Error(`Unsupported swap: ${tokenIn} -> ${tokenOut}`);
    }
    console.log("[buildSwapTransactionFrontend] Transaction built successfully");
    return tx;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSwapTransaction",
    ()=>buildSwapTransaction,
    "getBalances",
    ()=>getBalances,
    "getSwapQuote",
    ()=>getSwapQuote,
    "getTokens",
    ()=>getTokens,
    "getTransactionStatus",
    ()=>getTransactionStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// lib/api.ts - API client for backend
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001") || "http://localhost:3001";
console.log("[API Client] Initialized with URL:", API_URL);
// Helper for API calls with logging
async function apiCall(endpoint, options) {
    const url = `${API_URL}${endpoint}`;
    console.log(`[API Client] ${options?.method || "GET"} ${url}`);
    if (options?.body) {
        console.log("[API Client] Request body:", options.body);
    }
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers
            }
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("[API Client] Error response:", data);
            throw new Error(data.error || `API error: ${response.status}`);
        }
        console.log("[API Client] Success response:", data);
        return data;
    } catch (error) {
        console.error("[API Client] Request failed:", error);
        throw error;
    }
}
async function getTokens() {
    return apiCall("/api/tokens");
}
async function getBalances(address) {
    return apiCall(`/api/swap/balances/${address}`);
}
async function getSwapQuote(tokenIn, tokenOut, amountIn) {
    return apiCall("/api/price/quote", {
        method: "POST",
        body: JSON.stringify({
            tokenIn,
            tokenOut,
            amountIn
        })
    });
}
async function buildSwapTransaction(walletAddress, tokenIn, tokenOut, amountIn, minAmountOut) {
    return apiCall("/api/swap/build", {
        method: "POST",
        body: JSON.stringify({
            walletAddress,
            tokenIn,
            tokenOut,
            amountIn,
            minAmountOut
        })
    });
}
async function getTransactionStatus(digest) {
    return apiCall(`/api/transaction/${digest}`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useBalances.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBalances",
    ()=>useBalances
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// hooks/useBalances.ts - Balance fetching hook
"use client";
;
;
function useBalances(address) {
    _s();
    const [balances, setBalances] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchBalances = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBalances.useCallback[fetchBalances]": async ()=>{
            if (!address) {
                console.log("[useBalances] No address, clearing balances");
                setBalances([]);
                return;
            }
            console.log("[useBalances] Fetching balances for:", address);
            setLoading(true);
            setError(null);
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBalances"])(address);
                console.log("[useBalances] Raw response:", data);
                console.log("[useBalances] Balances received:", data.balances);
                // Log each balance for debugging
                data.balances.forEach({
                    "useBalances.useCallback[fetchBalances]": (b)=>{
                        console.log(`[useBalances] ${b.symbol}: ${b.balance} (raw: ${b.balanceRaw})`);
                    }
                }["useBalances.useCallback[fetchBalances]"]);
                setBalances(data.balances);
            } catch (err) {
                console.error("[useBalances] Error:", err);
                setError(err.message || "Failed to fetch balances");
            } finally{
                setLoading(false);
            }
        }
    }["useBalances.useCallback[fetchBalances]"], [
        address
    ]);
    // Fetch on mount and when address changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBalances.useEffect": ()=>{
            fetchBalances();
        }
    }["useBalances.useEffect"], [
        fetchBalances
    ]);
    // Auto-refresh every 15 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBalances.useEffect": ()=>{
            if (!address) return;
            const interval = setInterval({
                "useBalances.useEffect.interval": ()=>{
                    console.log("[useBalances] Auto-refreshing...");
                    fetchBalances();
                }
            }["useBalances.useEffect.interval"], 15000);
            return ({
                "useBalances.useEffect": ()=>clearInterval(interval)
            })["useBalances.useEffect"];
        }
    }["useBalances.useEffect"], [
        address,
        fetchBalances
    ]);
    return {
        balances,
        loading,
        error,
        refetch: fetchBalances,
        getBalance: (symbol)=>{
            const balance = balances.find((b)=>b.symbol === symbol)?.balance || "0";
            console.log(`[useBalances] getBalance(${symbol}) = ${balance}`);
            return balance;
        }
    };
}
_s(useBalances, "8t9uECeEc2gNjQex4OO4a9udn6g=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useWebSocketQuote.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWebSocketQuote",
    ()=>useWebSocketQuote
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// hooks/useWebSocketQuote.ts - Real-time quote updates via WebSocket
"use client";
;
const WS_URL = ("TURBOPACK compile-time value", "ws://localhost:3001") || "ws://localhost:3001";
function useWebSocketQuote(tokenIn, tokenOut, amountIn) {
    _s();
    const [quote, setQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [connected, setConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const wsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reconnectTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWebSocketQuote.useCallback[connect]": ()=>{
            if (!amountIn || parseFloat(amountIn) <= 0) {
                return;
            }
            console.log("[WebSocketQuote] Connecting to", `${WS_URL}/ws/quotes`);
            try {
                const ws = new WebSocket(`${WS_URL}/ws/quotes`);
                wsRef.current = ws;
                ws.onopen = ({
                    "useWebSocketQuote.useCallback[connect]": ()=>{
                        console.log("[WebSocketQuote] Connected");
                        setConnected(true);
                        setError(null);
                        // Subscribe to quote updates
                        ws.send(JSON.stringify({
                            type: "subscribe_quote",
                            data: {
                                tokenIn,
                                tokenOut,
                                amountIn
                            }
                        }));
                        setLoading(true);
                    }
                })["useWebSocketQuote.useCallback[connect]"];
                ws.onmessage = ({
                    "useWebSocketQuote.useCallback[connect]": (event)=>{
                        try {
                            const message = JSON.parse(event.data);
                            console.log("[WebSocketQuote] Message received:", message.type);
                            if (message.type === "quote_update") {
                                setQuote(message.data);
                                setLoading(false);
                                setError(null);
                            } else if (message.type === "quote_error") {
                                setError(message.error);
                                setLoading(false);
                            }
                        } catch (err) {
                            console.error("[WebSocketQuote] Error parsing message:", err);
                        }
                    }
                })["useWebSocketQuote.useCallback[connect]"];
                ws.onerror = ({
                    "useWebSocketQuote.useCallback[connect]": (event)=>{
                        console.error("[WebSocketQuote] Error:", event);
                        setError("WebSocket connection error");
                        setLoading(false);
                    }
                })["useWebSocketQuote.useCallback[connect]"];
                ws.onclose = ({
                    "useWebSocketQuote.useCallback[connect]": ()=>{
                        console.log("[WebSocketQuote] Disconnected");
                        setConnected(false);
                        // Attempt to reconnect after 3 seconds
                        reconnectTimeoutRef.current = setTimeout({
                            "useWebSocketQuote.useCallback[connect]": ()=>{
                                console.log("[WebSocketQuote] Attempting to reconnect...");
                                connect();
                            }
                        }["useWebSocketQuote.useCallback[connect]"], 3000);
                    }
                })["useWebSocketQuote.useCallback[connect]"];
            } catch (err) {
                console.error("[WebSocketQuote] Connection error:", err);
                setError("Failed to connect to WebSocket");
            }
        }
    }["useWebSocketQuote.useCallback[connect]"], [
        tokenIn,
        tokenOut,
        amountIn
    ]);
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWebSocketQuote.useCallback[disconnect]": ()=>{
            console.log("[WebSocketQuote] Disconnecting");
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            setConnected(false);
            setQuote(null);
            setLoading(false);
        }
    }["useWebSocketQuote.useCallback[disconnect]"], []);
    // Connect when parameters change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWebSocketQuote.useEffect": ()=>{
            if (amountIn && parseFloat(amountIn) > 0) {
                disconnect(); // Close existing connection
                connect();
            } else {
                disconnect();
                setQuote(null);
            }
            return ({
                "useWebSocketQuote.useEffect": ()=>{
                    disconnect();
                }
            })["useWebSocketQuote.useEffect"];
        }
    }["useWebSocketQuote.useEffect"], [
        tokenIn,
        tokenOut,
        amountIn
    ]);
    return {
        quote,
        loading,
        error,
        connected,
        reconnect: connect
    };
}
_s(useWebSocketQuote, "m2bfI9ZHzuZIWDo1aIAjQ9qPRv8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/tokens.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/tokens.ts - Token configuration
__turbopack_context__.s([
    "TOKENS",
    ()=>TOKENS,
    "getAllTokens",
    ()=>getAllTokens,
    "getToken",
    ()=>getToken
]);
const TOKENS = {
    SUI: {
        symbol: "SUI",
        name: "Sui",
        decimals: 9,
        coinType: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
        iconUrl: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg"
    },
    DEEP: {
        symbol: "DEEP",
        name: "Deepbook Token",
        decimals: 6,
        coinType: "0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP",
        iconUrl: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
    },
    DBUSDC: {
        symbol: "DBUSDC",
        name: "Deepbook USDC",
        decimals: 6,
        coinType: "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC",
        iconUrl: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
    },
    DBUSDT: {
        symbol: "DBUSDT",
        name: "Deepbook USDT",
        decimals: 6,
        coinType: "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDT::DBUSDT",
        iconUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png"
    },
    WAL: {
        symbol: "WAL",
        name: "Walrus",
        decimals: 9,
        coinType: "0x9ef7676a9f81937a52ae4b2af8d511a28a0b080477c0c2db40b0ab8882240d76::wal::WAL",
        iconUrl: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg"
    },
    DBTC: {
        symbol: "DBTC",
        name: "Deepbook BTC",
        decimals: 8,
        coinType: "0x6502dae813dbe5e42643c119a6450a518481f03063febc7e20238e43b6ea9e86::dbtc::DBTC",
        iconUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
    }
};
function getToken(symbol) {
    return TOKENS[symbol.toUpperCase()];
}
function getAllTokens() {
    return Object.values(TOKENS);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/swap/TokenSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TokenSelector",
    ()=>TokenSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/tokens.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useClickOutside$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useClickOutside.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function TokenSelector({ selectedToken, onSelectToken, excludeToken }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useClickOutside$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClickOutside"])(dropdownRef, {
        "TokenSelector.useClickOutside": ()=>setIsOpen(false)
    }["TokenSelector.useClickOutside"]);
    const allTokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllTokens"])();
    const availableTokens = excludeToken ? allTokens.filter((t)=>t.symbol !== excludeToken.symbol) : allTokens;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        ref: dropdownRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "token-selector hover:bg-gray-800 transition-colors cursor-pointer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: selectedToken.iconUrl,
                        alt: selectedToken.symbol,
                        className: "w-6 h-6 rounded-full"
                    }, void 0, false, {
                        fileName: "[project]/components/swap/TokenSelector.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium",
                        children: selectedToken.symbol
                    }, void 0, false, {
                        fileName: "[project]/components/swap/TokenSelector.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: `w-4 h-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`,
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M19 9l-7 7-7-7"
                        }, void 0, false, {
                            fileName: "[project]/components/swap/TokenSelector.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/swap/TokenSelector.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/swap/TokenSelector.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto",
                children: availableTokens.map((token)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onSelectToken(token);
                            setIsOpen(false);
                        },
                        className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: token.iconUrl,
                                alt: token.symbol,
                                className: "w-8 h-8 rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/components/swap/TokenSelector.tsx",
                                lineNumber: 53,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium text-white",
                                        children: token.symbol
                                    }, void 0, false, {
                                        fileName: "[project]/components/swap/TokenSelector.tsx",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400",
                                        children: token.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/swap/TokenSelector.tsx",
                                        lineNumber: 56,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/swap/TokenSelector.tsx",
                                lineNumber: 54,
                                columnNumber: 15
                            }, this),
                            token.symbol === selectedToken.symbol && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-5 h-5 text-cyan-400",
                                fill: "currentColor",
                                viewBox: "0 0 20 20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/components/swap/TokenSelector.tsx",
                                    lineNumber: 60,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/swap/TokenSelector.tsx",
                                lineNumber: 59,
                                columnNumber: 17
                            }, this)
                        ]
                    }, token.symbol, true, {
                        fileName: "[project]/components/swap/TokenSelector.tsx",
                        lineNumber: 45,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/swap/TokenSelector.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/swap/TokenSelector.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(TokenSelector, "02ci0Qyg6p3t5kYtKKwlhiC3by0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useClickOutside$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClickOutside"]
    ];
});
_c = TokenSelector;
var _c;
__turbopack_context__.k.register(_c, "TokenSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/swap/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SwapPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-client] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/dapp-kit/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turnkey/react-wallet-kit/dist/providers/client/Hook.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useUniversalSwap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useUniversalSwap.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useBalances$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useBalances.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useWebSocketQuote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useWebSocketQuote.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/tokens.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$swap$2f$TokenSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/swap/TokenSelector.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function SwapPage() {
    _s();
    // Get all tokens
    const allTokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllTokens"])();
    // Form state
    const [tokenIn, setTokenIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(allTokens[0]); // SUI
    const [tokenOut, setTokenOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(allTokens[1]); // DEEP
    const [amountIn, setAmountIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showSuccess, setShowSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showLimitModal, setShowLimitModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Swap execution hook (supports both wallet types)
    const { loading, error: swapError, txDigest, executeSwap, reset, walletType } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useUniversalSwap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUniversalSwap"])();
    // Get wallet address from hook
    const standardAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"])();
    const { wallets: turnkeyWallets } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"])();
    const turnkeyAddress = turnkeyWallets?.[0]?.accounts?.[0]?.address;
    const walletAddress = standardAccount?.address || turnkeyAddress;
    const isConnected = !!walletAddress;
    // Balances
    const { balances, getBalance, refetch: refetchBalances } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useBalances$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBalances"])(walletAddress);
    // Real-time quote via WebSocket
    const { quote: wsQuote, loading: wsLoading, error: wsError, connected: wsConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useWebSocketQuote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWebSocketQuote"])(tokenIn.symbol, tokenOut.symbol, amountIn);
    // Handle swap direction toggle
    const handleSwapDirection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SwapPage.useCallback[handleSwapDirection]": ()=>{
            setTokenIn(tokenOut);
            setTokenOut(tokenIn);
            setAmountIn("");
            reset();
        }
    }["SwapPage.useCallback[handleSwapDirection]"], [
        tokenIn,
        tokenOut,
        reset
    ]);
    // Handle max button
    const handleMax = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SwapPage.useCallback[handleMax]": ()=>{
            const balance = getBalance(tokenIn.symbol);
            if (tokenIn.symbol === "SUI" && parseFloat(balance) > 0.01) {
                setAmountIn((parseFloat(balance) - 0.01).toFixed(4));
            } else {
                setAmountIn(balance);
            }
        }
    }["SwapPage.useCallback[handleMax]"], [
        tokenIn.symbol,
        getBalance
    ]);
    // Handle swap execution
    const handleSwap = async ()=>{
        // Show transaction limit modal for Turnkey wallets (simulating limit)
        if (walletType === 'turnkey') {
            setShowLimitModal(true);
            return;
        }
        const result = await executeSwap(tokenIn.symbol, tokenOut.symbol, amountIn);
        if (result) {
            setShowSuccess(true);
            setAmountIn("");
            refetchBalances();
            setTimeout(()=>setShowSuccess(false), 5000);
        }
    };
    // Determine button state
    const getButtonState = ()=>{
        if (!isConnected) {
            return {
                text: "Connect Wallet",
                disabled: false
            };
        }
        if (!amountIn || parseFloat(amountIn) <= 0) return {
            text: "Enter Amount",
            disabled: true
        };
        const balance = parseFloat(getBalance(tokenIn.symbol));
        const amount = parseFloat(amountIn);
        if (amount > balance) {
            return {
                text: `Insufficient ${tokenIn.symbol} Balance`,
                disabled: true
            };
        }
        if (loading) return {
            text: "Swapping...",
            disabled: true
        };
        return {
            text: "Review Swap",
            disabled: false
        };
    };
    const buttonState = getButtonState();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/app/swap/page.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "min-h-screen w-full bg-[#0a0a0f] flex items-center justify-center px-4 pt-24 pb-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-[460px] flex flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center px-2 mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-white text-xl font-semibold tracking-wide",
                                    children: "Swap"
                                }, void 0, false, {
                                    fileName: "[project]/app/swap/page.tsx",
                                    lineNumber: 120,
                                    columnNumber: 17
                                }, this),
                                isConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-slush-text text-xs",
                                    children: [
                                        walletType === 'turnkey' ? '🔐 Turnkey' : '🌊 Browser',
                                        " Wallet"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/swap/page.tsx",
                                    lineNumber: 122,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/swap/page.tsx",
                            lineNumber: 119,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative bg-slush-card rounded-[24px] p-5 border border-slush-border hover:border-white/10 transition-colors group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slush-text font-medium text-sm",
                                            children: "You pay"
                                        }, void 0, false, {
                                            fileName: "[project]/app/swap/page.tsx",
                                            lineNumber: 131,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slush-text font-medium text-sm flex items-center gap-1",
                                            children: [
                                                "Balance: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white",
                                                    children: getBalance(tokenIn.symbol)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/swap/page.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 34
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleMax,
                                                    className: "text-sui-blue text-xs bg-sui-blue/10 px-2 py-0.5 rounded-full hover:bg-sui-blue/20 transition-colors ml-2 font-bold",
                                                    children: "MAX"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/swap/page.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/swap/page.tsx",
                                            lineNumber: 132,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/swap/page.tsx",
                                    lineNumber: 130,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            placeholder: "0",
                                            value: amountIn,
                                            onChange: (e)=>setAmountIn(e.target.value),
                                            className: "bg-transparent text-4xl font-semibold text-white placeholder-white/20 outline-none w-full"
                                        }, void 0, false, {
                                            fileName: "[project]/app/swap/page.tsx",
                                            lineNumber: 145,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$swap$2f$TokenSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenSelector"], {
                                            selectedToken: tokenIn,
                                            onSelectToken: setTokenIn,
                                            excludeToken: tokenOut
                                        }, void 0, false, {
                                            fileName: "[project]/app/swap/page.tsx",
                                            lineNumber: 154,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/swap/page.tsx",
                                    lineNumber: 143,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/swap/page.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative h-2 z-10 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSwapDirection,
                                className: "bg-[#0a0a0f] p-2 rounded-xl border-4 border-[#0a0a0f] text-sui-blue hover:text-white hover:bg-sui-blue hover:scale-110 transition-all shadow-xl",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                                    className: "w-5 h-5",
                                    strokeWidth: 3
                                }, void 0, false, {
                                    fileName: "[project]/app/swap/page.tsx",
                                    lineNumber: 168,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/swap/page.tsx",
                                lineNumber: 164,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/swap/page.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-slush-card rounded-[24px] p-5 border border-slush-border hover:border-white/10 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slush-text font-medium text-sm",
                                            children: "You receive"
                                        }, void 0, false, {
                                            fileName: "[project]/app/swap/page.tsx",
                                            lineNumber: 175,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slush-text font-medium text-sm",
                                            children: [
                                                "Balance: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white",
                                                    children: getBalance(tokenOut.symbol)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/swap/page.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 34
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/swap/page.tsx",
                                            lineNumber: 176,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/swap/page.tsx",
                                    lineNumber: 174,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-4xl font-semibold text-white",
                                            children: wsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/40",
                                                children: "..."
                                            }, void 0, false, {
                                                fileName: "[project]/app/swap/page.tsx",
                                                lineNumber: 185,
                                                columnNumber: 25
                                            }, this) : wsQuote?.estimatedAmountOut ? wsQuote.estimatedAmountOut : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/40",
                                                children: "~"
                                            }, void 0, false, {
                                                fileName: "[project]/app/swap/page.tsx",
                                                lineNumber: 189,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/swap/page.tsx",
                                            lineNumber: 183,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$swap$2f$TokenSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenSelector"], {
                                            selectedToken: tokenOut,
                                            onSelectToken: setTokenOut,
                                            excludeToken: tokenIn
                                        }, void 0, false, {
                                            fileName: "[project]/app/swap/page.tsx",
                                            lineNumber: 194,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/swap/page.tsx",
                                    lineNumber: 181,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/swap/page.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this),
                        swapError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 bg-red-500/10 rounded-2xl border border-red-500/30 text-red-400 text-sm",
                            children: swapError
                        }, void 0, false, {
                            fileName: "[project]/app/swap/page.tsx",
                            lineNumber: 204,
                            columnNumber: 15
                        }, this),
                        showSuccess && txDigest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 bg-green-500/10 rounded-2xl border border-green-500/30 text-green-400 text-sm",
                            children: [
                                "Swap successful!",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `https://suiscan.xyz/testnet/tx/${txDigest}`,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "underline",
                                    children: "View Transaction"
                                }, void 0, false, {
                                    fileName: "[project]/app/swap/page.tsx",
                                    lineNumber: 213,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/swap/page.tsx",
                            lineNumber: 211,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: buttonState.disabled || !isConnected ? undefined : handleSwap,
                            disabled: buttonState.disabled && isConnected,
                            className: `w-full mt-2 bg-sui-blue hover:bg-blue-500 text-white text-lg font-bold py-4 rounded-[20px] shadow-[0_0_30px_rgba(77,162,255,0.3)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${buttonState.disabled && isConnected ? 'opacity-50 cursor-not-allowed' : ''}`,
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "animate-spin h-5 w-5 text-white",
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                className: "opacity-25",
                                                cx: "12",
                                                cy: "12",
                                                r: "10",
                                                stroke: "currentColor",
                                                strokeWidth: "4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/swap/page.tsx",
                                                lineNumber: 234,
                                                columnNumber: 141
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                className: "opacity-75",
                                                fill: "currentColor",
                                                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/swap/page.tsx",
                                                lineNumber: 234,
                                                columnNumber: 242
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/swap/page.tsx",
                                        lineNumber: 234,
                                        columnNumber: 25
                                    }, this),
                                    "Swapping..."
                                ]
                            }, void 0, true) : buttonState.text
                        }, void 0, false, {
                            fileName: "[project]/app/swap/page.tsx",
                            lineNumber: 225,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/swap/page.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/swap/page.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(SwapPage, "tduYMfGfmPDj/Da8CXBDiBgt7bI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useUniversalSwap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUniversalSwap"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turnkey$2f$react$2d$wallet$2d$kit$2f$dist$2f$providers$2f$client$2f$Hook$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTurnkey"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useBalances$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBalances"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useWebSocketQuote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWebSocketQuote"]
    ];
});
_c = SwapPage;
var _c;
__turbopack_context__.k.register(_c, "SwapPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_bb5c033b._.js.map