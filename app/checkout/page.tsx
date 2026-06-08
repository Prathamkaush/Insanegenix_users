"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Plus, Loader2, CreditCard, Shield, Info, X, Check, Award } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import {
  cartItemGstRate,
  cartItemGstTotal,
  cartItemPayableTotal,
  cartItemSubtotal,
  getCart,
  getCustomerToken,
  CartItem,
} from "@/lib/cart";
import { currency, productImage } from "@/lib/products";
import { getAddresses, createAddress, UserAddress } from "@/lib/profile";
import { openAuthModal } from "@/lib/auth-modal";
import "./checkout.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

interface PricingBreakdown {
  itemsSubtotal: number;
  gst: number;
  shipping: number;
  couponDiscount: number;
  payable: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState("");
  
  // App States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");
  
  // Coupon states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Preview & Loading States
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Pricing Breakdown (defaults)
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  // Resolve client side hydration
  useEffect(() => {
    setIsClient(true);
    setToken(getCustomerToken());
  }, []);

  const loadCheckoutData = async (authToken: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Load cart
      const cartData = await getCart();
      const items = cartData.items || [];
      setCartItems(items);

      if (items.length === 0) {
        setLoading(false);
        return;
      }

      // Load addresses
      const addrList = await getAddresses();
      setAddresses(addrList);

      // Select default address or first address
      if (addrList.length > 0) {
        const defaultAddr = addrList.find((a: UserAddress) => a.isDefault) || addrList[0];
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (err: any) {
      console.error("Failed to load checkout data:", err);
      if (err.message === "LOGIN_REQUIRED") {
        setLoginRequired(true);
      } else {
        setErrorMessage("An error occurred while loading checkout details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCheckoutData(token);
    } else if (isClient) {
      setLoginRequired(true);
      setLoading(false);
    }

    const handleAuthChange = () => {
      const updatedToken = getCustomerToken();
      setToken(updatedToken);
      if (updatedToken) {
        setLoginRequired(false);
        loadCheckoutData(updatedToken);
      } else {
        setLoginRequired(true);
        setCartItems([]);
        setAddresses([]);
        setSelectedAddressId(null);
      }
    };

    window.addEventListener("auth:changed", handleAuthChange);
    return () => window.removeEventListener("auth:changed", handleAuthChange);
  }, [token, isClient]);

  // Update order preview pricing dynamically
  const fetchOrderPreview = async () => {
    if (!token || !selectedAddressId || cartItems.length === 0) return;

    try {
      setPreviewLoading(true);
      setErrorMessage(null);

      const res = await fetch(`${API_URL}/orders/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod,
          couponCode: appliedCouponCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to preview pricing");
      }

      if (data.pricing) {
        setPricing({
          itemsSubtotal: Number(data.pricing.itemsSubtotal),
          gst: Number(data.pricing.gst || 0),
          shipping: Number(data.pricing.shipping),
          couponDiscount: Number(data.pricing.couponDiscount),
          payable: Number(data.pricing.payable),
        });
      }
    } catch (err: any) {
      console.error("Preview error:", err);
      setErrorMessage(err.message || "Failed to update shipping rates for this address.");
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAddressId) {
      fetchOrderPreview();
    }
  }, [selectedAddressId, paymentMethod, appliedCouponCode, token]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + cartItemSubtotal(item), 0);
  }, [cartItems]);
  const cartGst = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + cartItemGstTotal(item), 0);
  }, [cartItems]);
  const cartSubtotalWithGst = cartSubtotal + cartGst;

  // Apply Coupon Action
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError(null);
    setCouponSuccess(null);
    setPreviewLoading(true);

    try {
      // We validate by querying the preview endpoint directly with the coupon code.
      // If it throws an error, the coupon is invalid. If it succeeds, we apply it.
      const res = await fetch(`${API_URL}/orders/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId: selectedAddressId || undefined,
          paymentMethod,
          couponCode: couponInput.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Coupon is invalid or expired");
      }

      setAppliedCouponCode(couponInput.trim().toUpperCase());
      setCouponSuccess(`Coupon "${couponInput.trim().toUpperCase()}" applied successfully!`);
      if (data.pricing) {
        setPricing({
          itemsSubtotal: Number(data.pricing.itemsSubtotal),
          gst: Number(data.pricing.gst || 0),
          shipping: Number(data.pricing.shipping),
          couponDiscount: Number(data.pricing.couponDiscount),
          payable: Number(data.pricing.payable),
        });
      }
    } catch (err: any) {
      setCouponError(err.message || "Coupon is invalid or expired");
    } finally {
      setPreviewLoading(false);
    }
  };

  // Remove Coupon Action
  const handleRemoveCoupon = () => {
    setAppliedCouponCode(null);
    setCouponInput("");
    setCouponSuccess(null);
    setCouponError(null);
  };

  // Add Address Action
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);

    // Basic Validation
    const { name, phone, street, city, state, pincode } = newAddress;
    if (!name || !phone || !street || !city || !state || !pincode) {
      setAddressError("All address fields are required");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setAddressError("Please enter a valid 6-digit pincode");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setAddressError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setAddressLoading(true);
      const newAddr = await createAddress(newAddress);
      
      // Update list and select the new one
      const updatedList = await getAddresses();
      setAddresses(updatedList);
      setSelectedAddressId(newAddr.id || updatedList[updatedList.length - 1]?.id);
      
      // Close modal
      setShowAddressModal(false);
      setNewAddress({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
    } catch (err: any) {
      setAddressError(err.message || "Failed to create address. Please try again.");
    } finally {
      setAddressLoading(false);
    }
  };

  // Dynamic Razorpay SDK injector
  const loadRazorpaySDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Place Order Submit Action
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setErrorMessage("Please select or add a shipping address.");
      return;
    }

    setSubmitLoading(true);
    setErrorMessage(null);

    try {
      if (paymentMethod === "COD") {
        // Cash on Delivery
        const res = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            addressId: selectedAddressId,
            paymentMethod: "COD",
            couponCode: appliedCouponCode || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to place COD order");
        }

        // Fire cart count updates
        window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: 0 } }));
        router.push(`/checkout/success?id=${data.orderId}`);
      } else {
        // Online Payment (Razorpay Flow)
        const finalPayable = pricing ? pricing.payable : cartSubtotalWithGst;

        // 1. Create Razorpay order on backend
        const orderRes = await fetch(`${API_URL}/payments/razorpay/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: finalPayable }),
        });

        const rzpData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(rzpData.message || "Failed to initiate online transaction");
        }

        // 2. Load Razorpay script
        const sdkLoaded = await loadRazorpaySDK();
        if (!sdkLoaded) {
          throw new Error("Failed to load Razorpay payment gateway client. Check your network.");
        }

        // Selected address details for razorpay checkout details pre-fill
        const activeAddr = addresses.find(a => a.id === selectedAddressId);

        // 3. Open Razorpay checkout modal
        const options = {
          key: rzpData.key,
          amount: rzpData.amount,
          currency: "INR",
          name: "InsaneGenix",
          description: "Premium Supplements Order Payment",
          image: "/assets/img/logo/favicon.svg",
          order_id: rzpData.razorpayOrderId,
          handler: async function (response: any) {
            try {
              setSubmitLoading(true);
              // 4. Verify Razorpay signature and place order
              const verifyRes = await fetch(`${API_URL}/payments/razorpay/verify`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  addressId: selectedAddressId,
                  address: activeAddr ? {
                    name: activeAddr.name,
                    phone: activeAddr.phone,
                    street: activeAddr.street,
                    city: activeAddr.city,
                    state: activeAddr.state,
                    pincode: activeAddr.pincode,
                  } : undefined,
                  couponCode: appliedCouponCode || undefined,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) {
                throw new Error(verifyData.message || "Payment verification failed. Please contact support.");
              }

              window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: 0 } }));
              router.push(`/checkout/success?id=${verifyData.orderId}`);
            } catch (verifyErr: any) {
              setErrorMessage(verifyErr.message || "Failed to confirm payment verification.");
              setSubmitLoading(false);
            }
          },
          prefill: {
            name: activeAddr?.name || "",
            contact: activeAddr?.phone || "",
          },
          theme: {
            color: "#e50914",
          },
          modal: {
            ondismiss: function () {
              setSubmitLoading(false);
            }
          }
        };

        const paymentWindow = new (window as any).Razorpay(options);
        paymentWindow.open();
      }
    } catch (err: any) {
      console.error("Order submission failure:", err);
      setErrorMessage(err.message || "An unexpected error occurred during payment processing.");
      setSubmitLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <main className="fix">
      <Breadcrumb title="Checkout" />
      
      <section className="checkout-area pt-120 pb-120 bg-black">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <Loader2 className="animate-spin text-danger mx-auto mb-3" size={48} />
              <h3 className="text-white">Loading checkout details...</h3>
            </div>
          ) : loginRequired ? (
            <div className="eg-review__box text-center border-white-10 bg-dark-box p-5 max-w-600 mx-auto">
              <Shield className="text-danger mx-auto mb-4" size={54} />
              <h3 className="text-white">Authentication Required</h3>
              <p className="text-gray mb-4">Please log in to your account to complete checkout and manage shipping address details.</p>
              <button 
                type="button" 
                onClick={() => openAuthModal("login")} 
                className="eg-btn btn-danger"
              >
                <span>Login / Sign Up</span>
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="eg-review__box text-center border-white-10 bg-dark-box p-5 max-w-600 mx-auto">
              <Info className="text-danger mx-auto mb-4" size={54} />
              <h3 className="text-white">Your Cart is Empty</h3>
              <p className="text-gray mb-4">You must have items in your cart to proceed with checkout.</p>
              <Link href="/shop" className="eg-btn">
                <span>Continue Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="ig-checkout-container">
              
              {/* Left Column: Form Steps */}
              <div>
                {/* 1. Shipping Address Section */}
                <div className="ig-checkout-section">
                  <h3 className="ig-checkout-title d-flex align-items-center justify-content-between">
                    <span>1. Shipping Address</span>
                    <button 
                      type="button"
                      onClick={() => setShowAddressModal(true)}
                      className="btn btn-sm d-flex align-items-center text-danger p-0"
                      style={{ fontSize: "14px", fontWeight: "700" }}
                    >
                      <Plus size={16} className="mr-1" /> Add Address
                    </button>
                  </h3>

                  {addresses.length === 0 ? (
                    <div 
                      onClick={() => setShowAddressModal(true)}
                      className="ig-add-address-card"
                    >
                      <MapPin size={28} />
                      <span>No saved addresses found. Click here to add one.</span>
                    </div>
                  ) : (
                    <div className="ig-address-grid">
                      {addresses.map((address) => (
                        <div 
                          key={address.id}
                          className={`ig-address-card ${selectedAddressId === address.id ? "active" : ""}`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          {address.isDefault && <span className="badge">Default</span>}
                          <h4>{address.name}</h4>
                          <p>
                            {address.street}, {address.city}, {address.state} - {address.pincode}
                          </p>
                          <span className="phone">Phone: {address.phone}</span>
                          {selectedAddressId === address.id && (
                            <div className="position-absolute" style={{ bottom: "12px", right: "12px" }}>
                              <Check size={18} className="text-danger" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Payment Method Section */}
                <div className="ig-checkout-section">
                  <h3 className="ig-checkout-title">2. Choose Payment Method</h3>
                  
                  <div className="ig-payment-methods">
                    {/* COD Option */}
                    <div 
                      className={`ig-payment-option ${paymentMethod === "COD" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("COD")}
                    >
                      <input 
                        type="radio" 
                        id="payment-cod" 
                        name="payment" 
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                      />
                      <div>
                        <label htmlFor="payment-cod">Cash on Delivery (COD)</label>
                        <span>Pay in cash upon physical shipment arrival.</span>
                      </div>
                    </div>

                    {/* Online Payment Option */}
                    <div 
                      className={`ig-payment-option ${paymentMethod === "RAZORPAY" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("RAZORPAY")}
                    >
                      <input 
                        type="radio" 
                        id="payment-online" 
                        name="payment" 
                        checked={paymentMethod === "RAZORPAY"}
                        onChange={() => setPaymentMethod("RAZORPAY")}
                      />
                      <div>
                        <label htmlFor="payment-online">Pay Online (UPI / Card / NetBanking)</label>
                        <span>Secure checkout via Razorpay online.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger bg-danger-10 border-danger text-white p-3 mb-4 rounded-0 d-flex align-items-center">
                    <Info size={20} className="mr-2 text-danger flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary Sticky Box */}
              <aside>
                <div className="ig-checkout-summary-box">
                  <h3>Order Summary</h3>
                  
                  {/* Cart Items List */}
                  <div className="ig-checkout-items">
                    {cartItems.map((item) => (
                      <div className="ig-checkout-item-mini" key={item.id}>
                        <img src={productImage(item.product)} alt={item.product.title} />
                        <div className="ig-checkout-item-mini__info">
                          <h5>{item.product.title}</h5>
                          <p>
                            Qty: {item.quantity} 
                            {item.variant?.flavour && ` | ${item.variant.flavour}`}
                            {item.variant?.weightLabel && ` | ${item.variant.weightLabel}`}
                          </p>
                          <p className="ig-checkout-item-mini__gst">
                            GST: {currency(cartItemGstTotal(item))}
                            {cartItemGstRate(item) > 0 && ` (${cartItemGstRate(item)}%)`}
                          </p>
                        </div>
                        <div className="ig-checkout-item-mini__price">
                          <span>{currency(cartItemPayableTotal(item))}</span>
                          <small>incl. GST</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Form */}
                  {!appliedCouponCode ? (
                    <form onSubmit={handleApplyCoupon} className="ig-coupon-form">
                      <input 
                        type="text" 
                        placeholder="Promo Code" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                      />
                      <button 
                        type="submit" 
                        className="eg-btn"
                        disabled={previewLoading || !couponInput.trim()}
                      >
                        {previewLoading ? <Loader2 className="animate-spin text-white" size={14} /> : "Apply"}
                      </button>
                    </form>
                  ) : (
                    <div className="d-flex align-items-center justify-content-between bg-dark-pill p-2 px-3 border-white-5 mb-3">
                      <div className="d-flex align-items-center text-success">
                        <Award size={16} className="mr-2" />
                        <span style={{ fontSize: "12px", fontWeight: "700" }}>{appliedCouponCode} APPLIED</span>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-gray border-0 bg-transparent p-0 hover-white"
                        type="button"
                        aria-label="Remove coupon code"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {couponError && <p className="ig-coupon-status error">{couponError}</p>}
                  {couponSuccess && <p className="ig-coupon-status success">{couponSuccess}</p>}

                  {/* Price Breakdown */}
                  <div className="ig-price-breakdown">
                    <div className="ig-price-row">
                      <span>Items Subtotal</span>
                      <span>{currency(cartSubtotal)}</span>
                    </div>

                    <div className="ig-price-row">
                      <span>GST</span>
                      <span>{currency(pricing ? pricing.gst : cartGst)}</span>
                    </div>

                    <div className="ig-price-row">
                      <span>Shipping Fee</span>
                      {selectedAddressId ? (
                        pricing ? (
                          pricing.shipping === 0 ? <span className="text-success">FREE</span> : <span>{currency(pricing.shipping)}</span>
                        ) : (
                          <Loader2 className="animate-spin text-gray" size={14} />
                        )
                      ) : (
                        <span>Calculated at next step</span>
                      )}
                    </div>

                    {pricing && pricing.couponDiscount > 0 && (
                      <div className="ig-price-row discount">
                        <span>Coupon Discount</span>
                        <span>-{currency(pricing.couponDiscount)}</span>
                      </div>
                    )}

                    <div className="ig-price-row total">
                      <span>Payable Amount</span>
                      {pricing ? (
                        <span>{currency(pricing.payable)}</span>
                      ) : (
                        <span>{currency(cartSubtotalWithGst)}</span>
                      )}
                    </div>
                  </div>

                  {/* CTA Place Order Button */}
                  <button 
                    type="button" 
                    onClick={handlePlaceOrder}
                    disabled={submitLoading || previewLoading || cartItems.length === 0 || !selectedAddressId}
                    className="ig-add-cart-btn w-100 py-3"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        <span>Processing Order...</span>
                      </>
                    ) : paymentMethod === "COD" ? (
                      <span>Place COD Order</span>
                    ) : (
                      <span>Pay Now & Confirm</span>
                    )}
                  </button>

                  <div className="text-center mt-3 text-gray" style={{ fontSize: "11px" }}>
                    <Shield size={12} className="inline mr-1" /> 256-Bit SSL Encrypted checkout.
                  </div>
                </div>
              </aside>

            </div>
          )}
        </div>
      </section>

      {/* 3. Address Addition Modal */}
      {showAddressModal && (
        <div className="ig-address-modal" role="dialog" aria-modal="true" aria-labelledby="add-address-title">
          <button 
            type="button" 
            className="ig-address-modal__backdrop" 
            onClick={() => setShowAddressModal(false)}
            aria-label="Close add address modal"
          />
          <div className="ig-address-modal__panel">
            <button 
              type="button" 
              className="ig-address-modal__close" 
              onClick={() => setShowAddressModal(false)}
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>

            <h3 id="add-address-title" className="text-white font-weight-800 uppercase mb-3" style={{ fontSize: "20px" }}>
              Add Delivery Address
            </h3>

            <form onSubmit={handleAddAddress} className="ig-address-form">
              <div className="ig-form-group">
                <label htmlFor="addr-name">Full Name *</label>
                <input 
                  type="text" 
                  id="addr-name"
                  placeholder="e.g. John Doe"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  required
                />
              </div>

              <div className="ig-form-group">
                <label htmlFor="addr-phone">Phone Number *</label>
                <input 
                  type="tel" 
                  id="addr-phone"
                  placeholder="10-digit number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  required
                />
              </div>

              <div className="ig-form-group full-width">
                <label htmlFor="addr-street">Street Address *</label>
                <input 
                  type="text" 
                  id="addr-street"
                  placeholder="Flat/House No., Colony, Landmark"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  required
                />
              </div>

              <div className="ig-form-group">
                <label htmlFor="addr-city">City *</label>
                <input 
                  type="text" 
                  id="addr-city"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
              </div>

              <div className="ig-form-group">
                <label htmlFor="addr-state">State *</label>
                <input 
                  type="text" 
                  id="addr-state"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                />
              </div>

              <div className="ig-form-group full-width">
                <label htmlFor="addr-pincode">6-digit PIN Code *</label>
                <input 
                  type="text" 
                  id="addr-pincode"
                  placeholder="e.g. 400001"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  required
                />
              </div>

              {addressError && (
                <p className="text-danger font-weight-600 col-span-2 text-sm mt-1">{addressError}</p>
              )}

              <div className="ig-form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddressModal(false)}
                  className="btn btn-secondary mr-2"
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="eg-btn"
                  disabled={addressLoading}
                >
                  {addressLoading ? <Loader2 className="animate-spin text-white" size={14} /> : "Save & Choose"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
