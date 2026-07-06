"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthActionButton from "@/components/AuthActionButton";
import { openAuthModal } from "@/lib/auth-modal";
import { getCart, getCustomerToken } from "@/lib/cart";
import { INSTAGRAM_URL } from "@/lib/social-links";
import { getWishlist } from "@/lib/wishlist";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

type HeaderCategory = {
  id: number | string;
  name: string;
  image?: string | null;
};

type HeaderProduct = {
  id: number | string;
  title: string;
  slug: string;
  img1?: string | null;
  img2?: string | null;
  img3?: string | null;
  img4?: string | null;
  img5?: string | null;
  img6?: string | null;
};

const fallbackCategories: HeaderCategory[] = [
  { id: "proteins", name: "Proteins", image: "/assets/img/category/Proteins.jpg" },
  { id: "gainers", name: "Gainers", image: "/assets/img/category/Gainers.jpg" },
  { id: "pre-post", name: "Pre/Post Workout", image: "/assets/img/category/Pre-Post.jpg" },
  { id: "fit-foods", name: "Fit Foods", image: "/assets/img/category/Fit-Foods.jpg" },
];

const bundledProductImages = new Set([
  "Creatine.png",
  "D3-K2.png",
  "Dart.png",
  "EAA.png",
  "ISO.png",
  "Mass-Gainer.png",
  "Whey.png",
]);

const defaultPopularSearches = [
  "Protein",
  "Creatine",
  "Pre Workout",
  "Whey Protein",
  "Mass Gainer",
  "Recovery",
];

function productImageUrl(product: HeaderProduct) {
  const image = product.img1 || product.img2 || product.img3 || product.img4 || product.img5 || product.img6;
  if (!image) return "/assets/img/product/Whey.png";
  if (String(image).startsWith("http") || String(image).startsWith("/")) return String(image);
  if (bundledProductImages.has(String(image))) return `/assets/img/product/${image}`;
  return `${API_URL}/uploads/products/${image}`;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<HeaderCategory[]>(fallbackCategories);
  const [sheetProducts, setSheetProducts] = useState<HeaderProduct[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [animateCart, setAnimateCart] = useState(false);
  const [animateWishlist, setAnimateWishlist] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productTags, setProductTags] = useState<string[]>([]);

  const fetchCounts = useCallback(async (isInitial = false) => {
    const token = getCustomerToken();

    try {
      // Get Cart counts
      const cart = await getCart();
      const newCartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount((prev) => {
        if (!isInitial && prev !== newCartCount) {
          setAnimateCart(true);
          setTimeout(() => setAnimateCart(false), 550);
        }
        return newCartCount;
      });

      if (!token) {
        setWishlistCount(0);
      } else {
        // Get Wishlist counts
        const wishlist = await getWishlist();
        const newWishlistCount = wishlist?.length || 0;
        setWishlistCount((prev) => {
          if (!isInitial && prev !== newWishlistCount) {
            setAnimateWishlist(true);
            setTimeout(() => setAnimateWishlist(false), 550);
          }
          return newWishlistCount;
        });
      }
    } catch (e) {
      console.error("Failed to load header counts:", e);
    }
  }, []);

  useEffect(() => {
    fetchCounts(true);

    const updateCartCount = (newCartCount: number) => {
      setCartCount((prev) => {
        if (prev !== newCartCount) {
          setAnimateCart(true);
          setTimeout(() => setAnimateCart(false), 550);
        }
        return newCartCount;
      });
    };

    const onCartUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ count?: number; delta?: number }>).detail;
      if (typeof detail?.count === "number") {
        updateCartCount(Math.max(0, detail.count));
        return;
      } else if (typeof detail?.delta === "number") {
        setCartCount((prev) => {
          const nextCount = Math.max(0, prev + detail.delta!);
          if (prev !== nextCount) {
            setAnimateCart(true);
            setTimeout(() => setAnimateCart(false), 550);
          }
          return nextCount;
        });
      }
      fetchCounts(false);
    };
    const onWishlistUpdated = () => fetchCounts(false);
    const onAuthChanged = () => fetchCounts(true);

    window.addEventListener("cart:updated", onCartUpdated);
    window.addEventListener("wishlist:updated", onWishlistUpdated);
    window.addEventListener("auth:changed", onAuthChanged);

    return () => {
      window.removeEventListener("cart:updated", onCartUpdated);
      window.removeEventListener("wishlist:updated", onWishlistUpdated);
      window.removeEventListener("auth:changed", onAuthChanged);
    };
  }, [fetchCounts]);

  useEffect(() => {
    fetch(`${API_URL}/categories`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setCategories(data);
        }
      })
      .catch(() => setCategories(fallbackCategories));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/products?limit=12`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const products = Array.isArray(data)
          ? data
          : data?.products || data?.data?.products || data?.data;
        if (Array.isArray(products)) {
          setSheetProducts(products.slice(0, 12));
        }
        if (Array.isArray(data?.availableTags)) {
          setProductTags(data.availableTags.filter((tag: unknown): tag is string => typeof tag === "string"));
        }
      })
      .catch(() => {
        setSheetProducts([]);
        setProductTags([]);
      });
  }, []);

  useEffect(() => {
    document.body.classList.toggle("ig-category-sheet-lock", categorySheetOpen);
    return () => document.body.classList.remove("ig-category-sheet-lock");
  }, [categorySheetOpen]);

  useEffect(() => {
    document.body.classList.toggle("ig-search-overlay-lock", searchOpen);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    if (searchOpen) window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("ig-search-overlay-lock");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [searchOpen]);

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  const popularSearches = [...categories.map((category) => category.name), ...productTags, ...defaultPopularSearches]
    .filter((term, index, terms) => {
      const normalizedTerm = term.trim().toLowerCase();
      return normalizedTerm && terms.findIndex((item) => item.trim().toLowerCase() === normalizedTerm) === index;
    })
    .slice(0, 10);

  const isActiveMobileNav = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleMobileAccountClick = () => {
    if (getCustomerToken()) {
      router.push("/profile");
      return;
    }

    openAuthModal("login");
  };

  return (
    <header className="header">
      <div id="header-sticky" className="menu-area eg-header__area eg-header__transparent header-sticky-2">
        <div className="container custom-container">
          <div className="row">
            <div className="col-12">
              <div className="eg-header__mobile-toggler d-block d-xl-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32">
                  <path d="M11.187 2.275H5a3.003 3.003 0 0 0-3 3v6.186a3.003 3.003 0 0 0 3 3h6.187a3.003 3.003 0 0 0 3-3V5.275a3.003 3.003 0 0 0-3-3zm1 9.186a1.001 1.001 0 0 1-1 1H5a1.001 1.001 0 0 1-1-1V5.275a1.001 1.001 0 0 1 1-1h6.187a1.001 1.001 0 0 1 1 1zM27 2.275h-6.187a3.003 3.003 0 0 0-3 3v6.186a3.003 3.003 0 0 0 3 3H27a3.003 3.003 0 0 0 3-3V5.275a3.003 3.003 0 0 0-3-3zm1 9.186a1.001 1.001 0 0 1-1 1h-6.187a1.001 1.001 0 0 1-1-1V5.275a1.001 1.001 0 0 1 1-1H27a1.001 1.001 0 0 1 1 1zM11.187 17.54H5a3.003 3.003 0 0 0-3 3v6.185a3.003 3.003 0 0 0 3 3h6.187a3.003 3.003 0 0 0 3-3V20.54a3.003 3.003 0 0 0-3-3zm1 9.185a1.001 1.001 0 0 1-1 1H5a1.001 1.001 0 0 1-1-1V20.54a1.001 1.001 0 0 1 1-1h6.187a1.001 1.001 0 0 1 1 1zM27 17.54h-6.187a3.003 3.003 0 0 0-3 3v6.185a3.003 3.003 0 0 0 3 3H27a3.003 3.003 0 0 0 3-3V20.54a3.003 3.003 0 0 0-3-3zm1 9.185a1.001 1.001 0 0 1-1 1h-6.187a1.001 1.001 0 0 1-1-1V20.54a1.001 1.001 0 0 1 1-1H27a1.001 1.001 0 0 1 1 1z" fill="#fff" />
                </svg>
              </div>
              <div className="eg-menu__wrap">
                <nav className="eg-menu__nav">
                  <div className="row align-items-centers justify-content-between">
                    <div className="col-lg-2 d-flex align-items-center">
                      <div className="eg-menu__logo mb-20 mr-100">
                        <Link href="/">
                          <img src="/assets/img/logo/logo-white.png" alt="InsaneGenix" />
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-6 d-flex align-items-centers">
                      <div className="eg-menu__main-menu main-menu-2 d-none d-xl-flex">
                        <ul className="navigation">
                          <li>
                            <Link href="/">Home</Link>
                          </li>
                          <li>
                            <Link href="/about">About Us</Link>
                          </li>
                          <li>
                            <Link href="/shop">All Products</Link>
                          </li>
                          <li>
                            <Link href="/authenticity">Authenticity</Link>
                          </li>
                          <li>
                            <Link href="/blogs">Blogs</Link>
                          </li>
                          <li className="eg-menu__header-btn">
                            <Link href="/contact">Contact Us</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-end">
                      <div className="eg-menu__header-actions actions-2 d-none d-lg-block">
                        <ul className="d-flex align-items-center">
                          <li className="eg-menu__header-search">
                            <button
                              type="button"
                              className="ig-header-search-trigger"
                              aria-label="Open product search"
                              aria-haspopup="dialog"
                              onClick={() => setSearchOpen(true)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 6.35 6.35">
                                <path d="M2.894.511a2.384 2.384 0 0 0-2.38 2.38 2.386 2.386 0 0 0 2.38 2.384c.56 0 1.076-.197 1.484-.523l.991.991a.265.265 0 0 0 .375-.374l-.991-.992a2.37 2.37 0 0 0 .523-1.485C5.276 1.58 4.206.51 2.894.51zm0 .53c1.026 0 1.852.825 1.852 1.85S3.92 4.746 2.894 4.746s-1.851-.827-1.851-1.853.825-1.852 1.851-1.852z" fill="#fff" />
                              </svg>
                            </button>
                          </li>
                          <li className="eg-menu__header-divider">|</li>
                          <li className={`eg-menu__header-wishlist custom-cart-icon ${animateWishlist ? "animate-icon-pop" : ""}`}>
                            <Link href="/wishlist" className="custom-cart-link" aria-label="Wishlist">
                              <svg className="custom-cart-svg" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none">
                                <path d="M20.84 4.61C20.33 4.1 19.72 3.7 19.05 3.43C18.38 3.16 17.66 3.02 16.94 3.02C16.22 3.02 15.5 3.16 14.83 3.43C14.16 3.7 13.55 4.1 13.04 4.61L12 5.65L10.96 4.61C9.93 3.58 8.53 3 7.07 3C5.61 3 4.21 3.58 3.18 4.61C2.15 5.64 1.57 7.04 1.57 8.5C1.57 9.96 2.15 11.36 3.18 12.39L12 21.21L20.82 12.39C21.33 11.88 21.73 11.27 22 10.6C22.28 9.93 22.42 9.22 22.42 8.5C22.42 7.78 22.28 7.07 22.01 6.4C21.74 5.73 21.35 5.12 20.84 4.61Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {wishlistCount > 0 && (
                                <span className="custom-wishlist-count">{wishlistCount}</span>
                              )}
                            </Link>
                          </li>
                          <li className="eg-menu__header-divider">|</li>
                          <li className={`eg-menu__header-cart custom-cart-icon ${animateCart ? "animate-icon-pop" : ""}`}>
                            <Link href="/cart" className="custom-cart-link" aria-label="Shopping Cart">
                              <svg className="custom-cart-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 3H5L7.4 14.39C7.49 14.81 7.72 15.19 8.05 15.47C8.38 15.75 8.79 15.9 9.21 15.9H18.4C18.82 15.9 19.23 15.75 19.56 15.47C19.89 15.19 20.12 14.81 20.21 14.39L21.6 7H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="9" cy="20" r="1.5" fill="white" />
                                <circle cx="18" cy="20" r="1.5" fill="white" />
                              </svg>
                              {cartCount > 0 && (
                                <span className="custom-cart-count">{cartCount}</span>
                              )}
                            </Link>
                          </li>
                          <li className="eg-menu__header-divider">|</li>
                          <li className="eg-menu__header-user user-2">
                            <AuthActionButton className="ig-header-auth-btn" ariaLabel="Open customer account menu">
                              {({ isLoggedIn, displayName }) => {
                                const label = isLoggedIn && displayName ? `Hi, ${displayName}` : "Account";

                                return (
                                  <>
                                    <svg className="ig-account-icon" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 32 32">
                                      <path d="M16 1c-4.415 0-8 3.585-8 8s3.585 8 8 8 8-3.585 8-8-3.585-8-8-8zm0 2c3.311 0 6 2.689 6 6s-2.689 6-6 6-6-2.689-6-6 2.689-6 6-6zM31 27.49a5.003 5.003 0 0 0-1.523-3.595C27.518 22.026 23.264 19 16 19c-7.266 0-11.52 3.027-13.469 4.896A4.996 4.996 0 0 0 1.005 27.48C1 27.646 1 27.823 1 28c0 .796.316 1.559.879 2.121A2.996 2.996 0 0 0 4 31h24c.796 0 1.559-.316 2.121-.879A2.996 2.996 0 0 0 31 28zm-2-.001V28a.997.997 0 0 1-1 1H4a.997.997 0 0 1-1-1l.005-.51c0-.811.329-1.588.912-2.152C5.665 23.663 9.493 21 16 21s10.335 2.663 12.088 4.334c.583.566.912 1.343.912 2.155z" fill="currentColor" />
                                    </svg>
                                    <span className="user" title={label}>
                                      {isLoggedIn && displayName ? (
                                        <span className="ig-account-copy">
                                          <span className="ig-account-hi">Hi,</span>
                                          <span className="ig-account-name">{displayName}</span>
                                        </span>
                                      ) : (
                                        <span className="ig-account-label">Account</span>
                                      )}
                                      <svg className="ig-account-chevron" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M5.97 8.47a.75.75 0 0 1 1.06 0l5.47 5.47 5.47-5.47a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 0-1.06z" />
                                      </svg>
                                    </span>
                                  </>
                                );
                              }}
                            </AuthActionButton>
                          </li>
                          <li className="eg-menu__header-offCanvas-btn offCanvas-btn-2 d-none d-xl-block">
                            <button type="button" className="hamburger-btn offcanvas-open-btn" aria-label="Open menu">
                              <span></span>
                              <span></span>
                              <span></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
              <div className="eg-mobile__menu">
                <nav className="eg-mobile__menu-box">
                  <div className="eg-mobile__menu-top d-flex justify-content-between align-items-center">
                    <div className="eg-mobile__logo">
                      <Link href="/"><img src="/assets/img/logo/logo-white.png" alt="InsaneGenix" /></Link>
                    </div>
                    <div className="eg-mobile__close-btn">
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
                  <div className="eg-mobile__menu-outer" data-react-mobile-menu>
                    <ul className="navigation">
                      <li>
                        <Link href="/">Home</Link>
                      </li>
                      <li>
                        <Link href="/about">About Us</Link>
                      </li>
                      <li>
                        <Link href="/shop">All Products</Link>
                      </li>
                      <li>
                        <Link href="/authenticity">Authenticity</Link>
                      </li>
                      <li>
                        <Link href="/blogs">Blogs</Link>
                      </li>
                      <li>
                        <Link href="/contact">Contact Us</Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="eg-mobile__menu-backdrop"></div>
              <div className="eg-header__offCanvas-wrap">
                <div className="eg-header__offCanvas-toggle">
                  <i className="fas fa-times"></i>
                </div>
                <div className="eg-header__offCanvas-body">
                  <div className="eg-header__offCanvas-content mb-60">
                    <h3 className="eg-header__offCanvas-title">Fuel Your <span>Workout</span> With Premium Gym Gear.</h3>
                    <p>Engineered for strength, comfort, and high-performance training.</p>
                  </div>
                  <div className="eg-header__offCanvas-contact mb-25">

                    <a className="email" href="mailto:info@insanegenix.com">info@insanegenix.com</a>
                  </div>
                  <div className="eg-header__offCanvas-social">
                    <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                    <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                  </div>
                </div>
              </div>
              <div className="eg-header__offCanvas-overlay"></div>
            </div>
          </div>
        </div>
      </div>
      <nav className="ig-mobile-bottom-nav" aria-label="Mobile primary navigation">
        <Link href="/" className={isActiveMobileNav("/") ? "is-active" : ""}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" />
          </svg>
          <span>Home</span>
        </Link>
        <Link href="/shop" className={isActiveMobileNav("/shop") ? "is-active" : ""}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 3h12l1 5H5zm-1 7h14v11H5zm4 3h6v5H9z" />
          </svg>
          <span>Shop</span>
        </Link>
        <button
          type="button"
          className={`ig-mobile-bottom-nav__primary ${categorySheetOpen ? "is-active" : ""}`}
          aria-label="Browse products"
          aria-expanded={categorySheetOpen}
          aria-controls="mobile-category-sheet"
          onClick={() => setCategorySheetOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />
          </svg>
          <span>Products</span>
        </button>
        <button
          type="button"
          className={isActiveMobileNav("/profile") ? "is-active" : ""}
          onClick={handleMobileAccountClick}
          aria-label="Open customer account"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm-8 9a8 8 0 0 1 16 0z" />
          </svg>
          <span>Account</span>
        </button>
        <Link href="/cart" className={isActiveMobileNav("/cart") ? "is-active" : ""}>
          <span className="ig-mobile-bottom-nav__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2zM5.2 5 7 14h10.4l1.4-7H7.1L6.7 5zM3 3h3.3l.4 2H21l-2.2 11H5.4L3.8 5H3z" />
            </svg>
            {cartCount > 0 && <small>{cartCount}</small>}
          </span>
          <span>Cart</span>
        </Link>
      </nav>
      <div className={`ig-category-sheet ${categorySheetOpen ? "is-open" : ""}`} aria-hidden={!categorySheetOpen}>
        <button
          type="button"
          className="ig-category-sheet__backdrop"
          onClick={() => setCategorySheetOpen(false)}
          aria-label="Close products"
        />
        <div id="mobile-category-sheet" className="ig-category-sheet__panel" role="dialog" aria-modal="true" aria-label="Select product">
          <div className="ig-category-sheet__handle" />
          <div className="ig-category-sheet__header">
            <div>
              <span>Shop by</span>
              <h3>Products</h3>
            </div>
            <button type="button" onClick={() => setCategorySheetOpen(false)} aria-label="Close products">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4zm12.6 1.4L6.4 19 5 17.6 17.6 5z" />
              </svg>
            </button>
          </div>
          <div className="ig-category-sheet__grid ig-category-sheet__grid--products">
            {sheetProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="ig-category-sheet__card"
                onClick={() => setCategorySheetOpen(false)}
              >
                <img src={productImageUrl(product)} alt="" />
                <span>{product.title}</span>
              </Link>
            ))}
            {!sheetProducts.length ? (
              <Link href="/shop" className="ig-category-sheet__card" onClick={() => setCategorySheetOpen(false)}>
                <img src="/assets/img/product/Whey.png" alt="" />
                <span>View all products</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      {searchOpen && (
        <div
          className="ig-search-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ig-search-title"
        >
          <div className="ig-search-overlay__top">
            <Link href="/" className="ig-search-overlay__logo" aria-label="InsaneGenix home">
              <img src="/assets/img/logo/logo-black.png" alt="InsaneGenix" />
            </Link>
            <button
              type="button"
              className="ig-search-overlay__close"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4zm12.6 1.4L6.4 19 5 17.6 17.6 5z" />
              </svg>
            </button>
          </div>
          <div className="ig-search-overlay__content">
            <h2 id="ig-search-title">What are you looking for?</h2>
            <form className="ig-search-overlay__form" action="/shop" method="get">
              <label className="visually-hidden" htmlFor="header-product-search">
                Search products
              </label>
              <input
                id="header-product-search"
                name="search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Enter your keyword..."
                autoComplete="off"
                autoFocus
              />
              <button type="submit" aria-label="Search products" disabled={!searchTerm.trim()}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m21 20-4.65-4.65a7.5 7.5 0 1 0-1.41 1.41L19.59 21zM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0" />
                </svg>
              </button>
            </form>
            <div className="ig-search-overlay__popular">
              <span>Popular searches</span>
              <div>
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/shop?search=${encodeURIComponent(term)}`}
                    onClick={() => setSearchOpen(false)}
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
