export const siteConfig = {
  name: 'KolaAgent',
  description:
    'Autonomous AI agent that completes the full freelancer proposal workflow — market research, candidate matching, proposal writing, notifications, and PDF export.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: '/images/og-image.png',
} as const;
