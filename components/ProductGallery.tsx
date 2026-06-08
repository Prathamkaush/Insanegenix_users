"use client";

import { useState } from "react";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="eg-product-details__thumb-tab mb-85 ig-product-gallery">
      <div className="eg-product-details__thumb-content w-img ig-product-gallery__main">
        <img src={activeImage} alt={title} />
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
