"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthMode, openAuthModal } from "@/lib/auth-modal";
import Link from "next/link";
import "./AuthActionButton.css";

export default function AuthActionButton({
  mode = "login",
  className,
  children,
  ariaLabel,
}: {
  mode?: AuthMode;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleAuthChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsLoggedIn(!!updatedToken);
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

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => openAuthModal(mode)}
        aria-label={ariaLabel}
      >
        {children}
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
        {children}
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
