import { sendTelegram } from './telegram';
import { sendWhatsApp } from './whatsapp';
import { logger } from '@/lib/utils/logger';

export type NotificationChannel = 'telegram' | 'whatsapp';

interface DispatchOptions {
  channel: NotificationChannel;
  chatId?: string;
  phoneNumber?: string;
  message: string;
}

interface DispatchResult {
  delivered: boolean;
  channel: NotificationChannel;
  error?: string;
}

export async function dispatch(opts: DispatchOptions): Promise<DispatchResult> {
  if (opts.channel === 'telegram') {
    if (!opts.chatId) {
      logger.warn('No Telegram chat ID provided');
      return { delivered: false, channel: 'telegram', error: 'No chat ID' };
    }
    const result = await sendTelegram(opts.chatId, opts.message);
    return { delivered: result.ok, channel: 'telegram', error: result.error };
  }

  if (opts.channel === 'whatsapp') {
    if (!opts.phoneNumber) {
      logger.warn('No WhatsApp phone number provided');
      return { delivered: false, channel: 'whatsapp', error: 'No phone number' };
    }
    const result = await sendWhatsApp(opts.phoneNumber, opts.message);
    return { delivered: result.ok, channel: 'whatsapp', error: result.error };
  }

  return { delivered: false, channel: opts.channel, error: 'Unknown channel' };
}

export async function dispatchBoth(
  chatId: string | undefined,
  phoneNumber: string | undefined,
  message: string,
): Promise<DispatchResult[]> {
  const results: DispatchResult[] = [];
  if (chatId) {
    results.push(await dispatch({ channel: 'telegram', chatId, message }));
  }
  if (phoneNumber) {
    results.push(await dispatch({ channel: 'whatsapp', phoneNumber, message }));
  }
  return results;
}
