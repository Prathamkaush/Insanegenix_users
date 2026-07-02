"use client";

import { useEffect } from "react";

export default function HomeReviewCarouselInit({ count }: { count: number }) {
  useEffect(() => {
    if (count < 2) return;

    const carousel = document.querySelector(".eg-testimonial-2__active");
    if (!carousel) return;

    let swiper: any;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const initialize = () => {
      if (cancelled) return;

      const Swiper = (window as any).Swiper;
      if (!Swiper) {
        retryTimer = setTimeout(initialize, 100);
        return;
      }

      if ((carousel as any).swiper) {
        (carousel as any).swiper.destroy(true, true);
      }

      const desktopQuery = window.matchMedia("(min-width: 768px)");
      const visibleSlides = desktopQuery.matches ? 2 : 1;
      const canLoop = count > visibleSlides + 1;
      const canAutoplay = count > visibleSlides;

      swiper = new Swiper(carousel, {
        slidesPerView: 1,
        spaceBetween: 18,
        speed: 650,
        loop: canLoop,
        rewind: !canLoop,
        allowTouchMove: true,
        simulateTouch: true,
        touchStartPreventDefault: false,
        autoplay: canAutoplay
          ? {
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
          : false,
        navigation: {
          nextEl: ".eg-testimonial-2__next",
          prevEl: ".eg-testimonial-2__prev",
        },
        observer: true,
        observeParents: true,
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1200: {
            slidesPerView: 2,
            spaceBetween: 28,
          },
        },
      });
    };

    initialize();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (swiper) swiper.destroy(true, true);
    };
  }, [count]);

  return null;
}
