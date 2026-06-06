import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import AuthModal from "@/components/AuthModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsaneGenix - Premium Sports Nutrition & Fitness Supplements",
  description:
    "Shop premium fitness supplements including whey protein, creatine, pre workout, EAA, gainers, and sports nutrition products at InsaneGenix.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
        <Header />
        {children}
        <Footer />
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
