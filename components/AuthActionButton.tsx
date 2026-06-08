"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthMode, openAuthModal } from "@/lib/auth-modal";
import Link from "next/link";
import "./AuthActionButton.css";

type AuthActionRenderState = {
  isLoggedIn: boolean;
  displayName: string;
};

type AuthActionChildren = ReactNode | ((state: AuthActionRenderState) => ReactNode);

function getStoredDisplayName() {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return "";

    const user = JSON.parse(rawUser);
    const fullName = String(user?.name || user?.firstName || user?.email || "").trim();
    if (!fullName) return "";

    if (fullName.includes("@")) return fullName.split("@")[0];
    return fullName.split(/\s+/)[0] || fullName;
  } catch {
    return "";
  }
}

export default function AuthActionButton({
  mode = "login",
  className,
  children,
  ariaLabel,
}: {
  mode?: AuthMode;
  className?: string;
  children: AuthActionChildren;
  ariaLabel?: string;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setDisplayName(token ? getStoredDisplayName() : "");

    const handleAuthChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsLoggedIn(!!updatedToken);
      setDisplayName(updatedToken ? getStoredDisplayName() : "");
      setIsDropdownOpen(false);
    };

    window.addEventListener("auth:changed", handleAuthChange);
    return () => window.removeEventListener("auth:changed", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    window.dispatchEvent(new Event("auth:changed"));
  };

  const openDropdown = () => setIsDropdownOpen(true);
  const closeDropdown = () => setIsDropdownOpen(false);
  const renderChildren = () =>
    typeof children === "function"
      ? children({ isLoggedIn, displayName })
      : children;

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => openAuthModal(mode)}
        aria-label={ariaLabel}
      >
        {renderChildren()}
      </button>
    );
  }

  return (
    <div
      className="ig-user-menu-wrapper"
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
      onFocus={openDropdown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closeDropdown();
        }
      }}
    >
      <button
        type="button"
        className={className}
        onClick={openDropdown}
        aria-label={ariaLabel}
        aria-expanded={isDropdownOpen}
      >
        {renderChildren()}
      </button>
      {isDropdownOpen && (
        <div className="ig-user-dropdown">
          <Link href="/profile" className="ig-user-dropdown-item" onClick={closeDropdown}>
            My Account
          </Link>
          <Link href="/profile/addresses" className="ig-user-dropdown-item" onClick={closeDropdown}>
            Addresses
          </Link>
          <Link href="/profile/orders" className="ig-user-dropdown-item" onClick={closeDropdown}>
            My Orders
          </Link>
          <button
            type="button"
            className="ig-user-dropdown-item logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
