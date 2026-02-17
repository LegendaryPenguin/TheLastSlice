(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/PrivyProviderWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PrivyProviderWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$privy$2d$io$2f$react$2d$auth$2f$dist$2f$esm$2f$index$2d$BgGYO9kN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__I__as__PrivyProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@privy-io/react-auth/dist/esm/index-BgGYO9kN.mjs [app-client] (ecmascript) <export I as PrivyProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$chain$2f$defineChain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/viem/_esm/utils/chain/defineChain.js [app-client] (ecmascript)");
"use client";
;
;
;
/**
 * Monad Testnet chain definition
 * Chain ID : 10143
 * RPC      : https://testnet-rpc.monad.xyz
 * Explorer : https://testnet.monadexplorer.com
 */ const monadTestnet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$chain$2f$defineChain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineChain"])({
    id: 10143,
    name: "Monad Testnet",
    nativeCurrency: {
        name: "Monad",
        symbol: "MON",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "https://testnet-rpc.monad.xyz"
            ]
        }
    },
    blockExplorers: {
        default: {
            name: "Monad Explorer",
            url: "https://testnet.monadexplorer.com"
        }
    },
    testnet: true
});
function PrivyProviderWrapper({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$privy$2d$io$2f$react$2d$auth$2f$dist$2f$esm$2f$index$2d$BgGYO9kN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__I__as__PrivyProvider$3e$__["PrivyProvider"], {
        appId: ("TURBOPACK compile-time value", "cmlr11kjn00ls0cjpdk3wo96j") ?? "",
        config: {
            // Default to Monad Testnet
            defaultChain: monadTestnet,
            supportedChains: [
                monadTestnet
            ],
            // Auto-create an EVM embedded wallet for every new user
            // (Privy v2 nests this under the chain namespace)
            embeddedWallets: {
                ethereum: {
                    createOnLogin: "users-without-wallets"
                }
            },
            // Login methods - adjust to taste
            loginMethods: [
                "email",
                "wallet",
                "google"
            ],
            appearance: {
                theme: "dark",
                accentColor: "#e63946"
            }
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/PrivyProviderWrapper.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c = PrivyProviderWrapper;
var _c;
__turbopack_context__.k.register(_c, "PrivyProviderWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_PrivyProviderWrapper_tsx_c9e1270e._.js.map