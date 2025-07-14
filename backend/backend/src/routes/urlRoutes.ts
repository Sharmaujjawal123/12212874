import express from 'express';
import { createShortUrl, getStats, redirect } from '../controllers/urlController';

const router = express.Router();

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getStats);
router.get('/:shortcode', redirect);

export default router;
