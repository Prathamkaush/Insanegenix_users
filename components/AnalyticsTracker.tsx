"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "ig_visitor_id";
const SESSION_KEY = "ig_analytics_session";
const SESSION_TIMEOUT = 30 * 60 * 1000;

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function getVisitorId() {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const id = newId();
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}

function getSessionId() {
  const now = Date.now();
  try {
    const current = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null") as
      | { id: string; lastSeen: number }
      | null;
    if (current?.id && now - current.lastSeen < SESSION_TIMEOUT) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, lastSeen: now }));
      return current.id;
    }
  } catch {
    // Replace malformed storage with a fresh session.
  }
  const id = newId();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, lastSeen: now }));
  return id;
}

function externalReferrer() {
  if (!document.referrer) return "";
  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === window.location.origin ? "" : referrer.hostname;
  } catch {
    return "";
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl || !pathname || navigator.doNotTrack === "1") return;

    const params = new URLSearchParams(window.location.search);
    const hasGoogleClick = params.has("gclid");
    const hasMetaClick = params.has("fbclid");
    const referrer = externalReferrer();
    const source =
      params.get("utm_source") ||
      (hasGoogleClick ? "google" : hasMetaClick ? "facebook" : referrer || undefined);
    const medium = params.get("utm_medium") || (hasGoogleClick || hasMetaClick ? "cpc" : undefined);

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`${apiUrl.replace(/\/$/, "")}/analytics/page-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          path: pathname,
          referrer: referrer || undefined,
          source,
          medium,
          campaign: params.get("utm_campaign") || undefined,
        }),
        keepalive: true,
        signal: controller.signal,
      }).catch(() => undefined);
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [pathname]);

  return null;
}
