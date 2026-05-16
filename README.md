This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



development phase 

Here's the build order based on dependency chains — each phase unlocks the next.

  ---
  Phase 1 — App Shell & Auth (everything renders inside this)
  1. app/layout.tsx — root layout with ClerkProvider, ConvexProvider, globals
  2. app/globals.css — Tailwind base styles
  3. app/(auth)/layout.tsx — centered auth layout
  4. app/(auth)/sign-in/[[...sign-in]]/page.tsx — Clerk <SignIn />
  5. app/(auth)/sign-up/[[...sign-up]]/page.tsx — Clerk <SignUp />
  6. app/(main)/layout.tsx — protected layout with navbar/sidebar
  7. app/page.tsx — landing page

  Phase 2 — Lib Foundation (everything else imports from these)
  8. lib/convex/client.ts — Convex provider helper
  9. lib/convex/auth.ts — requireUser helper
  10. lib/deepseek/client.ts — DeepSeek/OpenAI SDK singleton
  11. lib/rate-card/index.ts + regions.ts + adjuster.ts — fallback rates

  Phase 3 — Agent Brain (the core — build this before any UI works)
  12. lib/agent/types.ts — AgentStep, ToolCall types
  13. lib/agent/prompt.ts — system prompt builder
  14. lib/agent/tools.ts — tool schema definitions (6 tools)
  15. lib/tavily/client.ts + search.ts + parser.ts — web search
  16. lib/tools/search-market-rates.ts — tool 1
  17. lib/tools/structure-brief.ts — tool 2
  18. lib/tools/fetch-matched-freelancers.ts — tool 3
  19. lib/tools/score-candidate.ts — tool 4
  20. lib/tools/write-proposal.ts — tool 5
  21. lib/tools/notify-stakeholder.ts — tool 6
  22. lib/tools/export-pdf.ts — tool 7
  23. lib/agent/executor.ts — routes tool calls to implementations
  24. lib/agent/stream.ts — SSE streaming helper
  25. lib/agent/loop.ts — the main while(true) tool-calling loop

  Phase 4 — Agent API Route (connects the brain to the frontend)
  26. app/api/agent/run/route.ts — the endpoint that triggers everything

  Phase 5 — Core UI Components (the 3 screens judges see)
  27. components/ui/* — base design system (button, input, card, badge, etc.)
  28. components/layout/navbar.tsx + sidebar.tsx + page-header.tsx
  29. components/agent/agent-log.tsx + agent-log-item.tsx + agent-tool-icon.tsx + agent-status-badge.tsx
  30. components/agent/agent-runner.tsx — orchestrates the full run
  31. hooks/use-agent-stream.ts — SSE stream consumer
  32. components/jobs/brief-input.tsx — job input textarea
  33. components/matching/match-card.tsx + match-results-panel.tsx + match-score-ring.tsx
  34. components/proposals/proposal-preview.tsx + tone-selector.tsx
  35. components/jobs/scope-card.tsx + budget-breakdown.tsx

  Phase 6 — App Pages (wire components into routes)
  36. app/(main)/onboarding/page.tsx — role selection
  37. app/(main)/dashboard/page.tsx — client/freelancer dashboard
  38. app/(main)/jobs/new/page.tsx — post a job + run agent
  39. app/(main)/jobs/[jobId]/page.tsx — job detail with results

  Phase 7 — Notifications & PDF (Day 5 features)
  40. lib/notifications/templates.ts + telegram.ts + dispatcher.ts
  41. lib/pdf/styles.ts + generator.ts + scope-report.ts + proposal-doc.ts
  42. components/pdf/export-button.tsx
  43. components/notifications/notification-banner.tsx

  Phase 8 — CV Pipeline (freelancer side)
  44. lib/deepseek/embeddings.ts + parse-cv.ts + rate-limiter.ts
  45. app/api/cv/upload/route.ts + cv/parse/route.ts
  46. components/freelancer/cv-upload-zone.tsx + profile-card.tsx + profile-editor.tsx
  47. app/(main)/freelancer/upload-cv/page.tsx + profile/page.tsx

  Phase 9 — Remaining Pages & Polish
  48. app/(main)/matches/[matchId]/page.tsx + proposals/[proposalId]/page.tsx
  49. Remaining dashboard components, remaining job/market/notification components
  50. scripts/seed-database.ts — seed the 5 demo profiles
  51. app/loading.tsx + app/error.tsx + app/not-found.tsx

