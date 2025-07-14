// import { db } from '';
import { v4 as uuid } from 'uuid';
import { db } from '../db/db';

export function generateShortcode() {
  return uuid().slice(0, 6);
}

export function createUrlEntry(
  url: string,
  code: string,
  expiry: string
) {
  db[code] = {
    shortcode: code,
    originalUrl: url,
    expiry,
    createdAt: new Date().toISOString(),
    clicks: [],
  };
  return db[code];
}

export function getUrl(code: string) {
  return db[code];
}

export function recordClick(code: string, referrer: string) {
  db[code]?.clicks.push({
    timestamp: new Date().toISOString(),
    referrer,
    location: 'India',
  });
}
