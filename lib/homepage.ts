const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export type HomepageMedia = {
  id: number;
  url: string;
  type: "IMAGE" | "VIDEO";
  mimeType?: string | null;
};

export type HomepageSection = {
  id: number;
  type: "HERO" | "CATEGORY_STRIP" | "EDITORIAL" | "INFLUENCER";
  title?: string | null;
  position: number;
  isActive: boolean;
  config?: any;
};

export function homepageMediaUrl(media?: HomepageMedia | null) {
  if (!media?.url) return "";
  if (media.url.startsWith("http")) return media.url;
  if (media.url.startsWith("/uploads")) return `${API_URL}${media.url}`;
  return media.url;
}

function collectMediaIds(sections: HomepageSection[]) {
  const ids = new Set<number>();

  sections.forEach((section) => {
    const config = section.config || {};

    if (Array.isArray(config.slides)) {
      config.slides.forEach((slide: any) => {
        if (slide.mediaId) ids.add(Number(slide.mediaId));
        if (slide.mobileMediaId) ids.add(Number(slide.mobileMediaId));
      });
    }

    if (config.videoBanner?.backgroundMediaId) {
      ids.add(Number(config.videoBanner.backgroundMediaId));
    }

    if (config.videoBanner?.videoMediaId) {
      ids.add(Number(config.videoBanner.videoMediaId));
    }
  });

  return Array.from(ids);
}

export async function getHomepageSections() {
  try {
    const res = await fetch(`${API_URL}/homepage`, { cache: "no-store" });
    if (!res.ok) return [];
    const sections = (await res.json()) as HomepageSection[];
    const mediaIds = collectMediaIds(sections);

    if (!mediaIds.length) return sections;

    const mediaRes = await fetch(`${API_URL}/media?ids=${mediaIds.join(",")}`, {
      cache: "no-store",
    });
    const media = mediaRes.ok ? ((await mediaRes.json()) as HomepageMedia[]) : [];
    const mediaMap = new Map(media.map((item) => [item.id, item]));

    return sections.map((section) => ({
      ...section,
      config: {
        ...(section.config || {}),
        slides: Array.isArray(section.config?.slides)
          ? section.config.slides.map((slide: any) => ({
              ...slide,
              media: slide.mediaId ? mediaMap.get(Number(slide.mediaId)) : null,
              mobileMedia: slide.mobileMediaId
                ? mediaMap.get(Number(slide.mobileMediaId))
                : null,
            }))
          : section.config?.slides,
        videoBanner: section.config?.videoBanner
          ? {
              ...section.config.videoBanner,
              backgroundMedia: section.config.videoBanner.backgroundMediaId
                ? mediaMap.get(Number(section.config.videoBanner.backgroundMediaId))
                : null,
              videoMedia: section.config.videoBanner.videoMediaId
                ? mediaMap.get(Number(section.config.videoBanner.videoMediaId))
                : null,
            }
          : section.config?.videoBanner,
      },
    }));
  } catch {
    return [];
  }
}
