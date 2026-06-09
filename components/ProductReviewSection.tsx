"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { openAuthModal } from "@/lib/auth-modal";
import { getCustomerToken } from "@/lib/cart";
import { getProductReviews, ProductReview, submitProductReview } from "@/lib/reviews";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 2.75 2.83 5.73 6.32.92-4.57 4.45 1.08 6.29L12 17.16l-5.66 2.98 1.08-6.29L2.85 9.4l6.32-.92L12 2.75Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Stars({
  rating,
  interactive = false,
  onSelect,
  onPreview,
  onLeave,
  large = false,
}: {
  rating: number;
  interactive?: boolean;
  onSelect?: (rating: number) => void;
  onPreview?: (rating: number) => void;
  onLeave?: () => void;
  large?: boolean;
}) {
  return (
    <div
      className={`ig-review-stars${interactive ? " is-interactive" : ""}${large ? " is-large" : ""}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= rating;

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              className={active ? "active" : ""}
              onClick={() => onSelect?.(star)}
              onMouseEnter={() => onPreview?.(star)}
              onFocus={() => onPreview?.(star)}
              onMouseLeave={onLeave}
              onBlur={onLeave}
              aria-label={`Rate ${star} out of 5`}
            >
              <StarIcon filled={active} />
            </button>
          );
        }

        return (
          <span key={star} className={active ? "active" : ""}>
            <StarIcon filled={active} />
          </span>
        );
      })}
    </div>
  );
}

export default function ProductReviewSection({
  productId,
  initialAverage,
  initialTotal,
}: {
  productId: number;
  initialAverage: number;
  initialTotal: number;
}) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [average, setAverage] = useState(initialAverage);
  const [total, setTotal] = useState(initialTotal);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const refreshReviews = async () => {
    const data = await getProductReviews(productId);
    setReviews(data.reviews || []);
    setAverage(Number(data.averageRating || 0));
    setTotal(Number(data.total || 0));
  };

  useEffect(() => {
    setMounted(true);
    setLoggedIn(Boolean(getCustomerToken()));
    refreshReviews();

    const syncAuth = () => setLoggedIn(Boolean(getCustomerToken()));
    window.addEventListener("auth:changed", syncAuth);

    return () => window.removeEventListener("auth:changed", syncAuth);
  }, [productId]);

  useEffect(() => {
    if (!modalOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };

    document.body.classList.add("ig-review-modal-lock");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("ig-review-modal-lock");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [modalOpen]);

  const distribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((review) => review.rating === stars).length;
      const percentage = total ? Math.round((count / total) * 100) : 0;
      return { stars, count, percentage };
    });
  }, [reviews, total]);

  const openReviewModal = () => {
    setError(null);
    setModalOpen(true);
  };

  const closeReviewModal = () => {
    if (!submitting) setModalOpen(false);
  };

  const openLogin = () => {
    setModalOpen(false);
    window.setTimeout(() => openAuthModal("login"), 0);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (rating < 1) {
      setError("Please select a star rating before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      await submitProductReview(productId, rating, comment.trim());
      setComment("");
      setRating(0);
      setHoverRating(0);
      setMessage("Thanks, your review was submitted and is awaiting admin approval.");
      setModalOpen(false);
      await refreshReviews();
    } catch (err) {
      const submitError = err instanceof Error ? err.message : "Unable to submit review";
      setError(submitError === "LOGIN_REQUIRED" ? "Please login to rate this product." : submitError);
    } finally {
      setSubmitting(false);
    }
  };

  const modal = modalOpen ? (
    <div className="ig-review-modal" role="dialog" aria-modal="true" aria-labelledby="ig-review-modal-title">
      <button
        type="button"
        className="ig-review-modal__backdrop"
        onClick={closeReviewModal}
        aria-label="Close review form"
      />
      <div className="ig-review-modal__panel">
        <button
          type="button"
          className="ig-review-modal__close"
          onClick={closeReviewModal}
          aria-label="Close review form"
        >
          <X size={20} />
        </button>

        <div className="ig-review-modal__heading">
          <span>Customer review</span>
          <h3 id="ig-review-modal-title">Review this product</h3>
          <p>Share your thoughts with other customers.</p>
        </div>

        {loggedIn ? (
          <form className="ig-review-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Your overall rating</legend>
              <div className="ig-review-rating-picker">
                <Stars
                  rating={hoverRating || rating}
                  interactive
                  large
                  onSelect={(selectedRating) => {
                    setRating(selectedRating);
                    setError(null);
                  }}
                  onPreview={setHoverRating}
                  onLeave={() => setHoverRating(0)}
                />
                <span>{rating ? `${rating} out of 5` : "Select a rating"}</span>
              </div>
            </fieldset>

            <label htmlFor="ig-review-comment">Write your review</label>
            <textarea
              id="ig-review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What should other customers know about this product?"
              rows={6}
              autoFocus
            />

            {error ? <p className="ig-review-message error">{error}</p> : null}

            <button type="submit" className="eg-btn ig-review-submit" disabled={submitting}>
              <span>{submitting ? "Submitting..." : "Submit review"}</span>
            </button>
            <p className="ig-review-moderation-note">
              Reviews are published after approval by our team.
            </p>
          </form>
        ) : (
          <div className="ig-review-login">
            <h4>Sign in to write a review</h4>
            <p>You need a customer account before rating this product.</p>
            <button type="button" className="eg-btn" onClick={openLogin}>
              <span>Login to continue</span>
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <section className="ig-product-info-card ig-product-review-section">
      <div className="ig-review-layout">
        <div className="ig-review-summary">
          <span className="ig-review-eyebrow">Ratings and reviews</span>
          <h3>Customer reviews</h3>

          <div className="ig-review-score">
            <strong>{total ? average.toFixed(1) : "0.0"}</strong>
            <div>
              <Stars rating={Math.round(average)} large />
              <p>{total ? `${average.toFixed(1)} out of 5` : "No ratings yet"}</p>
            </div>
          </div>

          <p className="ig-review-total">
            {total} customer rating{total === 1 ? "" : "s"}
          </p>

          <div className="ig-review-distribution">
            {distribution.map((row) => (
              <div className="ig-review-distribution__row" key={row.stars}>
                <span>{row.stars} star</span>
                <div
                  className="ig-review-distribution__track"
                  role="progressbar"
                  aria-label={`${row.stars} star reviews`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={row.percentage}
                >
                  <i style={{ width: `${row.percentage}%` }} />
                </div>
                <span>{row.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ig-review-cta">
          <h3>Review this product</h3>
          <p>Share your experience and help other customers make the right choice.</p>
          <button type="button" className="ig-review-write-button" onClick={openReviewModal}>
            Write a product review
          </button>
          {message ? <p className="ig-review-message success">{message}</p> : null}
        </div>
      </div>

      {reviews.length ? (
        <div className="ig-review-list-wrap">
          <div className="ig-review-list-heading">
            <h3>Recent reviews</h3>
            <span>{total} verified rating{total === 1 ? "" : "s"}</span>
          </div>
          <div className="ig-review-list">
            {reviews.slice(0, 4).map((review) => (
              <article key={review.id} className="ig-review-item">
                <div className="ig-review-item__top">
                  <div>
                    <strong>{review.user?.name || "Customer"}</strong>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                {review.comment ? <p>{review.comment}</p> : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {mounted && modal ? createPortal(modal, document.body) : null}
    </section>
  );
}
