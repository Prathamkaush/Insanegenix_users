"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { storeCustomerSession } from "@/lib/auth";
import { getCart, getGuestCartItemCount, syncGuestCartToServer } from "@/lib/cart";

type StoredGoogleUser = {
  token: string;
  user?: unknown;
};

function decodeGoogleUser(value: string | null) {
  if (!value) return undefined;

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    return JSON.parse(window.atob(padded));
  } catch {
    return undefined;
  }
}

function GoogleAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Signing you in with Google...");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      setMessage(error || "Google sign in failed. Please try again.");
      window.setTimeout(() => router.replace("/"), 1800);
      return;
    }

    const session: StoredGoogleUser = {
      token,
      user: decodeGoogleUser(searchParams.get("user")),
    };

    const completeSignIn = async () => {
      const hadGuestCartItems = getGuestCartItemCount() > 0;
      let destination = hadGuestCartItems ? "/cart" : "/";

      try {
        storeCustomerSession(session);
        setMessage("Syncing your cart...");
        await syncGuestCartToServer();
        const cart = await getCart();
        if (cart.items.length > 0) destination = "/cart";
      } finally {
        router.replace(destination);
      }
    };

    completeSignIn();
  }, [router, searchParams]);

  return (
    <main className="ig-auth-callback">
      <div className="ig-auth-callback__panel">
        <span className="eg-loader-spin" />
        <p>{message}</p>
      </div>
    </main>
  );
}

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="ig-auth-callback">
          <div className="ig-auth-callback__panel">
            <span className="eg-loader-spin" />
            <p>Signing you in with Google...</p>
          </div>
        </main>
      }
    >
      <GoogleAuthCallbackContent />
    </Suspense>
  );
}
