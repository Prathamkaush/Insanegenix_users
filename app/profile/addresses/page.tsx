"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Check, Loader2 } from "lucide-react";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  UserAddress,
  CreateAddressInput,
} from "@/lib/profile";
import "./addresses.css";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState<CreateAddressInput>({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(Array.isArray(data) ? data : data.addresses || []);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load addresses" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (address: UserAddress) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditing(address.id);
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, street, city, state, pincode } = formData;

    if (!name.trim() || !phone.trim() || !street.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    if (phone.length < 10) {
      setMessage({ type: "error", text: "Phone number must be at least 10 digits" });
      return;
    }

    try {
      setSubmitting(true);
      if (editing) {
        await updateAddress(editing, formData);
        setMessage({ type: "success", text: "Address updated successfully!" });
      } else {
        await createAddress(formData);
        setMessage({ type: "success", text: "Address added successfully!" });
      }
      await fetchAddresses();
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save address",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      setSubmitting(true);
      await deleteAddress(id);
      setMessage({ type: "success", text: "Address deleted successfully!" });
      await fetchAddresses();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to delete address",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      setSubmitting(true);
      await setDefaultAddress(id);
      setMessage({ type: "success", text: "Default address updated!" });
      await fetchAddresses();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to set default address",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="addresses-loading">Loading addresses...</div>;
  }

  return (
    <div className="addresses-container">
      <div className="addresses-header">
        <h1>My Addresses</h1>
        {!showForm && (
          <button className="btn-add-address ig-primary-action" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <form className="address-form" onSubmit={handleSubmit}>
          <h2>{editing ? "Edit Address" : "Add New Address"}</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
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
                onChange={handleChange}
                placeholder="10-digit phone number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input
              id="street"
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="House No., Building Name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary ig-primary-action" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editing ? "Update Address" : "Add Address"}</span>
              )}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="no-addresses">
          <MapPin size={48} />
          <p>No addresses yet. Add your first address!</p>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div key={address.id} className={`address-card ${address.isDefault ? "default" : ""}`}>
              {address.isDefault && (
                <div className="default-badge">
                  <Check size={14} />
                  <span>Default</span>
                </div>
              )}

              <div className="address-content">
                <h3>{address.name}</h3>
                <p className="phone">{address.phone}</p>
                <p className="address-text">
                  {address.street}, {address.city}, {address.state} {address.pincode}
                </p>
              </div>

              <div className="address-actions">
                {!address.isDefault && (
                  <button
                    className="btn-set-default"
                    onClick={() => handleSetDefault(address.id)}
                    disabled={submitting}
                    title="Set as default address"
                  >
                    Set Default
                  </button>
                )}
                <button
                  className="btn-icon-edit"
                  onClick={() => handleEdit(address)}
                  disabled={submitting}
                  title="Edit address"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="btn-icon-delete"
                  onClick={() => handleDelete(address.id)}
                  disabled={submitting}
                  title="Delete address"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
