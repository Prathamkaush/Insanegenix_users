"use client";

import { FormEvent, useEffect, useState } from "react";
import AuthActionButton from "@/components/AuthActionButton";
import { getCustomerToken } from "@/lib/cart";
import { getProductReviews, ProductReview, submitProductReview } from "@/lib/reviews";

function Stars({ rating, interactive = false, onSelect }: { rating: number; interactive?: boolean; onSelect?: (rating: number) => void }) {
  return (
    <div className="ig-review-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= rating;
        if (interactive) {
          return (
            <button key={star} type="button" className={active ? "active" : ""} onClick={() => onSelect?.(star)}>
              <img src="/assets/img/icon/rating-star.svg" alt="" />
            </button>
          );
        }

        return (
          <span key={star} className={active ? "active" : ""}>
            <img src="/assets/img/icon/rating-star.svg" alt="" />
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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const refreshReviews = async () => {
    const data = await getProductReviews(productId);
    setReviews(data.reviews || []);
    setAverage(Number(data.averageRating || 0));
    setTotal(Number(data.total || 0));
  };

  useEffect(() => {
    setLoggedIn(Boolean(getCustomerToken()));
    refreshReviews();
  }, [productId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      setSubmitting(true);
      await submitProductReview(productId, rating, comment.trim());
      setComment("");
      setMessage("Thanks, your rating has been submitted.");
      await refreshReviews();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to submit review";
      setError(message === "LOGIN_REQUIRED" ? "Please login to rate this product." : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="ig-product-info-card ig-product-review-section">
      <div className="ig-review-section__header">
        <div>
          <h3>Customer Ratings</h3>
          <p>{total ? `${average.toFixed(1)} average from ${total} review${total === 1 ? "" : "s"}` : "No ratings yet"}</p>
        </div>
        <Stars rating={Math.round(average)} />
      </div>

      {loggedIn ? (
        <form className="ig-review-form" onSubmit={handleSubmit}>
          <label>Rate this product</label>
          <Stars rating={rating} interactive onSelect={setRating} />
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your experience"
            rows={4}
          />
          {message ? <p className="ig-review-message success">{message}</p> : null}
          {error ? <p className="ig-review-message error">{error}</p> : null}
          <button type="submit" className="eg-btn" disabled={submitting}>
            <span>{submitting ? "Submitting..." : "Submit Rating"}</span>
          </button>
        </form>
      ) : (
        <div className="ig-review-login">
          <p>Login to rate this product.</p>
          <AuthActionButton className="eg-btn">
            <span>Login</span>
          </AuthActionButton>
        </div>
      )}

      {reviews.length ? (
        <div className="ig-review-list">
          {reviews.slice(0, 4).map((review) => (
            <article key={review.id} className="ig-review-item">
              <div className="ig-review-item__top">
                <strong>{review.user?.name || "Customer"}</strong>
                <Stars rating={review.rating} />
              </div>
              {review.comment ? <p>{review.comment}</p> : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
