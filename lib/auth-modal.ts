"use client";

export type AuthMode = "login" | "register";

export function openAuthModal(mode: AuthMode = "login") {
  window.dispatchEvent(new CustomEvent("auth:open", { detail: { mode } }));
}
