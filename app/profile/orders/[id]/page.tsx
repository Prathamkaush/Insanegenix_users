"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { getOrderById, Order } from "@/lib/profile";
import "../order-details.css";

function money(value?: number | null) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(orderId)) {
      setError("Invalid order ID");
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(orderId);
      setOrder(data.order || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "pending",
      PROCESSING: "processing",
      CONFIRMED: "processing",
      SHIPPED: "shipped",
      DELIVERED: "delivered",
      CANCELLED: "cancelled",
    };
    return statusMap[status] || "pending";
  };

  if (loading) {
    return (
      <div className="order-details-loading">
        <Loader2 size={32} className="spinner" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-error">
        <p>{error || "Order not found"}</p>
        <button className="btn-back" onClick={() => router.back()}>
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    );
  }

  const pricing = order.pricing || {
    itemsSubtotal: order.totalAmount,
    gst: order.totalGst,
    shipping: order.shippingCharge,
    couponDiscount: order.couponDiscount,
    payable: order.finalAmount || order.totalAmount + order.totalGst + order.shippingCharge - order.couponDiscount,
  };

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <button className="btn-back" onClick={() => router.back()}>
          <ArrowLeft size={18} />
          Back to Orders
        </button>
        <h1>Order #{order.id}</h1>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <h2>Order Status</h2>
          <div className={`order-status ${getStatusColor(order.status)}`}>{order.status}</div>
          <p className="order-date">
            Ordered on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="detail-card highlight">
          <h2>Payable Amount</h2>
          <div className="amount-display">{money(pricing.payable)}</div>
        </div>
      </div>

      <div className="detail-card full-width">
        <h2>Items in Order</h2>
        {order.items?.length ? (
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">GST</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="product-name">{item.productName || `Product #${item.productId}`}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{money(item.price)}</td>
                    <td className="text-right">{money(item.gstAmount * item.quantity)}</td>
                    <td className="text-right">{money((item.price + item.gstAmount) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-items">No items in this order</p>
        )}
      </div>

      {order.shippingAddress && (
        <div className="detail-card full-width">
          <h2>Shipping Address</h2>
          <div className="address-block">
            <p className="address-name">{order.shippingAddress.name}</p>
            <p className="address-phone">{order.shippingAddress.phone}</p>
            <p className="address-text">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.pincode}
            </p>
          </div>
        </div>
      )}

      <div className="detail-card full-width">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Items Subtotal</span>
          <span>{money(pricing.itemsSubtotal)}</span>
        </div>
        <div className="summary-row">
          <span>GST</span>
          <span>{money(pricing.gst)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>{pricing.shipping === 0 ? "FREE" : money(pricing.shipping)}</span>
        </div>
        {pricing.couponDiscount > 0 && (
          <div className="summary-row">
            <span>Coupon Discount</span>
            <span>-{money(pricing.couponDiscount)}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>{money(pricing.payable)}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary" onClick={() => window.open(`/profile/orders/${order.id}/invoice`, "_blank")}>
          <Printer size={18} />
          Download Invoice
        </button>
        <button className="btn-primary" onClick={() => router.push("/shop")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
