import { clearCacheByPrefix, getCached } from "@/lib/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";
const PROFILE_CACHE_TTL = 2 * 60 * 1000;
const ORDERS_CACHE_TTL = 30 * 1000;

function getAuthToken() {
  return localStorage.getItem("token") || "";
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getAuthOnlyHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function profileImageUrl(image?: string | null) {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

// ================= USER PROFILE =================
export async function getUserProfile() {
  const token = getAuthToken();

  return getCached(`profile:${token}`, PROFILE_CACHE_TTL, async () => {
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to fetch profile");
    }

    return res.json();
  });
}

export interface UpdateUserProfileInput {
  name: string;
  email: string;
  phone: string;
  image?: File | null;
}

export async function updateUserProfile(data: UpdateUserProfileInput) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  if (data.image) formData.append("image", data.image);

  const res = await fetch(`${API_URL}/users/profile`, {
    method: "PATCH",
    headers: getAuthOnlyHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update profile");
  }

  clearCacheByPrefix(`profile:${getAuthToken()}`);
  return res.json();
}

// ================= ADDRESSES =================
export interface UserAddress {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateAddressInput {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export async function getAddresses() {
  const res = await fetch(`${API_URL}/addresses`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch addresses");
  }

  return res.json();
}

export async function createAddress(data: CreateAddressInput) {
  const res = await fetch(`${API_URL}/addresses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create address");
  }

  return res.json();
}

export async function updateAddress(id: number, data: Partial<CreateAddressInput>) {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update address");
  }

  return res.json();
}

export async function setDefaultAddress(id: number) {
  const res = await fetch(`${API_URL}/addresses/${id}/default`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to set default address");
  }

  return res.json();
}

export async function deleteAddress(id: number) {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete address");
  }

  return res.json();
}

// ================= ORDERS =================
export interface OrderItem {
  id: number;
  productId: number;
  productName?: string;
  flavour?: string | null;
  weightLabel?: string | null;
  quantity: number;
  price: number;
  gstRate: number;
  gstAmount: number;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  paymentMethod?: string | null;
  orderDate: string;
  totalAmount: number;
  totalGst: number;
  shippingCharge: number;
  couponDiscount: number;
  finalAmount: number;
  pricing?: {
    itemsSubtotal: number;
    gst: number;
    shipping: number;
    couponDiscount: number;
    payable: number;
  };
  items: OrderItem[];
  shippingAddress: any;
  createdAt: string;
}

function toNumber(value: unknown): number {
  const numericValue = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function normalizeOrder(order: any): Order {
  return {
    ...order,
    paymentMethod: order?.paymentMethod ?? order?.payment?.method ?? null,
    totalAmount: toNumber(order?.totalAmount),
    totalGst: toNumber(order?.totalGst),
    shippingCharge: toNumber(order?.shippingCharge),
    couponDiscount: toNumber(order?.couponDiscount),
    finalAmount: toNumber(order?.finalAmount ?? order?.totalAmount),
    pricing: order?.pricing
      ? {
          itemsSubtotal: toNumber(order.pricing.itemsSubtotal),
          gst: toNumber(order.pricing.gst),
          shipping: toNumber(order.pricing.shipping),
          couponDiscount: toNumber(order.pricing.couponDiscount),
          payable: toNumber(order.pricing.payable),
        }
      : undefined,
    shippingAddress: order?.shippingAddress || order?.address,
    items: Array.isArray(order?.items)
      ? order.items.map((item: any) => ({
          ...item,
          productId: toNumber(item?.productId ?? item?.product?.id),
          productName: item?.productName || item?.product?.title,
          flavour: item?.flavour ?? item?.flavor ?? item?.variant?.flavour ?? item?.variant?.flavor ?? null,
          weightLabel: item?.weightLabel ?? item?.variant?.weightLabel ?? item?.variant?.weight ?? null,
          quantity: toNumber(item?.quantity),
          price: toNumber(item?.price),
          gstRate: toNumber(item?.gstRate),
          gstAmount: toNumber(item?.gstAmount),
        }))
      : [],
  };
}

function normalizeOrdersResponse(data: any) {
  if (Array.isArray(data)) {
    return data.map(normalizeOrder);
  }

  return {
    ...data,
    orders: Array.isArray(data?.orders)
      ? data.orders.map(normalizeOrder)
      : data?.orders,
    data: Array.isArray(data?.data) ? data.data.map(normalizeOrder) : data?.data,
  };
}

export async function getOrders(page: number = 1, limit: number = 10) {
  const token = getAuthToken();

  return getCached(`orders:${token}:${page}:${limit}`, ORDERS_CACHE_TTL, async () => {
    const res = await fetch(
      `${API_URL}/orders/my?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to fetch orders");
    }

    const data = await res.json();
    return normalizeOrdersResponse(data);
  });
}

export async function getOrderById(id: number) {
  const token = getAuthToken();

  return getCached(`order:${token}:${id}`, ORDERS_CACHE_TTL, async () => {
    const res = await fetch(`${API_URL}/orders/my/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to fetch order");
    }

    const data = await res.json();

    if (data?.order) {
      return {
        ...data,
        order: normalizeOrder(data.order),
      };
    }

    return normalizeOrder(data);
  });
}
