import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import AuthModal from "@/components/AuthModal";
import { getStorefrontSettings } from "@/lib/settings";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsaneGenix - Premium Sports Nutrition & Fitness Supplements",
  description:
    "Shop premium fitness supplements including whey protein, creatine, pre workout, EAA, gainers, and sports nutrition products at InsaneGenix.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStorefrontSettings();

  return (
    <html lang="en">
      <head>
        <meta
          name="facebook-domain-verification"
          content="nwrlh5x1efore355spni2ghyhgxogo"
        />
        <link rel="shortcut icon" type="image/x-icon" href="/assets/img/logo/favicon.svg" />
        <link rel="stylesheet" href="/assets/css/bootstrap.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/font-awesome-pro.css" />
        <link rel="stylesheet" href="/assets/css/spacing.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body>
        <Preloader />
        {settings.maintenanceMode ? (
          <main className="min-vh-100 d-flex align-items-center justify-content-center black-bg px-4 text-center">
            <div style={{ maxWidth: 560 }}>
              <img
                src="/assets/img/logo/footer-logo.png"
                alt="InsaneGenix"
                style={{ maxWidth: 220, marginBottom: 28 }}
              />
              <p className="text-danger fw-bold text-uppercase mb-3" style={{ letterSpacing: "0.22em" }}>
                Maintenance Mode
              </p>
              <h1 className="text-white fw-bold mb-3">We are updating the store.</h1>
              <p className="text-gray mb-4">
                The storefront is temporarily unavailable. For urgent support, contact us below.
              </p>
              <div className="d-flex flex-column gap-2 align-items-center">
                <a className="text-white fw-bold" href={`mailto:${settings.supportEmail}`}>
                  {settings.supportEmail}
                </a>
                <a className="text-white fw-bold" href={`tel:${settings.supportPhone.replace(/[^\d+]/g, "")}`}>
                  {settings.supportPhone}
                </a>
              </div>
            </div>
          </main>
        ) : (
          <>
            <Header />
            {children}
            <Footer settings={settings} />
          </>
        )}
        <AuthModal />
        <Script src="/assets/js/vendor/jquery.js" strategy="beforeInteractive" />
        <Script src="/assets/js/vendor/waypoints.js" strategy="afterInteractive" />
        <Script src="/assets/js/bootstrap-bundle.js" strategy="afterInteractive" />
        <Script src="/assets/js/swiper-bundle.js" strategy="afterInteractive" />
        <Script src="/assets/js/magnific-popup.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.appear.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.odometer.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/odometer.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/nice-select.js" strategy="afterInteractive" />
        <Script src="/assets/js/wow.js" strategy="afterInteractive" />
        <Script src="/assets/js/ajax-form.js" strategy="afterInteractive" />
        <Script src="/assets/js/parallax.js" strategy="afterInteractive" />
        <Script src="/assets/js/range-slider.js" strategy="afterInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
