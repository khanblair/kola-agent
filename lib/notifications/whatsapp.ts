import { logger } from '@/lib/utils/logger';

interface WhatsAppMessageResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export async function sendWhatsApp(
  phoneNumber: string,
  text: string,
): Promise<WhatsAppMessageResult> {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    logger.warn('WhatsApp API credentials not configured');
    return { ok: false, error: 'WhatsApp credentials not set' };
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: text },
      }),
    });

    const data = (await response.json()) as {
      messages?: { id: string }[];
      error?: { message: string };
    };

    if (data.error) {
      logger.error('WhatsApp API error', { error: data.error.message });
      return { ok: false, error: data.error.message };
    }

    return { ok: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    logger.error('WhatsApp send failed', error);
    return { ok: false, error: (error as Error).message };
  }
}
