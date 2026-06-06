(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/AddToCartButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddToCartButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/cart.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$modal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-modal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/wishlist.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function AddToCartButton({ product, className = "ig-add-cart-btn", label, quantity = 1, variantId, sizeId }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isAnimating, setIsAnimating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const defaultVariant = product.variants?.find((variant)=>variant.isDefault) || product.variants?.[0];
    const onClick = async ()=>{
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomerToken"])()) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$modal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openAuthModal"])("login");
            return;
        }
        try {
            setLoading(true);
            setMessage("");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addToCart"])(product.id, variantId ?? defaultVariant?.id, sizeId, quantity);
            setMessage("Added");
            setIsAnimating(true);
            window.dispatchEvent(new Event("cart:updated"));
            setTimeout(()=>setIsAnimating(false), 600);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "";
            if (errorMessage === "LOGIN_REQUIRED") {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$modal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openAuthModal"])("login");
                return;
            }
            if (/select|flavour|size/i.test(errorMessage)) {
                window.location.href = `/product/${product.slug}`;
                return;
            }
            setMessage(errorMessage || "Could not add");
        } finally{
            setLoading(false);
            window.setTimeout(()=>setMessage(""), 1800);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `${className} ${isAnimating ? "is-animating" : ""}`,
        onClick: onClick,
        disabled: loading,
        "aria-label": `Add ${product.title} to cart`,
        title: message || "Add to cart",
        children: label ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: loading ? "Adding..." : message || label
        }, void 0, false, {
            fileName: "[project]/components/AddToCartButton.tsx",
            lineNumber: 74,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/components/AddToCartButton.tsx",
                    lineNumber: 77,
                    columnNumber: 11
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "cart-feedback",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/components/AddToCartButton.tsx",
                    lineNumber: 78,
                    columnNumber: 23
                }, this)
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/components/AddToCartButton.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(AddToCartButton, "VUQ0uvC25K62TqaC08bfxgSgQCI=");
_c = AddToCartButton;
var _c;
__turbopack_context__.k.register(_c, "AddToCartButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/WishlistButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WishlistButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$modal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-modal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/wishlist.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function WishlistButton({ productId, variantId, label = false, onWishedChange }) {
    _s();
    const [wished, setWished] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAnimating, setIsAnimating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WishlistButton.useEffect": ()=>{
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomerToken"])()) return;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkWishlist"])(productId, variantId).then({
                "WishlistButton.useEffect": (res)=>setWished(res.wished)
            }["WishlistButton.useEffect"]).catch({
                "WishlistButton.useEffect": ()=>undefined
            }["WishlistButton.useEffect"]);
        }
    }["WishlistButton.useEffect"], [
        productId,
        variantId
    ]);
    const onClick = async ()=>{
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCustomerToken"])()) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$modal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openAuthModal"])("login");
            return;
        }
        try {
            setLoading(true);
            setIsAnimating(true);
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wishlist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleWishlist"])(productId, variantId);
            setWished(res.wished);
            onWishedChange?.(res.wished);
            window.dispatchEvent(new Event("wishlist:updated"));
            setTimeout(()=>setIsAnimating(false), 600);
        } catch (error) {
            if (error instanceof Error && error.message === "LOGIN_REQUIRED") {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$modal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openAuthModal"])("login");
            }
            setIsAnimating(false);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `ig-wishlist-btn ${wished ? "is-active" : ""} ${label ? "has-label" : ""} ${isAnimating ? "is-animating" : ""}`,
        onClick: onClick,
        disabled: loading,
        "aria-label": wished ? "Remove from wishlist" : "Add to wishlist",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                size: 18,
                fill: wished ? "currentColor" : "none"
            }, void 0, false, {
                fileName: "[project]/components/WishlistButton.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            label ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: wished ? "Wishlisted" : "Wishlist"
            }, void 0, false, {
                fileName: "[project]/components/WishlistButton.tsx",
                lineNumber: 64,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/WishlistButton.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(WishlistButton, "qz6MCS+Se97V2bXPXMdmN4sO6wA=");
_c = WishlistButton;
var _c;
__turbopack_context__.k.register(_c, "WishlistButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ShoppingCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "8",
            cy: "21",
            r: "1",
            key: "jimo8o"
        }
    ],
    [
        "circle",
        {
            cx: "19",
            cy: "21",
            r: "1",
            key: "13723u"
        }
    ],
    [
        "path",
        {
            d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
            key: "9zh506"
        }
    ]
];
const ShoppingCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("shopping-cart", __iconNode);
;
 //# sourceMappingURL=shopping-cart.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShoppingCart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.561.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Heart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
            key: "mvr1a0"
        }
    ]
];
const Heart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("heart", __iconNode);
;
 //# sourceMappingURL=heart.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Heart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_ad9de8ec._.js.map