"use client";

import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

type VerificationResult = {
  result:
    | "AUTHENTIC"
    | "ALREADY_VERIFIED"
    | "INVALID"
    | "BLOCKED"
    | "RECALLED"
    | "EXPIRED";
  message: string;
  product?: {
    id: number;
    title: string;
    slug?: string | null;
    img1?: string | null;
  };
  serialNumber?: string;
  batchNumber?: string;
  manufacturedAt?: string | null;
  expiresAt?: string | null;
  firstVerifiedAt?: string | null;
  previousVerificationCount?: number;
};

function formatCode(value: string) {
  const normalized = value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
  return normalized.match(/.{1,4}/g)?.join("-") || normalized;
}

function formatDate(value?: string | null) {
  if (!value) return "Not provided";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function productImage(image?: string | null) {
  if (!image) return "/assets/img/product/Whey.png";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `${API_URL}/uploads/products/${image}`;
}

export default function AuthenticityPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = code.replace(/[^A-Z0-9]/gi, "");
    if (normalized.length !== 12) {
      setError("Enter the complete 12-character scratch code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      const response = await fetch(`${API_URL}/authenticity/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Unable to verify this code.",
        );
      }
      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to verify this code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCode("");
    setError("");
    setResult(null);
  };

  const safeResult = result?.result === "AUTHENTIC";
  const warningResult = result?.result === "ALREADY_VERIFIED";

  return (
    <main className="fix ig-authenticity-page">
      <Breadcrumb title="Authenticity" />

      <section className="ig-authenticity-area">
        <div className="container">
          <div className="ig-authenticity-grid">
            <div className="ig-authenticity-intro">
              <span className="ig-authenticity-kicker">
                <ShieldCheck size={16} /> Product protection
              </span>
              <h1>Verify before you use.</h1>
              <p>
                Find the scratch panel on your InsaneGenix package and enter
                the unique 12-character code below.
              </p>

              <div className="ig-authenticity-steps">
                <div><strong>01</strong><span>Locate the security label</span></div>
                <div><strong>02</strong><span>Scratch to reveal the code</span></div>
                <div><strong>03</strong><span>Verify it before opening</span></div>
              </div>
            </div>

            <div className="ig-authenticity-checker">
              {!result ? (
                <>
                  <div className="ig-authenticity-checker__icon">
                    <BadgeCheck size={32} />
                  </div>
                  <h2>Check your product</h2>
                  <p>Codes contain letters and numbers in three groups.</p>

                  <form onSubmit={verify}>
                    <label htmlFor="authenticity-code">Scratch code</label>
                    <input
                      id="authenticity-code"
                      value={code}
                      onChange={(event) => {
                        setCode(formatCode(event.target.value));
                        setError("");
                      }}
                      placeholder="XXXX-XXXX-XXXX"
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={14}
                      autoFocus
                    />
                    {error ? <p className="ig-authenticity-error">{error}</p> : null}
                    <button
                      type="submit"
                      className="ig-primary-action"
                      disabled={loading || code.replace(/-/g, "").length !== 12}
                    >
                      <Search size={17} />
                      {loading ? "Verifying..." : "Verify authenticity"}
                    </button>
                  </form>

                  <small>
                    Each code is unique. We never ask for payment or personal
                    information during verification.
                  </small>
                </>
              ) : (
                <div
                  className={`ig-authenticity-result ig-authenticity-result--${result.result.toLowerCase()}`}
                >
                  <div className="ig-authenticity-result__icon">
                    {safeResult ? (
                      <BadgeCheck size={42} />
                    ) : (
                      <AlertTriangle size={42} />
                    )}
                  </div>
                  <span>
                    {safeResult
                      ? "Authentic product"
                      : warningResult
                        ? "Previously verified"
                        : result.result.replaceAll("_", " ")}
                  </span>
                  <h2>{result.message}</h2>

                  {result.product ? (
                    <div className="ig-authenticity-product">
                      <img
                        src={productImage(result.product.img1)}
                        alt={result.product.title}
                      />
                      <div>
                        <strong>{result.product.title}</strong>
                        <p>Serial: {result.serialNumber}</p>
                        <p>Batch: {result.batchNumber}</p>
                      </div>
                    </div>
                  ) : null}

                  {result.product ? (
                    <dl className="ig-authenticity-meta">
                      <div>
                        <dt>Manufactured</dt>
                        <dd>{formatDate(result.manufacturedAt)}</dd>
                      </div>
                      <div>
                        <dt>Expiry</dt>
                        <dd>{formatDate(result.expiresAt)}</dd>
                      </div>
                      <div>
                        <dt>First checked</dt>
                        <dd>{formatDate(result.firstVerifiedAt)}</dd>
                      </div>
                      <div>
                        <dt>Previous checks</dt>
                        <dd>{result.previousVerificationCount || 0}</dd>
                      </div>
                    </dl>
                  ) : null}

                  {warningResult ? (
                    <p className="ig-authenticity-warning">
                      If you did not verify this code previously, do not use the
                      product. Contact InsaneGenix support with the serial and
                      purchase details.
                    </p>
                  ) : null}

                  <button type="button" onClick={reset}>
                    <RefreshCw size={16} /> Check another code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
