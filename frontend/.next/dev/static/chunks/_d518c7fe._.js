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
"[project]/components/wallet/ConnectButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConnectButton",
    ()=>ConnectButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mysten/dapp-kit/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wallet$2f$WalletDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wallet/WalletDropdown.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ConnectButton() {
    _s();
    const currentAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"])();
    const { mutate: disconnect } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDisconnectWallet"])();
    const [isDropdownOpen, setIsDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
                    lineNumber: 20,
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
                    lineNumber: 28,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/wallet/ConnectButton.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "[&_button]:bg-sui-blue [&_button]:hover:bg-blue-500 [&_button]:text-white [&_button]:px-6 [&_button]:py-2.5 [&_button]:rounded-full [&_button]:font-medium [&_button]:text-sm [&_button]:transition-all [&_button]:shadow-[0_0_15px_rgba(77,162,255,0.4)] hover:[&_button]:shadow-[0_0_25px_rgba(77,162,255,0.6)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConnectButton"], {
            connectText: "Connect Wallet"
        }, void 0, false, {
            fileName: "[project]/components/wallet/ConnectButton.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/wallet/ConnectButton.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(ConnectButton, "4DJ8mVOQv0MhNkWOfh8p7TRonI0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mysten$2f$dapp$2d$kit$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDisconnectWallet"]
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
"[project]/app/swap/page.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/app/swap/page.tsx'\n\nExpected '</', got 'ident'");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
]);

//# sourceMappingURL=_d518c7fe._.js.map