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
]);

//# sourceMappingURL=_cdd3a855._.js.map