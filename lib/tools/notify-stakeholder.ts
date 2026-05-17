import { convex, api } from '@/lib/convex/client';
import * as mutations from '@/lib/convex/mutations';

export async function notifyStakeholderTool(
  recipientType: 'freelancer' | 'client',
  message: string,
  channel: 'telegram' | 'whatsapp' = 'telegram',
  jobId?: string,
  matchId?: string,
): Promise<string> {
  try {
    // Send via Telegram
    const delivered = await sendTelegramNotification(message);

    // Log notification to Convex
    // We need the user ID — look it up based on context
    let userId: string | undefined;

    if (recipientType === 'client' && jobId) {
      const job = await convex.query(api.functions.jobs.getById, {
        jobId: jobId as any,
      });
      if (job) userId = job.clientId;
    } else if (recipientType === 'freelancer' && matchId) {
      const match = await convex.query(api.functions.matches.getById, {
        matchId: matchId as any,
      });
      if (match?.freelancer) {
        userId = match.freelancer.userId;
      }
    }

    if (userId) {
      await mutations.logNotification({
        userId,
        channel,
        message,
        delivered,
        relatedJobId: jobId,
        relatedMatchId: matchId,
      });
    }

    return JSON.stringify({
      recipientType,
      channel,
      delivered,
      message: delivered
        ? `Notification sent to ${recipientType} via ${channel}`
        : `Failed to send to ${recipientType} via ${channel} — logged for retry`,
    });
  } catch (error) {
    return JSON.stringify({
      recipientType,
      channel,
      delivered: false,
      message: `Notification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

async function sendTelegramNotification(
  message: string,
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_TEST_CHAT_ID;

  if (!token || !chatId) {
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
