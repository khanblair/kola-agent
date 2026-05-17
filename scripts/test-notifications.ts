/**
 * Test script: sends a test notification via Telegram and/or WhatsApp
 *
 * Usage: TELEGRAM_TEST_CHAT_ID=xxx bun run scripts/test-notifications.ts
 */
import { sendTelegram } from '../lib/notifications/telegram';
import { sendWhatsApp } from '../lib/notifications/whatsapp';

async function test() {
  const chatId = process.env.TELEGRAM_TEST_CHAT_ID;
  const phone = process.env.WHATSAPP_TEST_PHONE;

  console.log('Testing notification delivery...\n');

  if (chatId) {
    console.log('Sending Telegram message...');
    const result = await sendTelegram(chatId, '🔔 *Test from KolaAgent*\n\nNotification system is working!');
    console.log(result.ok ? `  ✓ Sent (message ${result.messageId})` : `  ✗ Failed: ${result.error}`);
  } else {
    console.log('  ⚠ TELEGRAM_TEST_CHAT_ID not set, skipping Telegram');
  }

  if (phone) {
    console.log('Sending WhatsApp message...');
    const result = await sendWhatsApp(phone, '🔔 Test from KolaAgent — Notification system is working!');
    console.log(result.ok ? `  ✓ Sent (${result.messageId})` : `  ✗ Failed: ${result.error}`);
  } else {
    console.log('  ⚠ WHATSAPP_TEST_PHONE not set, skipping WhatsApp');
  }

  console.log('\nDone.');
}

test().catch(console.error);
