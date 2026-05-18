# KolaAgent Setup And Implementation Guide

This guide reflects the code that is currently in the repository. It is not a speculative build plan.

## 1. What This App Does Today

KolaAgent is a two-sided product for freelance work coordination:

- Clients can submit a project brief and trigger an AI agent workflow
- Freelancers can upload a CV, build a profile, and receive matches or proposals
- The backend stores jobs, matches, proposals, and notifications in Convex
- The frontend streams the agent's progress live while it works through tool calls

At a high level, the product combines:

- a Next.js UI
- Clerk authentication
- a Convex database
- a DeepSeek-powered tool-calling agent
- Tavily-backed market research
- Telegram and WhatsApp notification helpers

## 2. Services Used

### Required

- Clerk
- Convex
- DeepSeek

### Optional But Implemented

- Tavily for grounded market-rate lookups
- Telegram bot credentials for notifications
- WPPConnect settings for WhatsApp-related work

## 3. Environment Setup

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Core variables used by the app:

- `DEEPSEEK_API_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Additional variables used by implemented routes and helpers:

- `CLERK_WEBHOOK_SECRET`
- `TAVILY_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_TEST_CHAT_ID`
- `WPPCONNECT_SESSION_NAME`
- `WPPCONNECT_PORT`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`

The minimal validation helper in `lib/validation/env.ts` only enforces the four core values above, but several features depend on the optional values too.

## 4. Install And Run

The repository already contains a `bun.lock`, so Bun is the default path.

Install dependencies:

```bash
bun install
```

Run Convex locally in one terminal:

```bash
bunx convex dev
```

Run the Next.js app in another:

```bash
bun run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

## 5. Optional Demo Seeding

The project ships with demo freelancer data in `data/seed/freelancers.json`.

Seed it into Convex with:

```bash
bun run scripts/seed-database.ts
```

The seed script creates freelancer records and placeholder user records when needed.

## 6. Authentication And User Sync

Authentication uses Clerk.

Important implementation details:

- `middleware.ts` protects all non-public routes
- `app/(auth)` contains Clerk sign-in and sign-up pages
- `app/(main)/layout.tsx` redirects signed-in users without a role to onboarding
- `components/clerk-sync.tsx` ensures a matching Convex `users` record exists after sign-in
- `app/api/webhooks/clerk/route.ts` also syncs Clerk user events into Convex

User roles:

- `client`
- `freelancer`

Role selection is handled in:

- `app/(main)/onboarding/page.tsx`
- `app/api/user/role/route.ts`

Notification preferences are stored through:

- `app/api/user/notification-preference/route.ts`

## 7. Main User Flows

### Client Flow

1. Sign in
2. Complete onboarding
3. Go to `/jobs/new`
4. Enter a job brief and region
5. Watch the agent run in real time
6. Review persisted jobs, matches, and generated proposals in the dashboard and detail pages

### Freelancer Flow

1. Sign in
2. Choose the freelancer role
3. Upload a CV from `/freelancer/upload-cv`
4. Let the app parse and save profile information
5. Edit the freelancer profile if needed
6. Review applications, proposals, and invitations in freelancer pages

## 8. Agent Architecture

The agent runtime is centered around these files:

- `lib/agent/prompt.ts`
- `lib/agent/tools.ts`
- `lib/agent/executor.ts`
- `lib/agent/stream.ts`
- `lib/agent/loop.ts`
- `app/api/agent/run/route.ts`

### How The Runtime Works

1. `POST /api/agent/run` validates the incoming brief and creates a draft job in Convex
2. `runAgentLoop()` builds the system prompt and message history
3. DeepSeek is called with tool definitions from `lib/agent/tools.ts`
4. Tool calls are executed through `lib/agent/executor.ts`
5. Progress events are streamed back to the frontend as SSE
6. The frontend consumes the stream in `hooks/use-agent-stream.ts`
7. The UI renders progress using `components/agent/agent-log.tsx`

### Agent Limits

Current runtime settings from `config/agent.ts`:

- `maxSteps: 20`
- `timeoutMs: 120000`
- `retryAttempts: 3`
- `retryDelayMs: 1000`

## 9. Implemented Agent Tools

The current tool list is defined in `lib/agent/tools.ts`.

### `search_market_rates`

- Uses Tavily search when available
- Falls back to a built-in regional rate card in `lib/rate-card`

### `structure_brief`

- Converts a raw brief into structured scope data
- Persists scope data back into the job record

### `fetch_matched_freelancers`

- Pulls freelancer profiles from Convex
- Applies region and seniority filters when provided
- Uses text and keyword scoring as the current fallback matching path

### `score_candidate`

- Scores a freelancer against job requirements
- Persists a `matches` record in Convex
- Tracks the best match in the current executor context

### `write_proposal`

- Calls DeepSeek to generate a tailored proposal
- Stores proposal text and tone on the match record

### `notify_stakeholder`

- Logs notifications to Convex
- Accepts `telegram` or `whatsapp` as parameters
- The current tool implementation sends through the Telegram test helper and records the requested channel

### `export_pdf`

- Packages scope and proposal data for the frontend
- The actual PDF rendering is handled client-side

## 10. Database Model

The Convex schema is defined in `convex/schema.ts`.

Main tables:

- `users`
- `freelancers`
- `jobs`
- `matches`
- `notifications`

Highlights:

- `users` stores Clerk-linked identities and notification preferences
- `freelancers` stores parsed profile data, rates, and optional embeddings
- `jobs` stores raw briefs, structured scope, market-rate data, and status
- `matches` stores candidate scoring, gaps, rates, proposal content, and status
- `notifications` stores delivery attempts and relationships to jobs/matches

Vector indexes exist for `freelancers` and `jobs`, but the primary matching tool in `lib/tools/fetch-matched-freelancers.ts` currently uses a simpler fallback scoring path instead of full vector search.

## 11. CV And Profile Pipeline

There are two CV-related paths in the repo:

- `POST /api/cv/upload`
- `POST /api/freelancers/upload-cv`

Important differences:

- `app/api/freelancers/upload-cv/route.ts` parses uploaded PDF content with `pdf-parse`, extracts text, runs `parseCV()`, and persists a freelancer profile
- `app/api/cv/upload/route.ts` also creates a freelancer profile, but uses a simpler buffer-to-text path
- `app/api/cv/parse/route.ts` parses a CV without persisting the final profile

Profile updates are handled through:

- `POST /api/freelancers/profile`

Embeddings can be generated through:

- `POST /api/embeddings/generate`

The current embedding route updates jobs only. It does not yet persist freelancer embeddings from that endpoint.

## 12. API Surface

Implemented API routes:

- `POST /api/agent/run`
- `POST /api/cv/parse`
- `POST /api/cv/upload`
- `POST /api/embeddings/generate`
- `POST /api/freelancers/profile`
- `POST /api/freelancers/upload-cv`
- `POST /api/jobs/create`
- `POST /api/jobs/publish`
- `POST /api/matches/fetch`
- `POST /api/notify/telegram`
- `POST /api/notify/whatsapp`
- `POST /api/pdf/export`
- `POST /api/proposals/generate`
- `POST /api/user/notification-preference`
- `POST /api/user/role`
- `POST /api/webhooks/clerk`

## 13. Frontend Surface

Key route groups:

### Public

- `/`
- `/sign-in`
- `/sign-up`

### Protected

- `/onboarding`
- `/dashboard`
- `/dashboard/jobs`
- `/jobs/new`
- `/jobs/[jobId]`
- `/matches/[matchId]`
- `/proposals/[proposalId]`
- `/freelancer/upload-cv`
- `/freelancer/profile`
- `/freelancer/applications`
- `/freelancer/proposals`
- `/client/applications`
- `/client/invitations`
- `/settings`

## 14. Notes On Current Reality

These points are worth keeping in mind while working in the repo:

- The original planning language around Claude/Anthropic does not match the implemented code; the active client is DeepSeek
- The README that shipped with the scaffold was mostly default Next.js content and has now been replaced with implementation-focused docs
- The setup guide is now aligned to the actual route structure and code paths instead of an aspirational build sequence
- Some features are present in both "production-like" and "prototype" forms, especially around CV ingestion and matching

## 15. Best Files To Read First

If you want to understand the system quickly, start here:

- `app/api/agent/run/route.ts`
- `lib/agent/loop.ts`
- `lib/agent/executor.ts`
- `lib/tools/`
- `convex/schema.ts`
- `convex/functions/`
- `components/agent/agent-runner.tsx`
- `hooks/use-agent-stream.ts`
