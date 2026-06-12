"use client";

import { useEffect, useRef } from "react";
import HomeProductCard from "@/components/ProductCard";
import { Product } from "@/lib/products";

type HomeProductSectionProps = {
  id: string;
  title: string;
  products: Product[];
};

export default function HomeProductSection({
  id,
  title,
  products,
}: HomeProductSectionProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || products.length < 2) return;

    let swiper: any;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const initialize = () => {
      if (cancelled) return;

      if (!window.Swiper) {
        retryTimer = setTimeout(initialize, 100);
        return;
      }

      if ((carousel as any).swiper) {
        (carousel as any).swiper.destroy(true, true);
      }

      swiper = new window.Swiper(carousel, {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 500,
        loop: products.length > 4,
        allowTouchMove: true,
        simulateTouch: true,
        touchStartPreventDefault: false,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: nextRef.current,
          prevEl: prevRef.current,
        },
        observer: true,
        observeParents: true,
        breakpoints: {
          576: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
          1400: { slidesPerView: 3 },
        },
      });
    };

    initialize();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (swiper) swiper.destroy(true, true);
    };
  }, [products.length]);

  return (
    <section className={`product-area-2 ig-home-product-section ig-home-product-section--${id}`}>
      <div className="eg-product-2">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-lg-7">
              <div className="eg-section mb-40">
                <span className="ig-home-product-section__eyebrow">Shop InsaneGenix</span>
                <h2 className="eg-section__title title-white">{title}</h2>
              </div>
            </div>

            {products.length > 1 ? (
              <div className="col-lg-5">
                <div className="eg-product-2__arrow d-flex justify-content-end mb-30">
                  <button
                    ref={prevRef}
                    type="button"
                    className="eg-product-2__prev ig-home-product-prev"
                    aria-label={`Previous ${title}`}
                  >
                    <span>{arrowIcon("previous")}</span>
                  </button>
                  <button
                    ref={nextRef}
                    type="button"
                    className="eg-product-2__next ig-home-product-next"
                    aria-label={`Next ${title}`}
                  >
                    <span>{arrowIcon("next")}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {products.length ? (
          <div ref={carouselRef} className="swiper eg-product-2__active ig-home-product-carousel">
            <div className="swiper-wrapper">
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="swiper-slide ig-home-product-slide">
                  <HomeProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="ig-home-product-section__empty">
              Products marked as {title.toLowerCase()} will appear here.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function arrowIcon(direction: "previous" | "next") {
  const isPrevious = direction === "previous";

  return (
    <svg width="39" height="16" viewBox="0 0 39 16" fill="currentColor" aria-hidden="true">
      <path
        d={
          isPrevious
            ? "M0.292893 8.70711C-0.0976311 8.31659 -0.0976311 7.68342 0.292893 7.2929L6.65685 0.928936C7.04738 0.538411 7.68054 0.538411 8.07107 0.928936C8.46159 1.31946 8.46159 1.95262 8.07107 2.34315L2.41421 8L8.07107 13.6569C8.46159 14.0474 8.46159 14.6805 8.07107 15.0711C7.68054 15.4616 7.04738 15.4616 6.65685 15.0711L0.292893 8.70711ZM39 9L1 9L1 7L39 7L39 9Z"
            : "M38.7071 8.70711C39.0976 8.31659 39.0976 7.68342 38.7071 7.2929L32.3431 0.928935C31.9526 0.538411 31.3195 0.538411 30.9289 0.928935C30.5384 1.31946 30.5384 1.95263 30.9289 2.34315L36.5858 8L30.9289 13.6569C30.5384 14.0474 30.5384 14.6805 30.9289 15.0711C31.3195 15.4616 31.9526 15.4616 32.3431 15.0711L38.7071 8.70711ZM0 9L38 9L38 7L0 7L0 9Z"
        }
      />
    </svg>
  );
}
