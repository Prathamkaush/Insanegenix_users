"use client";

import { useEffect, useRef, useState } from "react";
import { getUserProfile, profileImageUrl, updateUserProfile } from "@/lib/profile";
import { Camera, Edit2, Loader2, Save, User, X } from "lucide-react";
import "./profile-details.css";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  createdAt?: string;
}

const emptyForm = { name: "", email: "", phone: "" };

export default function ProfileDetailsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setProfileData = (userData: UserProfile) => {
    setProfile(userData);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
    });
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfileData(data.user || data);
    } catch {
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleEdit = () => {
    if (profile) setProfileData(profile);
    setImageFile(null);
    setImagePreview(null);
    setMessage(null);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setMessage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage({ type: "error", text: "Choose a JPEG, PNG, or WebP image" });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Profile image must be 5 MB or smaller" });
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name || !email || !phone) {
      setMessage({ type: "error", text: "Name, email, and phone number are required" });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({ type: "error", text: "Enter a valid email address" });
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setMessage({ type: "error", text: "Phone number must contain exactly 10 digits" });
      return;
    }

    try {
      setUpdating(true);
      const result = await updateUserProfile({ name, email, phone, image: imageFile });
      setProfileData(result.user);
      window.dispatchEvent(new Event("profile:updated"));
      setEditing(false);
      setImageFile(null);
      setImagePreview(null);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      window.setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="details-loading">Loading profile...</div>;
  if (!profile) return <div className="details-error">Failed to load profile</div>;

  const savedImage = profileImageUrl(profile.profileImage);
  const displayedImage = imagePreview || savedImage;

  return (
    <div className="profile-details">
      <div className="details-header">
        <h1>Profile Details</h1>
        {!editing && (
          <button className="btn-edit ig-primary-action" onClick={handleEdit}>
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {message && <div className={`message message-${message.type}`}>{message.text}</div>}

      {editing ? (
        <form className="details-form" onSubmit={handleSubmit} noValidate>
          <div className="profile-image-editor">
            <div className="profile-image-preview">
              {displayedImage ? (
                <img src={displayedImage} alt={`${profile.name || "User"} profile`} />
              ) : (
                <User size={38} />
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                className="profile-image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
              <button
                type="button"
                className="btn-image"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={18} />
                <span>{displayedImage ? "Change Photo" : "Add Photo"}</span>
              </button>
              <p>Optional. JPEG, PNG, or WebP up to 5 MB.</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              maxLength={100}
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

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                }))
              }
              placeholder="Enter your 10-digit phone number"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary ig-primary-action" disabled={updating}>
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
            <button type="button" className="btn-secondary" onClick={handleCancel} disabled={updating}>
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="details-view">
          <div className="detail-identity">
            <div className="detail-avatar">
              {savedImage ? (
                <img src={savedImage} alt={`${profile.name || "User"} profile`} />
              ) : (
                <span>{profile.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>
            <div className="detail-identity__copy">
              <span>Account Profile</span>
              <h2>{profile.name || "Customer"}</h2>
              <p>{profile.email}</p>
            </div>
          </div>

          <div className="detail-item">
            <label>Full Name</label>
            <p>{profile.name}</p>
          </div>
          <div className="detail-item">
            <label>Email Address</label>
            <p>{profile.email}</p>
          </div>
          <div className="detail-item">
            <label>Phone Number</label>
            <p>{profile.phone || "Not added yet"}</p>
          </div>
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
