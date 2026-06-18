(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/homepage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getHomepageSections",
    ()=>getHomepageSections,
    "homepageMediaUrl",
    ()=>homepageMediaUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3030") || "http://localhost:3030";
function homepageMediaUrl(media) {
    if (!media?.url) return "";
    if (media.url.startsWith("http")) return media.url;
    if (media.url.startsWith("/uploads")) return `${API_URL}${media.url}`;
    return media.url;
}
function collectMediaIds(sections) {
    const ids = new Set();
    sections.forEach((section)=>{
        const config = section.config || {};
        if (Array.isArray(config.slides)) {
            config.slides.forEach((slide)=>{
                if (slide.mediaId) ids.add(Number(slide.mediaId));
                if (slide.mobileMediaId) ids.add(Number(slide.mobileMediaId));
            });
        }
        if (config.videoBanner?.backgroundMediaId) {
            ids.add(Number(config.videoBanner.backgroundMediaId));
        }
        if (config.videoBanner?.videoMediaId) {
            ids.add(Number(config.videoBanner.videoMediaId));
        }
    });
    return Array.from(ids);
}
async function getHomepageSections() {
    try {
        const res = await fetch(`${API_URL}/homepage`, {
            cache: "no-store"
        });
        if (!res.ok) return [];
        const sections = await res.json();
        const mediaIds = collectMediaIds(sections);
        if (!mediaIds.length) return sections;
        const mediaRes = await fetch(`${API_URL}/media?ids=${mediaIds.join(",")}`, {
            cache: "no-store"
        });
        const media = mediaRes.ok ? await mediaRes.json() : [];
        const mediaMap = new Map(media.map((item)=>[
                item.id,
                item
            ]));
        return sections.map((section)=>({
                ...section,
                config: {
                    ...section.config || {},
                    slides: Array.isArray(section.config?.slides) ? section.config.slides.map((slide)=>({
                            ...slide,
                            media: slide.mediaId ? mediaMap.get(Number(slide.mediaId)) : null,
                            mobileMedia: slide.mobileMediaId ? mediaMap.get(Number(slide.mobileMediaId)) : null
                        })) : section.config?.slides,
                    videoBanner: section.config?.videoBanner ? {
                        ...section.config.videoBanner,
                        backgroundMedia: section.config.videoBanner.backgroundMediaId ? mediaMap.get(Number(section.config.videoBanner.backgroundMediaId)) : null,
                        videoMedia: section.config.videoBanner.videoMediaId ? mediaMap.get(Number(section.config.videoBanner.videoMediaId)) : null
                    } : section.config?.videoBanner
                }
            }));
    } catch  {
        return [];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/HomeHeroSlider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomeHeroSlider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$homepage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/homepage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function HomeHeroSlider({ slides }) {
    _s();
    const sliderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const nextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prevRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const paginationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fallbackSlides = [
        {
            media: {
                id: 0,
                type: "IMAGE",
                url: "/assets/img/slider/slider-1.png"
            },
            mobileMedia: {
                id: 0,
                type: "IMAGE",
                url: "/assets/img/slider/slider-m-1.png"
            }
        },
        {
            media: {
                id: 1,
                type: "IMAGE",
                url: "/assets/img/slider/slider-2.png"
            },
            mobileMedia: {
                id: 1,
                type: "IMAGE",
                url: "/assets/img/slider/slider-m-1.png"
            }
        }
    ];
    const visibleSlides = slides.length ? slides : fallbackSlides;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeHeroSlider.useEffect": ()=>{
            const sliderEl = sliderRef.current;
            if (!sliderEl || !window.Swiper) return;
            if (sliderEl.swiper) {
                sliderEl.swiper.destroy(true, true);
            }
            const swiper = new window.Swiper(sliderEl, {
                loop: visibleSlides.length > 1,
                speed: 1000,
                autoplay: visibleSlides.length > 1 ? {
                    delay: 4000,
                    disableOnInteraction: false
                } : false,
                pagination: {
                    el: paginationRef.current,
                    clickable: true
                },
                navigation: {
                    nextEl: nextRef.current,
                    prevEl: prevRef.current
                },
                observer: true,
                observeParents: true
            });
            return ({
                "HomeHeroSlider.useEffect": ()=>swiper.destroy(true, true)
            })["HomeHeroSlider.useEffect"];
        }
    }["HomeHeroSlider.useEffect"], [
        visibleSlides.length
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: sliderRef,
        className: "main-slider swiper ig-home-hero-slider",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "swiper-wrapper",
                children: visibleSlides.map((slide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "swiper-slide ig-hero-slide",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroMedia, {
                                media: slide.media,
                                mobileMedia: slide.mobileMedia,
                                alt: slide.title || "InsaneGenix performance supplements hero"
                            }, void 0, false, {
                                fileName: "[project]/components/HomeHeroSlider.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this),
                            slide.title || slide.subtitle || slide.ctaText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ig-hero-slide__content",
                                children: [
                                    slide.subtitle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: slide.subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/components/HomeHeroSlider.tsx",
                                        lineNumber: 88,
                                        columnNumber: 35
                                    }, this) : null,
                                    slide.title ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: slide.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/HomeHeroSlider.tsx",
                                        lineNumber: 89,
                                        columnNumber: 32
                                    }, this) : null,
                                    slide.ctaText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: slide.ctaLink || "/shop",
                                        className: "ig-hero-slide__cta",
                                        children: slide.ctaText
                                    }, void 0, false, {
                                        fileName: "[project]/components/HomeHeroSlider.tsx",
                                        lineNumber: 91,
                                        columnNumber: 19
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/HomeHeroSlider.tsx",
                                lineNumber: 87,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, `${slide.media?.url || "fallback"}-${index}`, true, {
                        fileName: "[project]/components/HomeHeroSlider.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/HomeHeroSlider.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: paginationRef,
                className: "swiper-pagination"
            }, void 0, false, {
                fileName: "[project]/components/HomeHeroSlider.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: nextRef,
                className: "swiper-button-next"
            }, void 0, false, {
                fileName: "[project]/components/HomeHeroSlider.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: prevRef,
                className: "swiper-button-prev"
            }, void 0, false, {
                fileName: "[project]/components/HomeHeroSlider.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/HomeHeroSlider.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_s(HomeHeroSlider, "ASYZIQvEUgx+j4QsD2/DETI4JIA=");
_c = HomeHeroSlider;
function HeroMedia({ media, mobileMedia, alt }) {
    const src = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$homepage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["homepageMediaUrl"])(media);
    const mobileSrc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$homepage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["homepageMediaUrl"])(mobileMedia);
    if (media?.type === "VIDEO") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
            className: "ig-hero-slide__media",
            src: src,
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true,
            preload: "metadata"
        }, void 0, false, {
            fileName: "[project]/components/HomeHeroSlider.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("picture", {
        children: [
            mobileMedia?.type === "IMAGE" && mobileSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                srcSet: mobileSrc,
                media: "(max-width: 768px)"
            }, void 0, false, {
                fileName: "[project]/components/HomeHeroSlider.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: src || "/assets/img/slider/slider-1.png",
                alt: alt
            }, void 0, false, {
                fileName: "[project]/components/HomeHeroSlider.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/HomeHeroSlider.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
_c1 = HeroMedia;
var _c, _c1;
__turbopack_context__.k.register(_c, "HomeHeroSlider");
__turbopack_context__.k.register(_c1, "HeroMedia");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AddToCartButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddToCartButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
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
            setMessage("Added to cart");
            setIsAnimating(true);
            window.dispatchEvent(new CustomEvent("cart:updated", {
                detail: {
                    delta: quantity
                }
            }));
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
            children: message === "Added to cart" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                size: 18
            }, void 0, false, {
                fileName: "[project]/components/AddToCartButton.tsx",
                lineNumber: 78,
                columnNumber: 13
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                size: 18
            }, void 0, false, {
                fileName: "[project]/components/AddToCartButton.tsx",
                lineNumber: 80,
                columnNumber: 13
            }, this)
        }, void 0, false)
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
"[project]/lib/products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currency",
    ()=>currency,
    "getProduct",
    ()=>getProduct,
    "getProductCatalog",
    ()=>getProductCatalog,
    "getProductCategories",
    ()=>getProductCategories,
    "getProductPricing",
    ()=>getProductPricing,
    "getProducts",
    ()=>getProducts,
    "productImage",
    ()=>productImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3030") || "http://localhost:3030";
const bundledProductImages = new Set([
    "Creatine.png",
    "D3-K2.png",
    "Dart.png",
    "EAA.png",
    "ISO.png",
    "Mass-Gainer.png",
    "Whey.png"
]);
async function getProducts(params) {
    const data = await getProductCatalog(params);
    return data.products;
}
async function getProductCatalog(params) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value])=>{
        if (value !== undefined && value !== null && String(value) !== "") {
            searchParams.set(key, String(value));
        }
    });
    if (!searchParams.has("limit")) searchParams.set("limit", "9");
    const res = await fetch(`${API_URL}/products?${searchParams.toString()}`, {
        cache: "no-store"
    });
    if (!res.ok) {
        throw new Error(`Products API returned ${res.status}`);
    }
    const data = await res.json();
    const products = Array.isArray(data) ? data : data.products || data.data?.products || data.data;
    return {
        products: Array.isArray(products) ? products : [],
        total: Number(data.total ?? products?.length ?? 0),
        page: Number(data.page || 1),
        pages: Number(data.pages || 1),
        availableTags: Array.isArray(data.availableTags) ? data.availableTags : []
    };
}
async function getProductCategories() {
    try {
        const res = await fetch(`${API_URL}/categories`, {
            next: {
                revalidate: 60
            }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch  {
        return [];
    }
}
async function getProduct(slug) {
    try {
        const res = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`, {
            next: {
                revalidate: 30
            }
        });
        if (res.ok) {
            const data = await res.json();
            return data.product || data;
        }
    } catch (error) {
        console.error(`Unable to fetch product "${slug}" from the API`, error);
    }
    return null;
}
function productImage(product, imageKey = "img1") {
    const image = product[imageKey] || product.img1;
    if (!image) return "/assets/img/product/Whey.png";
    if (String(image).startsWith("http")) return String(image);
    if (String(image).startsWith("/")) return String(image);
    if (bundledProductImages.has(String(image))) return `/assets/img/product/${image}`;
    return `${API_URL}/uploads/products/${image}`;
}
function getProductPricing(product, variant) {
    const basePrice = Number(variant?.price ?? product.price ?? 0);
    const discountType = variant?.discountType ?? product.discountType;
    const discountValue = Number(variant?.discountValue ?? product.discountValue ?? 0);
    let currentPrice = basePrice;
    if (discountType === "PERCENT" && discountValue > 0) {
        currentPrice = Math.max(0, Math.round(basePrice - basePrice * discountValue / 100));
    } else if (discountType === "FLAT" && discountValue > 0) {
        currentPrice = Math.max(0, Math.round(basePrice - discountValue));
    }
    const configuredMrp = Number(variant?.mrp ?? product.originalPrice ?? 0);
    const originalPrice = currentPrice < basePrice ? basePrice : configuredMrp > currentPrice ? configuredMrp : null;
    const discountPercent = originalPrice ? Math.round((originalPrice - currentPrice) / originalPrice * 100) : null;
    return {
        currentPrice,
        originalPrice,
        discountPercent
    };
}
function currency(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddToCartButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AddToCartButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/products.ts [app-client] (ecmascript)");
;
;
;
;
function ProductCard({ product }) {
    const defaultVariant = product.variants?.find((variant)=>variant.isDefault) || product.variants?.[0];
    const { currentPrice, originalPrice, discountPercent } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductPricing"])(product, defaultVariant);
    const meta = defaultVariant?.weightLabel || defaultVariant?.flavour || product.goal || product.category?.name;
    const averageRating = Number(product.averageRating || 0);
    const reviewCount = Number(product.reviewCount || 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "product-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: `/product/${product.slug}`,
                className: "product-card__image-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productImage"])(product),
                    alt: product.title,
                    className: "product-card__image"
                }, void 0, false, {
                    fileName: "[project]/components/ProductCard.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ProductCard.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "product-card__content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/product/${product.slug}`,
                        className: "product-card__title-link",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "product-card__title",
                            children: product.title
                        }, void 0, false, {
                            fileName: "[project]/components/ProductCard.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this),
                    meta ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "product-card__meta",
                        children: meta
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 25,
                        columnNumber: 17
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "product-card__rating",
                        "aria-label": `${averageRating.toFixed(1)} product rating`,
                        children: [
                            [
                                1,
                                2,
                                3,
                                4,
                                5
                            ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: star <= Math.round(averageRating) ? "active" : "",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/assets/img/icon/rating-star.svg",
                                        alt: ""
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductCard.tsx",
                                        lineNumber: 30,
                                        columnNumber: 15
                                    }, this)
                                }, star, false, {
                                    fileName: "[project]/components/ProductCard.tsx",
                                    lineNumber: 29,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: reviewCount ? `${averageRating.toFixed(1)} (${reviewCount})` : "No ratings"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCard.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "product-card__price-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "product-card__price",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currency"])(currentPrice)
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCard.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this),
                            originalPrice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "product-card__original-price",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currency"])(originalPrice)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductCard.tsx",
                                        lineNumber: 40,
                                        columnNumber: 15
                                    }, this),
                                    discountPercent && discountPercent > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "product-card__badge",
                                        children: [
                                            discountPercent,
                                            "% off"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductCard.tsx",
                                        lineNumber: 42,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "product-card__actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddToCartButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                product: product,
                                className: "product-card__cart-icon-btn"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCard.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/product/${product.slug}`,
                                className: "product-card__buy-btn",
                                children: "Buy Now"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCard.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductCard.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ProductCard.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = ProductCard;
var _c;
__turbopack_context__.k.register(_c, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/HomeProductSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomeProductSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ProductCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function HomeProductSection({ id, title, products }) {
    _s();
    const carouselRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const nextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prevRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeProductSection.useEffect": ()=>{
            const carousel = carouselRef.current;
            if (!carousel || products.length < 2) return;
            let swiper;
            let retryTimer;
            let cancelled = false;
            const initialize = {
                "HomeProductSection.useEffect.initialize": ()=>{
                    if (cancelled) return;
                    if (!window.Swiper) {
                        retryTimer = setTimeout(initialize, 100);
                        return;
                    }
                    if (carousel.swiper) {
                        carousel.swiper.destroy(true, true);
                    }
                    swiper = new window.Swiper(carousel, {
                        slidesPerView: "auto",
                        spaceBetween: 16,
                        speed: 500,
                        loop: false,
                        allowTouchMove: true,
                        simulateTouch: true,
                        touchStartPreventDefault: false,
                        autoplay: {
                            delay: 5000,
                            disableOnInteraction: false
                        },
                        navigation: {
                            nextEl: nextRef.current,
                            prevEl: prevRef.current
                        },
                        observer: true,
                        observeParents: true
                    });
                }
            }["HomeProductSection.useEffect.initialize"];
            initialize();
            return ({
                "HomeProductSection.useEffect": ()=>{
                    cancelled = true;
                    if (retryTimer) clearTimeout(retryTimer);
                    if (swiper) swiper.destroy(true, true);
                }
            })["HomeProductSection.useEffect"];
        }
    }["HomeProductSection.useEffect"], [
        products.length
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `product-area-2 ig-home-product-section ig-home-product-section--${id}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "eg-product-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "row align-items-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-lg-7",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "eg-section mb-40",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ig-home-product-section__eyebrow",
                                            children: "Shop InsaneGenix"
                                        }, void 0, false, {
                                            fileName: "[project]/components/HomeProductSection.tsx",
                                            lineNumber: 79,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "eg-section__title title-white",
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/components/HomeProductSection.tsx",
                                            lineNumber: 80,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/HomeProductSection.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/HomeProductSection.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this),
                            products.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-lg-5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "eg-product-2__arrow d-flex justify-content-end mb-30",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            ref: prevRef,
                                            type: "button",
                                            className: "eg-product-2__prev ig-home-product-prev",
                                            "aria-label": `Previous ${title}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: arrowIcon("previous")
                                            }, void 0, false, {
                                                fileName: "[project]/components/HomeProductSection.tsx",
                                                lineNumber: 93,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/HomeProductSection.tsx",
                                            lineNumber: 87,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            ref: nextRef,
                                            type: "button",
                                            className: "eg-product-2__next ig-home-product-next",
                                            "aria-label": `Next ${title}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: arrowIcon("next")
                                            }, void 0, false, {
                                                fileName: "[project]/components/HomeProductSection.tsx",
                                                lineNumber: 101,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/HomeProductSection.tsx",
                                            lineNumber: 95,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/HomeProductSection.tsx",
                                    lineNumber: 86,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/HomeProductSection.tsx",
                                lineNumber: 85,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/HomeProductSection.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    products.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: carouselRef,
                        className: "swiper eg-product-2__active ig-home-product-carousel",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "swiper-wrapper",
                            children: products.slice(0, 8).map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "swiper-slide mb-40 mt-10 ig-home-product-slide",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        product: product
                                    }, void 0, false, {
                                        fileName: "[project]/components/HomeProductSection.tsx",
                                        lineNumber: 112,
                                        columnNumber: 21
                                    }, this)
                                }, product.id, false, {
                                    fileName: "[project]/components/HomeProductSection.tsx",
                                    lineNumber: 111,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/HomeProductSection.tsx",
                            lineNumber: 109,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/HomeProductSection.tsx",
                        lineNumber: 108,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ig-home-product-section__empty",
                        children: [
                            "Products marked as ",
                            title.toLowerCase(),
                            " will appear here."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/HomeProductSection.tsx",
                        lineNumber: 118,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/HomeProductSection.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/HomeProductSection.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/HomeProductSection.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(HomeProductSection, "CoI3e03mjOJxASJ3iYI2mX7g0h0=");
_c = HomeProductSection;
function arrowIcon(direction) {
    const isPrevious = direction === "previous";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "39",
        height: "16",
        viewBox: "0 0 39 16",
        fill: "currentColor",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: isPrevious ? "M0.292893 8.70711C-0.0976311 8.31659 -0.0976311 7.68342 0.292893 7.2929L6.65685 0.928936C7.04738 0.538411 7.68054 0.538411 8.07107 0.928936C8.46159 1.31946 8.46159 1.95262 8.07107 2.34315L2.41421 8L8.07107 13.6569C8.46159 14.0474 8.46159 14.6805 8.07107 15.0711C7.68054 15.4616 7.04738 15.4616 6.65685 15.0711L0.292893 8.70711ZM39 9L1 9L1 7L39 7L39 9Z" : "M38.7071 8.70711C39.0976 8.31659 39.0976 7.68342 38.7071 7.2929L32.3431 0.928935C31.9526 0.538411 31.3195 0.538411 30.9289 0.928935C30.5384 1.31946 30.5384 1.95263 30.9289 2.34315L36.5858 8L30.9289 13.6569C30.5384 14.0474 30.5384 14.6805 30.9289 15.0711C31.3195 15.4616 31.9526 15.4616 32.3431 15.0711L38.7071 8.70711ZM0 9L38 9L38 7L0 7L0 9Z"
        }, void 0, false, {
            fileName: "[project]/components/HomeProductSection.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/HomeProductSection.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "HomeProductSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>Check
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
];
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("check", __iconNode);
;
 //# sourceMappingURL=check.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)");
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
]);

//# sourceMappingURL=_613dcfec._.js.map