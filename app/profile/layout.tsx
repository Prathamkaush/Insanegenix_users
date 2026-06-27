"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, MapPin, ShoppingBag } from "lucide-react";
import { openAuthModal } from "@/lib/auth-modal";
import { getUserProfile, profileImageUrl } from "@/lib/profile";
import "./profile.css";

interface UserData {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isInvoicePath = /^\/profile\/orders\/[^/]+\/invoice/.test(pathname);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const skipLoginModalRef = useRef(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setUser(data.user || data);
    } catch (error) {
      console.error("Failed to load profile:", error);
      localStorage.removeItem("token");
      setUser(null);
      openAuthModal("login");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadProfile = () => {
      if (!localStorage.getItem("token")) {
        setUser(null);
        setLoading(false);
        if (!skipLoginModalRef.current) {
          openAuthModal("login");
        }
        return;
      }

      skipLoginModalRef.current = false;
      fetchUserProfile();
    };

    loadProfile();

    window.addEventListener("auth:changed", loadProfile);
    window.addEventListener("profile:updated", fetchUserProfile);
    return () => {
      window.removeEventListener("auth:changed", loadProfile);
      window.removeEventListener("profile:updated", fetchUserProfile);
    };
  }, [fetchUserProfile]);

  const handleLogout = () => {
    skipLoginModalRef.current = true;
    localStorage.removeItem("token");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    window.dispatchEvent(new Event("auth:changed"));
    router.push("/");
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="profile-error">
        Please login to view your profile.
        <button type="button" className="eg-btn" onClick={() => openAuthModal("login")}>
          <span>Login</span>
        </button>
      </div>
    );
  }

  if (isInvoicePath) {
    return <>{children}</>;
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileImageUrl(user.profileImage) ? (
              <img
                src={profileImageUrl(user.profileImage) || ""}
                alt={`${user.name || "User"} profile`}
              />
            ) : (
              user.name ? user.name.charAt(0).toUpperCase() : "U"
            )}
          </div>
          <div className="profile-info">
            <h2>{user.name || "Customer"}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="profile-nav">
          <Link
            href="/profile"
            className={`profile-nav-item ${pathname === "/profile" ? "active" : ""}`}
          >
            <User size={18} />
            <span>Profile Details</span>
          </Link>

          <Link
            href="/profile/addresses"
            className={`profile-nav-item ${pathname.startsWith("/profile/addresses") ? "active" : ""}`}
          >
            <MapPin size={18} />
            <span>Addresses</span>
          </Link>

          <Link
            href="/profile/orders"
            className={`profile-nav-item ${pathname.startsWith("/profile/orders") ? "active" : ""}`}
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </Link>
        </nav>

        <button className="profile-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <div className="profile-content">
        {children}
      </div>
    </div>
  );
}
