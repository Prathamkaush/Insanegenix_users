const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

type AuthResponse = {
  token?: string;
  user?: unknown;
  message?: string;
  success?: boolean;
};

async function authRequest(path: string, body: Record<string, string>) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as AuthResponse;
  if (!res.ok) throw new Error(data.message || "Authentication failed");
  return data;
}

export function loginCustomer(email: string, password: string) {
  return authRequest("/auth/login", { email, password });
}

export function registerCustomer(name: string, email: string, password: string) {
  return authRequest("/auth/register", {
    name: name.trim(),
    email: email.trim(),
    password,
  });
}

export function getGoogleAuthUrl() {
  return `${API_URL}/auth/google`;
}

export function storeCustomerSession(data: AuthResponse) {
  if (!data.token) throw new Error("Token missing from auth response");

  localStorage.setItem("token", data.token);
  localStorage.setItem("user_token", data.token);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
  document.cookie = `token=${encodeURIComponent(data.token)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  window.dispatchEvent(new Event("auth:changed"));
}
