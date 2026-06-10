"use client";

import { useEffect, useState } from "react";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeImage = images[activeIndex] || images[0];

  useEffect(() => {
    if (images.length < 2 || isPaused) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, images.length, isPaused]);

  useEffect(() => {
    if (activeIndex >= images.length) setActiveIndex(0);
  }, [activeIndex, images.length]);

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
        <img key={activeImage} src={activeImage} alt={`${title} view ${activeIndex + 1}`} />
      </div>
      {images.length > 1 ? (
        <div className="eg-product-details__thumb-nav tp-tab mt-30">
          <div className="nav nav-tabs d-flex justify-content-between" role="tablist">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={image}
                className={`nav-link ${index === activeIndex ? "active" : ""}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${title} image ${index + 1}`}
                aria-selected={index === activeIndex}
              >
                <img src={image} alt={`${title} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
