export type StorefrontSettings = {
  supportEmail: string;
  supportPhone: string;
  address: string;
  maintenanceMode: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export const defaultStorefrontSettings: StorefrontSettings = {
  supportEmail: "info@insanegenix.com",
  supportPhone: "020 370 1425",
  address: "New Delhi, Delhi",
  maintenanceMode: false,
};

export async function getStorefrontSettings(): Promise<StorefrontSettings> {
  try {
    const res = await fetch(`${API_URL}/settings`, { cache: "no-store" });
    if (!res.ok) return defaultStorefrontSettings;

    const settings = await res.json();

    return {
      supportEmail: settings.supportEmail || defaultStorefrontSettings.supportEmail,
      supportPhone: settings.supportPhone || defaultStorefrontSettings.supportPhone,
      address: settings.address || defaultStorefrontSettings.address,
      maintenanceMode: Boolean(settings.maintenanceMode),
    };
  } catch {
    return defaultStorefrontSettings;
  }
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
