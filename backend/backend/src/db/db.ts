type Click = { timestamp: string; referrer: string; location: string };
type UrlData = {
  shortcode: string;
  originalUrl: string;
  expiry: string;
  createdAt: string;
  clicks: Click[];
};

export const db: Record<string, UrlData> = {};
