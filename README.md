# InsaneGenix Customer Frontend

The customer storefront for **InsaneGenix**, a sports nutrition and fitness supplement brand. Built with Next.js App Router, React, and TypeScript, it supports product discovery, guest carts, customer accounts, wishlists, checkout, order history, and product authenticity verification.

This repository contains the frontend. Product data, authentication, payments, orders, uploaded media, and store configuration come from a separately running backend API.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Available commands](#available-commands)
- [Project structure](#project-structure)
- [Application routes](#application-routes)
- [Backend integration](#backend-integration)
- [Authentication and browser state](#authentication-and-browser-state)
- [Cart and checkout flows](#cart-and-checkout-flows)
- [Content, media, and caching](#content-media-and-caching)
- [Styling and shared components](#styling-and-shared-components)
- [Analytics and metadata](#analytics-and-metadata)
- [Production deployment](#production-deployment)
- [Verification checklist](#verification-checklist)
- [Troubleshooting](#troubleshooting)
- [Repository notes](#repository-notes)

## Features

| Area | Functionality |
| --- | --- |
| Homepage | API-driven homepage sections, hero media, product sections, and customer reviews |
| Product catalog | Pagination, search, category and price filters, sorting, stock, dietary type, tags, and minimum rating parameters |
| Product details | Image/video gallery, flavour and weight variants, size selection, pricing, nutrition information, and reviews |
| Shopping cart | Local guest cart, authenticated server cart, quantity updates, removal, and guest cart synchronization |
| Customer authentication | Email/password login, registration, password reset with code verification, and Google sign-in callback |
| Wishlist | Authenticated wishlist with product/variant support |
| Checkout | Saved or new shipping addresses, coupon validation, GST breakdown, shipping preview, cash on delivery, and Razorpay |
| Customer account | Profile editing, profile image upload, address management, and default address selection |
| Orders | Paginated order history, individual order details, and printable invoices |
| Authenticity | Verification of a 12-character product scratch code, including batch and verification details when returned by the API |
| Content and support | Blog catalog and articles, contact form, about page, and policy pages |
| Store operations | API-controlled support details and maintenance screen |
| Analytics | Backend page-view tracking and a Meta Pixel integration |

## Technology stack

Versions below reflect `package.json`; the lockfile records resolved dependency versions.

| Technology | Version / usage |
| --- | --- |
| Next.js | `16.0.8`, App Router |
| React / React DOM | `19.2.1` |
| TypeScript | `^5`, strict mode |
| Lucide React | `^0.561.0`, icons |
| ESLint | `^9`, with `eslint-config-next` `16.0.8` |
| Styling | Global and route/component CSS, bundled Bootstrap and template assets |
| Browser libraries | Bundled jQuery, Swiper, Magnific Popup, WOW, Odometer, and other template scripts |
| Payments | Razorpay Checkout SDK, loaded on demand |
| Package manager | npm, with `package-lock.json` |

## Getting started

### Prerequisites

- Node.js **20.9.0 or newer**, as required by the installed Next.js version.
- npm.
- A compatible backend API. The default API address is `http://localhost:3030`.
- Backend product/category data and accessible media for a populated storefront.

The frontend has no database setup, backend startup command, or seed script in this repository. Start and configure the backend separately.

### 1. Install dependencies

Run from the repository root:

```sh
npm ci
```

### 2. Configure the API

Create `.env.local` in the repository root:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3030
```

Use your backend's actual base URL. Most requests append paths directly, so omit a trailing slash. Include a path prefix only if your backend is actually hosted under that prefix.

`.env.local` is ignored by Git. No `.env.example` is currently included.

### 3. Start the backend

Ensure the API is reachable at the configured address and allows browser requests from the frontend origin, typically `http://localhost:3000` during development. Browser requests use JSON and, for protected operations, an `Authorization` header.

### 4. Start the frontend

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To use a different frontend port:

```sh
npm run dev -- --port 3001
```

Update backend CORS and authentication redirect configuration to match the chosen origin.

## Environment configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3030` in most API clients | Base URL used for backend requests and uploaded media URLs |

`AnalyticsTracker` is an exception to the fallback: it skips backend analytics requests when `NEXT_PUBLIC_API_URL` is unset.

The same API address must be reachable from both the Next.js server and customers' browsers. A container-only hostname may work for server rendering but fail for browser requests. In production, `localhost` points to the machine making the request, so configure a public API address.

Next.js includes public environment values in browser bundles. Set `NEXT_PUBLIC_API_URL` before building and rebuild after changing it. Restart the development server after environment changes.

Razorpay secrets and Google OAuth credentials belong in the backend configuration. This frontend receives the Razorpay public checkout key from the create-order response; it does not define a separate payment-key environment variable.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies using the committed lockfile |
| `npm run dev` | Run the Next.js development server |
| `npm run build` | Generate a production build |
| `npm start` | Serve an existing production build |
| `npm run lint` | Run the configured `eslint` script |
| `npx tsc --noEmit` | Run TypeScript checking without emitting JavaScript |

**Current tooling limitation:** `package.json` defines a lint command, but this checkout does not include an ESLint configuration file. ESLint 9 expects a flat configuration such as `eslint.config.mjs`; configure it before relying on `npm run lint` as a passing check.

No automated test script or test framework is currently configured.

## Project structure

```text
customer-frontend/
|-- app/                         # App Router pages, layouts, and route styles
|   |-- auth/google/callback/    # Completes backend Google sign-in
|   |-- authenticity/            # Product scratch-code verification
|   |-- blogs/                   # Blog listing and [slug] article pages
|   |-- cart/                    # Guest and authenticated cart
|   |-- checkout/                # Checkout and success page
|   |-- product/[slug]/          # Product detail pages
|   |-- profile/                 # Profile, addresses, orders, and invoices
|   |-- shop/                    # Filtered product catalog
|   |-- wishlist/                # Customer wishlist
|   |-- globals.css              # Application-wide styles
|   |-- layout.tsx               # Shared shell, scripts, settings, and metadata
|   `-- page.tsx                 # Homepage
|-- components/                  # Shared UI and interactive components
|-- lib/                         # API clients, types, cache, and utilities
|-- public/
|   |-- assets/                  # CSS, scripts, fonts, images, and videos
|   |-- sitemap.xml              # Static sitemap
|   `-- googledb61450c114032d2.html # Google verification file
|-- next.config.ts               # Next.js and remote image configuration
|-- tsconfig.json                # Strict TypeScript and @/* path alias
|-- package.json                 # Dependencies and npm scripts
`-- package-lock.json            # Resolved dependency versions
```

Imports beginning with `@/` resolve relative to the repository root.

## Application routes

| Route | Purpose / access |
| --- | --- |
| `/` | Store homepage |
| `/shop` | Product listing with URL-based filters |
| `/product/[slug]` | Product information and purchase controls |
| `/cart` | Guest or authenticated cart |
| `/wishlist` | Authenticated customer's wishlist |
| `/checkout` | Requires customer login to proceed |
| `/checkout/success?id=<orderId>` | Confirmation and order details |
| `/auth/google/callback` | Receives backend Google sign-in result |
| `/profile` | Customer profile; prompts for login when needed |
| `/profile/addresses` | Customer address book |
| `/profile/orders` | Customer order history |
| `/profile/orders/[id]` | Customer order details |
| `/profile/orders/[id]/invoice` | Printable invoice; triggers the browser print dialog after loading |
| `/blogs` | Blog listing and search |
| `/blogs/[slug]` | Blog article |
| `/authenticity` | Public product scratch-code verification |
| `/about` | Brand information |
| `/contact` | Contact details, map, and contact form |
| `/privacy-policy` | Privacy policy |
| `/terms-and-conditions` | Terms and conditions |
| `/shipping-and-delivery` | Shipping policy |
| `/payment-option` | Payment information |
| `/cancellation-and-refund` | Cancellation and refund policy |
| `/cancelation-and-refund` | Additional route using the alternate spelling |

Authentication is presented through the shared `AuthModal`, rather than a dedicated login page.

Example catalog URLs:

```text
/shop?search=creatine
/shop?categoryId=1&minPrice=500&maxPrice=3000
/shop?dietaryType=VEGAN&minRating=4&page=1
```

`lib/products.ts` defines the supported request parameters: `page`, `limit`, `categoryId`, `minPrice`, `maxPrice`, `sort`, `stock`, `search`, `dietaryType`, `tag`, and `minRating`. The backend determines filtering and sorting semantics.

## Backend integration

Requests go directly to the configured API using `fetch`. This repository does not contain App Router API handlers or a frontend API proxy.

The following inventory is derived from frontend callers. It describes the integration expected by this application, rather than a complete backend API specification.

| Domain | Expected endpoints | Main caller |
| --- | --- | --- |
| Products | `GET /products`, `GET /products/:slug`, `GET /categories` | `lib/products.ts`, `components/Header.tsx` |
| Homepage | `GET /homepage`, `GET /media?ids=...` | `lib/homepage.ts` |
| Store settings | `GET /settings` | `lib/settings.ts`, contact page |
| Blogs | `GET /blogs`, `GET /blogs/:slug` | `lib/blogs.ts` |
| Authentication | `POST /auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/verify-reset-code`, `/auth/reset-password` | `lib/auth.ts` |
| Google sign-in | Navigation to `/auth/google` | `lib/auth.ts` |
| Cart | `GET /cart`, `POST /cart/add`, `PUT /cart/:id`, `DELETE /cart/:id` | `lib/cart.ts` |
| Wishlist | `GET /wishlist`, `POST /wishlist/toggle`, `GET /wishlist/check` | `lib/wishlist.ts` |
| Profile | `GET /users/profile`, `PATCH /users/profile` | `lib/profile.ts` |
| Addresses | `GET /addresses`, `POST /addresses`, `PUT /addresses/:id`, `PUT /addresses/:id/default`, `DELETE /addresses/:id` | `lib/profile.ts` |
| Orders | `POST /orders/preview`, `POST /orders`, `GET /orders/my`, `GET /orders/my/:id` | Checkout, `lib/profile.ts` |
| Payments | `POST /payments/razorpay/create-order`, `POST /payments/razorpay/verify` | Checkout |
| Reviews | `GET /reviews/product/:productId`, `GET /reviews/latest`, `POST /reviews` | `lib/reviews.ts` |
| Authenticity | `POST /authenticity/verify` | Authenticity page |
| Contact | `POST /contact` | Contact page |
| Analytics | `POST /analytics/page-view` | `components/AnalyticsTracker.tsx` |

Protected calls generally send `Authorization: Bearer <token>`. Profile updates use `FormData` for `name`, `email`, `phone`, and an optional image; the browser supplies the multipart content type.

Important response expectations include:

- Authentication returns a `token` and optionally a `user` object.
- Cart loading returns an object with an `items` array.
- Product catalog responses may be arrays or supported wrapped shapes; pagination uses `total`, `page`, and `pages` when present.
- Order preview pricing uses `itemsSubtotal`, `gst`, `shipping`, `couponDiscount`, and `payable`.
- Razorpay order creation returns `key`, `amount`, and `razorpayOrderId`.
- Successful COD order creation and payment verification return an `orderId` used by the confirmation page.

## Authentication and browser state

`lib/auth.ts` stores a successful session in local storage and writes a JavaScript-accessible `token` cookie with a 30-day maximum age and `SameSite=Lax`.

| Storage | Key | Purpose |
| --- | --- | --- |
| Local storage | `token`, `user_token` | Session token written by normal sign-in |
| Local storage | `user` | Serialized user information when available |
| Local storage | `ig_guest_cart` | Guest cart items |
| Local storage | `ig_visitor_id` | Analytics visitor identifier |
| Session storage | `ig_analytics_session` | Analytics session identifier and last activity time |
| Cookie | `token` | Additional token source for supported helpers |

The shared token reader also recognizes `access_token` and `auth_token` in local storage or supported cookies. Some account code specifically reads the local-storage `token` key, so custom authentication integrations should use `storeCustomerSession` to preserve the expected session shape.

The Google callback expects `token`, an optional base64url-encoded JSON `user`, or an `error` query parameter. It stores the session, attempts guest cart synchronization, and redirects to the cart when appropriate. Configure the backend's post-authentication redirect to the frontend's `/auth/google/callback` route; the provider's OAuth callback is managed by the backend.

Shared UI updates use browser events:

| Event | Purpose |
| --- | --- |
| `auth:open` | Open the authentication modal |
| `auth:changed` | Refresh session-dependent UI |
| `cart:updated` | Refresh cart contents and header counts |
| `wishlist:updated` | Refresh wishlist UI |
| `profile:updated` | Refresh displayed customer information |
| `product:variant-change` | Coordinate variant selection and the product gallery |

Account access prompts are implemented on the client. The backend must enforce authentication and ownership for protected data and operations.

## Cart and checkout flows

### Guest and authenticated carts

1. Guests add product, variant, and size selections to `ig_guest_cart` in their browser.
2. Signed-in customers use the backend cart.
3. Guest cart synchronization posts items to `/cart/add` after authentication or when authenticated cart operations run.
4. Successfully synchronized items are removed locally; failed items remain available for a later attempt.
5. If an authenticated add-to-cart request returns an unauthorized response, the cart helper clears the invalid session and falls back to adding the product locally.

Guest carts are specific to the browser and origin where they were created. Checkout requires login.

### Pricing and address selection

Checkout loads the cart and saved addresses, selecting the default address or first available address. Customers can add an address during checkout. The form checks for required address fields, a six-digit pincode, and a ten-digit mobile number.

The frontend requests `/orders/preview` to obtain totals for the selected address, payment method, and coupon. Coupon input is trimmed and converted to uppercase. Display utilities format prices in INR using the Indian locale, and cart helpers calculate item GST for display.

### Cash on delivery

Checkout posts the address, `COD` payment method, and optional coupon to `/orders`. On success, it updates the cart UI and navigates to `/checkout/success?id=<orderId>`.

### Online payments

1. Request a Razorpay order from `/payments/razorpay/create-order`.
2. Load `https://checkout.razorpay.com/v1/checkout.js` if needed.
3. Open Razorpay Checkout with the returned key, amount, and order reference.
4. Submit the returned payment identifiers and signature, address information, and coupon to `/payments/razorpay/verify`.
5. Navigate to the confirmation page after backend verification succeeds.

The backend is responsible for validating authoritative pricing, payment signatures, stock, coupons, and order creation. Use the backend's payment test configuration when verifying this flow.

## Content, media, and caching

### Data and fallback behavior

- Store settings supply support email, phone, address, and `maintenanceMode`. If settings cannot be loaded, `lib/settings.ts` supplies defaults.
- When maintenance mode is enabled, the root layout displays a maintenance screen with support details in place of the storefront.
- Homepage configuration is fetched from `/homepage`; referenced hero and video-banner media are resolved through `/media`.
- Product and blog detail helpers return `null` when content cannot be fetched. Catalog request failures can propagate to the calling page.
- Bundled product images are fallbacks and presentation assets; they do not provide a mock catalog or a substitute backend.

### Media paths

- Absolute HTTP(S) media URLs are generally used directly.
- Root-relative product and blog paths are used directly against the frontend origin.
- Recognized bundled product filenames resolve to `/assets/img/product/<filename>`.
- Other bare product filenames resolve to `<API_URL>/uploads/products/<filename>`.
- Bare blog image filenames resolve to `<API_URL>/uploads/blogs/<filename>`.
- Homepage media beginning with `/uploads` is prefixed with the API base URL.

`next.config.ts` permits remote images from HTTP `localhost:3030` and HTTPS hosts. If using Next.js image optimization with another HTTP backend host or port, update `images.remotePatterns` accordingly.

### Cache behavior

| Data | Current strategy |
| --- | --- |
| Product catalog, categories, product details | 60-second in-memory cache and fetch revalidation |
| Blog catalog and articles | 60-second fetch revalidation |
| Latest reviews | 30-second fetch revalidation |
| Customer profile | Two-minute in-memory cache keyed by token |
| Order list and details | 30-second in-memory cache keyed by token and request parameters |
| Settings, homepage/media, product reviews | Requests configured with `cache: "no-store"` |

`lib/cache.ts` implements an expiring `Map` and prefix-based invalidation. This cache belongs to the JavaScript runtime using it; it is not a shared persistent cache across server instances or browser sessions. Consider these lifetimes when checking recently updated content.

## Styling and shared components

The root layout loads bundled styles and browser scripts from `public/assets`. Application overrides live in `app/globals.css`, with additional CSS beside checkout, profile, address, order, and reusable button components.

Useful entry points for changes:

| Change | Start here |
| --- | --- |
| Navigation, search, cart/account indicators | `components/Header.tsx` |
| Footer and support information | `components/Footer.tsx`, `lib/settings.ts` |
| Login, registration, password reset | `components/AuthModal.tsx`, `lib/auth.ts` |
| Product cards and prices | `components/ProductCard.tsx`, `components/ShopProductCard.tsx`, `lib/products.ts` |
| Product gallery and variant selection | `components/ProductGallery.tsx`, `components/ProductVariantPurchase.tsx` |
| Product reviews | `components/ProductReviewSection.tsx`, `lib/reviews.ts` |
| Homepage sections and hero | `app/page.tsx`, `components/HomeHeroSlider.tsx`, `lib/homepage.ts` |
| Cart behavior | `lib/cart.ts`, `app/cart/page.tsx` |
| Checkout and payments | `app/checkout/page.tsx` |
| Profile, addresses, and orders | `lib/profile.ts`, `app/profile/` |
| Shared policy layout | `components/PolicyPage.tsx` |
| Social link configuration | `lib/social-links.ts` |

When modifying interactive template elements, check both React components and the scripts under `public/assets/js`, since both contribute to browser behavior.

## Analytics and metadata

`components/AnalyticsTracker.tsx` sends page-view events after pathname changes, using a persistent visitor ID and a session ID with a 30-minute inactivity timeout. Events include the path, external referrer, and available attribution fields such as `utm_source`, `utm_medium`, and `utm_campaign`; Google and Meta click identifiers also influence source attribution. This tracker skips requests when the browser reports `navigator.doNotTrack === "1"`.

The root layout separately loads a Meta Pixel and sends a `PageView`. Its pixel ID and Facebook domain-verification value are embedded in `app/layout.tsx`, rather than supplied through environment variables. The backend tracker's Do Not Track check does not control this separate integration.

Site-wide title and description are defined in `app/layout.tsx`. Product and blog models include metadata fields for content-specific metadata. The sitemap and Google verification file are static assets under `public`; review them when changing domains or published routes.

## Production deployment

Deploy to infrastructure capable of running a Next.js server. The current configuration uses the standard Next.js build/start workflow and does not configure static export or standalone output.

1. Install dependencies with `npm ci`.
2. Set `NEXT_PUBLIC_API_URL` to the production HTTPS API base URL before building.
3. Ensure the API and media are reachable from the build/runtime environment and public browsers.
4. Build and start:

   ```sh
   npm run build
   npm start
   ```

5. Configure backend CORS for the public storefront origin and Google sign-in redirects for the deployed callback route.
6. Configure Razorpay on the backend and verify the end-to-end payment flow.
7. Review store settings, maintenance mode, support details, metadata, analytics identifiers, sitemap, and domain verification assets.

To select a listening port explicitly:

```sh
npm start -- --port 3000
```

Server-rendered pages fetch backend data. API availability matters during rendering and may matter during the build depending on which routes Next.js prerenders. Some helpers provide fallbacks; a successful page shell alone does not verify the full integration.

## Verification checklist

For code changes, run the relevant checks in an environment with dependencies installed:

```sh
npx tsc --noEmit
npm run build
```

Configure ESLint before adding `npm run lint` to required checks. No automated test suite is currently supplied, so manually verify the relevant flows against a compatible backend:

- Homepage content, media, navigation, and responsive layout.
- Catalog search, filters, pagination, product details, and variant selection.
- Guest cart add/update/remove behavior and synchronization after sign-in.
- Registration, login, logout, password reset, and Google sign-in.
- Wishlist and authenticated review submission.
- Profile edits, image upload, address edits, and default address selection.
- Checkout totals, coupon acceptance/rejection, COD, Razorpay success/failure/dismissal.
- Order confirmation, history, detail pages, and invoice printing.
- Valid and invalid authenticity codes, contact submission, and policy links.
- Maintenance mode and support details supplied by the API.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Homepage loads but products are missing | API reachability, backend data, `/products` response, and server logs; local images do not create catalog entries |
| Browser requests fail while server content loads | API URL must be browser-accessible; check CORS, allowed headers, mixed HTTP/HTTPS content, and browser network errors |
| Deployed browser tries `localhost:3030` | Set the production public API URL before building, then rebuild and redeploy |
| Environment changes have no effect | Restart development or rebuild production; public values are bundled |
| Product images are broken | Inspect the API image value, upload path, root-relative URL behavior, file existence, and remote image patterns |
| Account pages repeatedly ask for login | Check the local-storage `token`, token expiry, `/users/profile` response, and backend authentication configuration |
| Guest cart items remain after sign-in | Inspect failed `/cart/add` requests; unsuccessful items are intentionally retained locally |
| Google login returns to an error | Check backend OAuth setup, frontend redirect URL, and the callback's expected `token` or `error` parameter |
| Razorpay does not open or verification fails | Check SDK loading, create-order response fields, backend credentials, payment mode, and verification response |
| Content appears stale | Account for documented cache lifetimes; confirm the backend response has changed |
| Entire storefront shows maintenance | Inspect `maintenanceMode` from `/settings` |
| `npm run lint` reports no configuration | Add an ESLint 9 flat configuration; dependencies and a script alone do not configure ESLint |
| Invoice opens a print dialog automatically | This is the implemented behavior once invoice data finishes loading |

## Repository notes

- Package name: `insanegenix-customer-frontend`.
- Package version: `0.1.1`.
- The package is marked `private: true`.
- Backend source, database migrations, seed commands, and payment secrets are outside this repository.
- No license file is currently included; the repository does not declare an open-source license.
