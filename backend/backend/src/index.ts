import express from 'express';
import { Log } from './utils/log'; // adjust path accordingly

import { createShortUrl } from './controllers/urlController';
const app = express();
const PORT = 8000;

app.use(express.json());

app.use('/', createShortUrl);
(async () => {
  await Log('backend', 'info', 'middleware', 'Server initialization started');
})();

app.listen(PORT, async () => {
  await Log('backend', 'info', 'middleware', `Server running on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});
