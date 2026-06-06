"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, MapPin, ShoppingBag } from "lucide-react";
import { getUserProfile } from "@/lib/profile";
import "./profile.css";

interface UserData {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchUserProfile();
  }, [router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setUser(data.user || data);
    } catch (error) {
      console.error("Failed to load profile:", error);
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
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
    return <div className="profile-error">Failed to load profile</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="profile-info">
            <h2>{user.name || "Customer"}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="profile-nav">
          <Link
            href="/profile"
            className={`profile-nav-item ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            <User size={18} />
            <span>Profile Details</span>
          </Link>

          <Link
            href="/profile/addresses"
            className={`profile-nav-item ${activeTab === "addresses" ? "active" : ""}`}
            onClick={() => setActiveTab("addresses")}
          >
            <MapPin size={18} />
            <span>Addresses</span>
          </Link>

          <Link
            href="/profile/orders"
            className={`profile-nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
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
