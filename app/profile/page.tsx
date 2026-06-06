"use client";

import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/lib/profile";
import { Edit2, Save, X, Loader2 } from "lucide-react";
import "./profile-details.css";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

export default function ProfileDetailsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      const userData = data.user || data;
      setProfile(userData);
      setFormData({ name: userData.name || "", email: userData.email || "" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    if (profile) {
      setFormData({ name: profile.name, email: profile.email });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage({ type: "error", text: "Name and email are required" });
      return;
    }

    try {
      setUpdating(true);
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
      });
      await fetchProfile();
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="details-loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="details-error">Failed to load profile</div>;
  }

  return (
    <div className="profile-details">
      <div className="details-header">
        <h1>Profile Details</h1>
        {!editing && (
          <button className="btn-edit" onClick={handleEdit}>
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {editing ? (
        <form className="details-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={updating}
            >
              {updating ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
              disabled={updating}
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="details-view">
          <div className="detail-item">
            <label>Full Name</label>
            <p>{profile.name}</p>
          </div>

          <div className="detail-item">
            <label>Email Address</label>
            <p>{profile.email}</p>
          </div>

          {profile.phone && (
            <div className="detail-item">
              <label>Phone Number</label>
              <p>{profile.phone}</p>
            </div>
          )}

          <div className="detail-item">
            <label>Member Since</label>
            <p>
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-IN")
                : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
