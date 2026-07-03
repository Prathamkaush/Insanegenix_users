"use client";

import { useEffect, useState, type PointerEvent } from "react";

type GalleryMedia = {
  type: "image" | "video";
  src: string;
};

type ZoomPosition = {
  active: boolean;
  x: number;
  y: number;
};

export default function ProductGallery({
  images,
  video,
  title,
  productId,
  variantMedia,
}: {
  images: string[];
  video?: string;
  title: string;
  productId?: number;
  variantMedia?: Record<number, { images: string[]; video?: string }>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>();
  const [zoomPosition, setZoomPosition] = useState<ZoomPosition>({
    active: false,
    x: 50,
    y: 50,
  });
  const selectedMedia = selectedVariantId ? variantMedia?.[selectedVariantId] : undefined;
  const visibleImages = selectedMedia?.images?.length ? selectedMedia.images : images;
  const visibleVideo = selectedMedia?.video || video;
  const media: GalleryMedia[] = [
    ...visibleImages.map((src) => ({ type: "image" as const, src })),
    ...(visibleVideo ? [{ type: "video" as const, src: visibleVideo }] : []),
  ];
  const activeMedia = media[activeIndex] || media[0];
  const hasMultipleItems = media.length > 1;
  const canZoom = activeMedia?.type === "image" && Boolean(activeMedia.src);
  const zoomBackgroundPosition = `${zoomPosition.x}% ${zoomPosition.y}%`;
  const zoomImageUrl = activeMedia?.src ? `url("${activeMedia.src}")` : undefined;

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + media.length) % media.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % media.length);
  };

  const updateZoomPosition = (event: PointerEvent<HTMLDivElement>) => {
    if (!canZoom) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(((event.clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((event.clientY - rect.top) / rect.height) * 100, 0), 100);

    setZoomPosition({ active: true, x, y });
  };

  const startZoom = (event: PointerEvent<HTMLDivElement>) => {
    if (!canZoom) return;
    setIsPaused(true);
    updateZoomPosition(event);
  };

  const stopZoom = () => {
    setZoomPosition((current) => ({ ...current, active: false }));
  };

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

  useEffect(() => {
    stopZoom();
  }, [activeMedia?.src, activeMedia?.type]);

  useEffect(() => {
    const handleVariantChange = (event: Event) => {
      const detail = (event as CustomEvent<{ productId?: number; variantId?: number }>).detail;
      if (productId && detail?.productId !== productId) return;
      setSelectedVariantId(detail?.variantId);
      setActiveIndex(0);
    };

    window.addEventListener("product:variant-change", handleVariantChange);
    return () => window.removeEventListener("product:variant-change", handleVariantChange);
  }, [productId]);

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
      <div
        className={`eg-product-details__thumb-content w-img ig-product-gallery__main ${
          canZoom ? "ig-product-gallery__main--zoomable" : ""
        }`}
        onPointerEnter={startZoom}
        onPointerDown={startZoom}
        onPointerMove={updateZoomPosition}
        onPointerLeave={stopZoom}
        onPointerUp={stopZoom}
        onPointerCancel={stopZoom}
      >
        {activeMedia?.type === "video" ? (
          <video key={activeMedia.src} src={activeMedia.src} controls playsInline />
        ) : (
          <img key={activeMedia?.src} src={activeMedia?.src} alt={`${title} view ${activeIndex + 1}`} />
        )}
        {canZoom && zoomPosition.active ? (
          <>
            <span
              className="ig-product-gallery__zoom-lens"
              style={{ left: `${zoomPosition.x}%`, top: `${zoomPosition.y}%` }}
              aria-hidden="true"
            />
            <div
              className="ig-product-gallery__zoom-pane"
              style={{
                backgroundImage: zoomImageUrl,
                backgroundPosition: zoomBackgroundPosition,
              }}
              aria-hidden="true"
            />
          </>
        ) : null}
      </div>

      {hasMultipleItems ? (
        <div className="ig-product-gallery__thumbs-wrap">
          <button
            className="ig-product-gallery__thumb-arrow"
            type="button"
            onClick={showPrevious}
            aria-label="Show previous product thumbnail"
          >
            <i className="fas fa-chevron-left" aria-hidden="true" />
          </button>
          <div className="ig-product-gallery__thumbs" role="tablist" aria-label={`${title} gallery thumbnails`}>
            {media.map((item, index) => (
              <button
                key={`${item.type}-${item.src}`}
                className={index === activeIndex ? "active" : ""}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${title} ${item.type} ${index + 1}`}
                aria-selected={index === activeIndex}
                role="tab"
              >
                {item.type === "video" ? (
                  <video src={item.src} muted playsInline />
                ) : (
                  <img src={item.src} alt={`${title} thumbnail ${index + 1}`} />
                )}
              </button>
            ))}
          </div>
          <button
            className="ig-product-gallery__thumb-arrow"
            type="button"
            onClick={showNext}
            aria-label="Show next product thumbnail"
          >
            <i className="fas fa-chevron-right" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
