"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { getOrders, Order } from "@/lib/profile";
import "./orders.css";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders(page, 10);
      setOrders(data.orders || data.data || []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "pending",
      PROCESSING: "processing",
      SHIPPED: "shipped",
      DELIVERED: "delivered",
      CANCELLED: "cancelled",
    };
    return statusMap[status] || "pending";
  };

  if (loading && orders.length === 0) {
    return <div className="orders-loading">Loading your orders...</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <Package size={48} />
          <p>You haven't placed any orders yet.</p>
          <button className="btn-shop" onClick={() => router.push("/shop")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="orders-list">
            {orders.map((order) => (
              <div
                key={order.id}
                className="order-card"
                onClick={() => router.push(`/profile/orders/${order.id}`)}
              >
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className={`order-status ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-items-preview">
                  <span className="items-count">{order.items?.length || 0} item(s)</span>
                </div>

                <div className="order-footer">
                  <div className="order-amount">
                    <span className="label">Total Amount</span>
                    <span className="amount">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <ChevronRight size={20} className="chevron-icon" />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-pagination"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </button>

              <div className="page-info">
                Page {page} of {totalPages}
              </div>

              <button
                className="btn-pagination"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
