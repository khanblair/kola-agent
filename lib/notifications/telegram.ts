import { logger } from '@/lib/utils/logger';

interface TelegramMessageResult {
  ok: boolean;
  messageId?: number;
  error?: string;
}

export async function sendTelegram(
  chatId: string,
  text: string,
): Promise<TelegramMessageResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    logger.warn('Telegram bot token not configured');
    return { ok: false, error: 'TELEGRAM_BOT_TOKEN not set' };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    const data = (await response.json()) as {
      ok: boolean;
      result?: { message_id: number };
      description?: string;
    };

    if (!data.ok) {
      logger.error('Telegram API error', { error: data.description });
      return { ok: false, error: data.description };
    }

    return { ok: true, messageId: data.result?.message_id };
  } catch (error) {
    logger.error('Telegram send failed', error);
    return { ok: false, error: (error as Error).message };
  }
}
