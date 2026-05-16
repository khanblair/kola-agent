export const notificationConfig = {
  maxRetries: 2,
  retryDelayMs: 2_000,
  telegramParseMode: 'Markdown' as const,
  maxMessageLength: 4096,
} as const;
