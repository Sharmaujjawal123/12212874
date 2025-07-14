import { Request, Response } from 'express';
import { Log } from '../utils/log';
import { createUrlEntry, generateShortcode, getUrl, recordClick } from '../services/urlService';

export async function createShortUrl(req: Request, res: Response) {
  await Log('backend', 'info', 'middleware', 'POST /shorturls hit');

  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!/^https?:\/\/\S+$/.test(url)) {
      await Log('backend', 'error', 'middleware', 'Invalid URL');
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const code = shortcode || generateShortcode();

    if (getUrl(code)) {
      await Log('backend', 'warn', 'middleware', 'Shortcode already exists');
      return res.status(409).json({ error: 'Shortcode already taken' });
    }

    const expiry = new Date(Date.now() + validity * 60000).toISOString();
    const data = createUrlEntry(url, code, expiry);

    await Log('backend', 'info', 'middleware', `Short URL created: ${code}`);

    res.status(201).json({
      shortLink: `http://localhost:8000/${code}`,
      expiry: data.expiry,
    });
  } catch (err: any) {
    await Log('backend', 'fatal', 'middleware', `Error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getStats(req: Request, res: Response) {
  const code = req.params.shortcode;
  await Log('backend', 'info', 'middleware', `GET /shorturls/${code}`);

  const data = getUrl(code);
  if (!data) {
    await Log('backend', 'warn', 'middleware', 'Stats - Not Found');
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  res.status(200).json({
    shortLink: `http://localhost:8000/${code}`,
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiry: data.expiry,
    clicks: data.clicks.length,
    clickDetails: data.clicks,
  });
}

export async function redirect(req: Request, res: Response) {
  const code = req.params.shortcode;
  await Log('backend', 'info', 'middleware', `GET /${code} for redirect`);

  const data = getUrl(code);
  if (!data) {
    await Log('backend', 'warn', 'middleware', 'Redirect - Not Found');
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  if (new Date(data.expiry) < new Date()) {
    await Log('backend', 'warn', 'middleware', 'Redirect - Expired');
    return res.status(410).json({ error: 'Short link expired' });
  }

  recordClick(code, req.get('Referrer') || 'unknown');

  await Log('backend', 'info', 'middleware', `Redirecting to ${data.originalUrl}`);
  res.redirect(data.originalUrl);
}
