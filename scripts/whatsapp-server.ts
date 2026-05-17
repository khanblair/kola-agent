/**
 * WhatsApp webhook verification server for development
 *
 * This runs a minimal HTTP server to handle WhatsApp webhook verification
 * during local development. It's not needed in production since the Next.js
 * API route handles it.
 *
 * Usage: WHATSAPP_VERIFY_TOKEN=xxx bun run scripts/whatsapp-server.ts
 */
import http from 'http';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? 'kolaagent-verify';
const PORT = parseInt(process.env.WHATSAPP_WEBHOOK_PORT ?? '3001', 10);

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  // Webhook verification (GET)
  if (req.method === 'GET' && url.pathname === '/webhook/whatsapp') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✓ Webhook verified');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(challenge);
      return;
    }

    console.log('✗ Webhook verification failed');
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Webhook events (POST)
  if (req.method === 'POST' && url.pathname === '/webhook/whatsapp') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      console.log('Webhook event:', body);
      res.writeHead(200);
      res.end('OK');
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`WhatsApp webhook server running on http://localhost:${PORT}`);
  console.log(`Verify URL: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`Verify token: ${VERIFY_TOKEN}`);
});
