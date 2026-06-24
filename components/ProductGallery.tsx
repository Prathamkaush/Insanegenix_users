"use client";

import { useEffect, useState } from "react";

type GalleryMedia = {
  type: "image" | "video";
  src: string;
};

export default function ProductGallery({
  images,
  video,
  title,
}: {
  images: string[];
  video?: string;
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const media: GalleryMedia[] = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(video ? [{ type: "video" as const, src: video }] : []),
  ];
  const activeMedia = media[activeIndex] || media[0];

  useEffect(() => {
    if (media.length < 2 || isPaused) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % media.length);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, media.length, isPaused]);

  useEffect(() => {
    if (activeIndex >= media.length) setActiveIndex(0);
  }, [activeIndex, media.length]);

  return (
    <div
      className="eg-product-details__thumb-tab mb-85 ig-product-gallery"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <div className="eg-product-details__thumb-content w-img ig-product-gallery__main">
        {activeMedia?.type === "video" ? (
          <video key={activeMedia.src} src={activeMedia.src} controls playsInline />
        ) : (
          <img key={activeMedia?.src} src={activeMedia?.src} alt={`${title} view ${activeIndex + 1}`} />
        )}
      </div>
      {media.length > 1 ? (
        <div className="eg-product-details__thumb-nav tp-tab mt-30">
          <div className="nav nav-tabs d-flex justify-content-between" role="tablist">
            {media.map((item, index) => (
              <button
                key={`${item.type}-${item.src}`}
                className={`nav-link ${index === activeIndex ? "active" : ""}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${title} ${item.type} ${index + 1}`}
                aria-selected={index === activeIndex}
              >
                {item.type === "video" ? (
                  <video src={item.src} muted playsInline />
                ) : (
                  <img src={item.src} alt={`${title} view ${index + 1}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
