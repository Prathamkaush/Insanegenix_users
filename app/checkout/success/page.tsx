"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2, MapPin, CreditCard, Calendar } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { getOrderById } from "@/lib/profile";
import { currency } from "@/lib/products";
import "../checkout.css";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderIdParam) {
      setError("No order reference ID found.");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(Number(orderIdParam));
        setOrder(orderData);
      } catch (err: any) {
        console.error("Error fetching order on success page:", err);
        setError("Could not retrieve details for this order. It was placed successfully, but details couldn't load right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderIdParam]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Loader2 className="animate-spin text-danger mx-auto mb-3" size={48} />
        <h3 className="text-white">Retrieving order details...</h3>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="ig-success-wrapper">
        <div className="ig-success-icon bg-danger-10 text-danger" style={{ background: "rgba(220, 53, 69, 0.1)", color: "#dc3545" }}>
          <CheckCircle2 size={44} />
        </div>
        <h2>Order Confirmed!</h2>
        <p className="text-gray">{error || "Your order was placed successfully. Thank you for shopping with us!"}</p>
        
        {orderIdParam && (
          <div className="ig-success-details mb-4">
            <h3>Order Summary</h3>
            <div className="ig-success-info-grid">
              <div className="ig-success-info-col">
                <h4>Order Reference ID</h4>
                <p>#{orderIdParam}</p>
              </div>
              <div className="ig-success-info-col">
                <h4>Status</h4>
                <p>PENDING CONFIRMATION</p>
              </div>
            </div>
          </div>
        )}

        <div className="ig-success-actions">
          <Link href="/shop" className="eg-btn btn-danger">
            <span>Continue Shopping</span>
          </Link>
          <Link href="/profile/orders" className="eg-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}>
            <span>Order History</span>
          </Link>
        </div>
      </div>
    );
  }

  // Formatting address display
  let addressText = "";
  let addressName = "";
  let addressPhone = "";
  if (order.address) {
    try {
      const parsedAddr = typeof order.address === "string" ? JSON.parse(order.address) : order.address;
      addressName = parsedAddr.name || "";
      addressPhone = parsedAddr.phone || "";
      addressText = `${parsedAddr.street || ""}, ${parsedAddr.city || ""}, ${parsedAddr.state || ""} - ${parsedAddr.pincode || ""}`;
    } catch {
      addressText = String(order.address);
    }
  }

  // Formatting estimated delivery date (e.g. 3-5 days from now)
  const orderDate = new Date(order.createdAt || Date.now());
  const deliveryMin = new Date(orderDate);
  deliveryMin.setDate(orderDate.getDate() + 3);
  const deliveryMax = new Date(orderDate);
  deliveryMax.setDate(orderDate.getDate() + 5);

  const deliveryStr = `${deliveryMin.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${deliveryMax.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="ig-success-wrapper">
      <div className="ig-success-icon">
        <CheckCircle2 size={44} />
      </div>
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your purchase. We are preparing your order for shipment.</p>

      <div className="ig-success-details">
        <h3>Order Receipt</h3>
        
        <div className="ig-success-info-grid">
          <div className="ig-success-info-col">
            <h4>Order Reference ID</h4>
            <p className="font-weight-800 text-white">#{order.id}</p>
          </div>
          <div className="ig-success-info-col">
            <h4>Total Paid / Due</h4>
            <p className="font-weight-800 text-danger">{currency(order.finalAmount || order.payable)}</p>
          </div>
        </div>

        <div className="ig-success-info-grid">
          <div className="ig-success-info-col">
            <div className="d-flex align-items-center mb-1 text-gray" style={{ fontSize: "11px", fontWeight: "700" }}>
              <MapPin size={12} className="mr-1 text-danger" /> DELIVERY ADDRESS
            </div>
            <p className="font-weight-700 text-white mb-1">{addressName}</p>
            <p>{addressText}</p>
            {addressPhone && <p className="text-gray" style={{ fontSize: "13px", marginTop: "4px" }}>Phone: {addressPhone}</p>}
          </div>

          <div className="ig-success-info-col">
            <div className="d-flex align-items-center mb-1 text-gray" style={{ fontSize: "11px", fontWeight: "700" }}>
              <CreditCard size={12} className="mr-1 text-danger" /> PAYMENT METHOD
            </div>
            <p className="text-white font-weight-700">{order.paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Paid Online (Razorpay)"}</p>
            <p className="text-gray" style={{ fontSize: "13px" }}>
              Status: {order.status || "PENDING"}
            </p>
          </div>
        </div>

        <div className="ig-success-info-grid border-top-white-5 pt-3">
          <div className="ig-success-info-col">
            <div className="d-flex align-items-center mb-1 text-gray" style={{ fontSize: "11px", fontWeight: "700" }}>
              <Calendar size={12} className="mr-1 text-danger" /> ESTIMATED DELIVERY
            </div>
            <p className="text-success font-weight-700">{deliveryStr}</p>
          </div>
        </div>
      </div>

      <div className="ig-success-actions">
        <Link href="/shop" className="eg-btn d-flex align-items-center">
          <ShoppingBag size={18} className="mr-2" />
          <span>Continue Shopping</span>
        </Link>
        <Link 
          href="/profile/orders" 
          className="eg-btn d-flex align-items-center" 
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
        >
          <span>Track Order History</span>
          <ArrowRight size={18} className="ml-2 text-danger" />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="fix bg-black">
      <Breadcrumb title="Order Placed" />
      <section className="checkout-area pt-120 pb-120">
        <div className="container">
          <Suspense fallback={
            <div className="text-center py-5">
              <Loader2 className="animate-spin text-danger mx-auto mb-3" size={48} />
              <h3 className="text-white">Loading confirmation page...</h3>
            </div>
          }>
            <SuccessPageContent />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
