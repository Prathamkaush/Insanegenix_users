"use client";

import { useState } from "react";
import { currency } from "@/lib/products";

const MIN_PRICE = 0;
const MAX_PRICE = 50000;
const STEP = 100;

export default function ShopPriceRange({
  initialMin,
  initialMax,
}: {
  initialMin?: string | number;
  initialMax?: string | number;
}) {
  const initialMinimum = Math.min(
    Math.max(Number(initialMin) || MIN_PRICE, MIN_PRICE),
    MAX_PRICE - STEP,
  );
  const initialMaximum = Math.max(
    Math.min(Number(initialMax) || MAX_PRICE, MAX_PRICE),
    initialMinimum + STEP,
  );
  const [minimum, setMinimum] = useState(initialMinimum);
  const [maximum, setMaximum] = useState(initialMaximum);
  const minimumPosition = ((minimum - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maximumPosition = ((maximum - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="ig-shop-price-range">
      <div className="ig-shop-price-range__values">
        <span>{currency(minimum)}</span>
        <span>{currency(maximum)}</span>
      </div>

      <div className="ig-shop-price-range__control">
        <div className="ig-shop-price-range__rail" />
        <div
          className="ig-shop-price-range__fill"
          style={{
            left: `${minimumPosition}%`,
            right: `${100 - maximumPosition}%`,
          }}
        />
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={minimum}
          aria-label="Minimum price"
          onChange={(event) =>
            setMinimum(Math.min(Number(event.target.value), maximum - STEP))
          }
        />
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={maximum}
          aria-label="Maximum price"
          onChange={(event) =>
            setMaximum(Math.max(Number(event.target.value), minimum + STEP))
          }
        />
      </div>

      <input
        type="hidden"
        name="minPrice"
        value={minimum === MIN_PRICE ? "" : minimum}
      />
      <input
        type="hidden"
        name="maxPrice"
        value={maximum === MAX_PRICE ? "" : maximum}
      />
    </div>
  );
}
