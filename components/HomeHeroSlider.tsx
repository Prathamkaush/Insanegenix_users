"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { homepageMediaUrl, HomepageMedia } from "@/lib/homepage";

type HeroSlide = {
  media?: HomepageMedia | null;
  mobileMedia?: HomepageMedia | null;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

declare global {
  interface Window {
    Swiper?: any;
  }
}

export default function HomeHeroSlider({ slides }: { slides: HeroSlide[] }) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const prevRef = useRef<HTMLDivElement | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  const fallbackSlides: HeroSlide[] = [
    {
      media: { id: 0, type: "IMAGE", url: "/assets/img/slider/slider-1.png" },
      mobileMedia: { id: 0, type: "IMAGE", url: "/assets/img/slider/slider-m-1.png" },
    },
    {
      media: { id: 1, type: "IMAGE", url: "/assets/img/slider/slider-2.png" },
      mobileMedia: { id: 1, type: "IMAGE", url: "/assets/img/slider/slider-m-1.png" },
    },
  ];

  const visibleSlides = slides.length
    ? slides
    : fallbackSlides;

  useEffect(() => {
    const sliderEl = sliderRef.current;
    if (!sliderEl || !window.Swiper) return;

    if ((sliderEl as any).swiper) {
      (sliderEl as any).swiper.destroy(true, true);
    }

    const swiper = new window.Swiper(sliderEl, {
      autoHeight: true,
      loop: visibleSlides.length > 1,
      speed: 500,
      autoplay:
        visibleSlides.length > 1
          ? {
              delay: 1500,
              disableOnInteraction: false,
            }
          : false,
      pagination: {
        el: paginationRef.current,
        clickable: true,
      },
      navigation: {
        nextEl: nextRef.current,
        prevEl: prevRef.current,
      },
      observer: true,
      observeParents: true,
    });

    return () => swiper.destroy(true, true);
  }, [visibleSlides.length]);

  return (
    <div ref={sliderRef} className="main-slider swiper  ig-home-hero-slider">
      <div className="swiper-wrapper">
        {visibleSlides.map((slide, index) => (
          <div className="swiper-slide ig-hero-slide" key={`${slide.media?.url || "fallback"}-${index}`}>
            <HeroMedia
              media={slide.media}
              mobileMedia={slide.mobileMedia}
              alt={slide.title || "InsaneGenix performance supplements hero"}
            />
            {slide.title || slide.subtitle || slide.ctaText ? (
              <div className="ig-hero-slide__content">
                {slide.subtitle ? <p>{slide.subtitle}</p> : null}
                {slide.title ? <h1>{slide.title}</h1> : null}
                {slide.ctaText ? (
                  <Link href={slide.ctaLink || "/shop"} className="ig-hero-slide__cta">
                    {slide.ctaText}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div ref={paginationRef} className="swiper-pagination"></div>
      <div ref={nextRef} className="swiper-button-next"></div>
      <div ref={prevRef} className="swiper-button-prev"></div>
    </div>
  );
}

function HeroMedia({
  media,
  mobileMedia,
  alt,
}: {
  media?: HomepageMedia | null;
  mobileMedia?: HomepageMedia | null;
  alt: string;
}) {
  const src = homepageMediaUrl(media);
  const mobileSrc = homepageMediaUrl(mobileMedia);

  if (media?.type === "VIDEO") {
    return (
      <video
        className="ig-hero-slide__media"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={{ width: "100%", height: "auto", objectFit: "contain" }}
      />
    );
  }

  return (
    <picture style={{ display: "block", width: "100%", height: "auto" }}>
      {mobileMedia?.type === "IMAGE" && mobileSrc ? (
        <source srcSet={mobileSrc} media="(max-width: 768px)" />
      ) : null}
      <img
        src={src || "/assets/img/slider/slider-1.png"}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
          objectPosition: "center",
          maxHeight: "none",
        }}
      />
    </picture>
  );
}
