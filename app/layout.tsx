import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/components/providers';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'KolaAgent — Autonomous Freelance Proposal Agent',
    template: '%s | KolaAgent',
  },
  description:
    'Autonomous AI agent that takes a job brief and completes the full freelancer proposal workflow — market research, candidate matching, proposal writing, notifications, and PDF export.',
  keywords: [
    'freelance',
    'AI agent',
    'proposal generator',
    'Africa',
    'Kolaborate',
    'matching',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${poppins.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
