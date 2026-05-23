# KolaAgent

**🚀 Live Demo:** [https://kola-agent.vercel.app/](https://kola-agent.vercel.app/)

KolaAgent is a full-stack Next.js application for running an AI-assisted freelance proposal workflow for the African market. A client submits a job brief, the app runs an autonomous agent loop, stores results in Convex, and presents matches, proposals, notifications, and PDF-ready output in the UI.

## What Is Implemented

- Clerk authentication with protected routes and role-based onboarding
- Convex-backed data model for users, freelancers, jobs, matches, and notifications
- Client flow for submitting a job brief and watching the agent run over Server-Sent Events
- Agent tools for:
  - market-rate research
  - brief structuring
  - freelancer matching
  - candidate scoring
  - proposal generation
  - stakeholder notification
  - PDF export preparation
- Freelancer flow for CV upload, CV parsing, and profile editing
- Dashboard views for both client and freelancer roles
- Notification helpers for Telegram and WhatsApp
- Client-side PDF export flow fed by server-prepared data

## Current Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Clerk for authentication
- Convex for database, queries, mutations, and vector indexes
- DeepSeek via the OpenAI SDK-compatible client
- Tavily for market-rate search grounding

## How The App Works

1. A user signs in with Clerk.
2. The user is synced into Convex and chooses a role during onboarding.
3. A client posts a brief from `/jobs/new`.
4. The frontend calls `POST /api/agent/run`.
5. `lib/agent/loop.ts` runs the tool-calling workflow and streams progress back to the browser.
6. Tool results are persisted into Convex as jobs, matches, proposals, and notifications.
7. The UI surfaces results in dashboards, job pages, match pages, and proposal pages.

## Important Implementation Notes

- The agent is currently implemented with `DeepSeek`, not Anthropic/Claude.
- The `export_pdf` tool prepares structured PDF data. The actual PDF rendering happens client-side.
- Convex vector indexes exist in the schema, but the main matching tool currently uses a simpler text/keyword fallback path when fetching candidates.
- The agent notification tool logs the requested channel but currently sends through the Telegram helper used for testing.

## Project Structure

```text
app/
  (auth)/                Clerk sign-in and sign-up routes
  (main)/                Protected product pages
  api/                   Backend API routes
components/              UI components by product area
convex/                  Schema plus queries, mutations, and actions
data/seed/               Demo freelancer data
docs/                    Setup and project documentation
hooks/                   Client hooks, including SSE agent streaming
lib/
  agent/                 Agent prompt, tools, loop, executor, and SSE stream
  convex/                Client/auth/query/mutation helpers
  deepseek/              LLM client, CV parsing, embeddings
  notifications/         Telegram and WhatsApp adapters
  pdf/                   PDF templates and generators
  rate-card/             Built-in regional fallback rates
  tavily/                Market-search integration
  tools/                 Agent tool implementations
types/                   Shared application types
```

## Main Routes

### Product Pages

- `/` landing page
- `/onboarding` role and contact setup
- `/dashboard` main role-aware dashboard
- `/jobs/new` submit a new client brief and run the agent
- `/jobs/[jobId]` job details
- `/matches/[matchId]` match details
- `/proposals/[proposalId]` proposal details
- `/freelancer/upload-cv` freelancer CV upload
- `/freelancer/profile` freelancer profile management
- `/settings` user settings

### API Routes

- `POST /api/agent/run`
- `POST /api/cv/upload`
- `POST /api/cv/parse`
- `POST /api/freelancers/upload-cv`
- `POST /api/freelancers/profile`
- `POST /api/jobs/create`
- `POST /api/jobs/publish`
- `POST /api/matches/fetch`
- `POST /api/proposals/generate`
- `POST /api/pdf/export`
- `POST /api/notify/telegram`
- `POST /api/notify/whatsapp`
- `POST /api/embeddings/generate`
- `POST /api/user/role`
- `POST /api/user/notification-preference`
- `POST /api/webhooks/clerk`

## Environment Variables

Required to boot the core app:

- `DEEPSEEK_API_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Also used by implemented features:

- `CLERK_WEBHOOK_SECRET`
- `TAVILY_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_TEST_CHAT_ID`
- `WPPCONNECT_SESSION_NAME`
- `WPPCONNECT_PORT`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`

Use `.env.example` as the starting point for `.env.local`.

## Local Development

This repo already includes a `bun.lock`, so Bun is the smoothest path locally.

```bash
bun install
cp .env.example .env.local
```

Run Convex in one terminal:

```bash
bunx convex dev
```

Run Next.js in another terminal:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Seed Demo Freelancers

To populate Convex with demo freelancer profiles from `data/seed/freelancers.json`:

```bash
bun run scripts/seed-database.ts
```

## Useful Commands

```bash
# start the Next.js app
bun run dev

# build for production
bun run build

# start the production server
bun run start

# run linting
bun run lint

# seed demo freelancer data
bun run scripts/seed-database.ts
```

## Data Model Snapshot

The main Convex tables are:

- `users` for Clerk-linked accounts and notification preferences
- `freelancers` for profile data, CV-derived fields, and optional embeddings
- `jobs` for submitted briefs, structured scope, status, and market-rate data
- `matches` for candidate scoring, proposal content, and recommendation status
- `notifications` for delivery logs tied to jobs and matches

## Current MVP Boundaries

- The LLM runtime is wired to DeepSeek today, even though some earlier planning docs referenced Claude
- Matching support exists in the schema for vector search, but the main runtime path still relies on simpler scoring logic in the matching tool
- PDF export is a packaged data flow plus client-side rendering, not a server-side PDF generation pipeline
- Notification routing supports Telegram and WhatsApp at the app level, but the agent tool currently uses the Telegram testing helper for delivery attempts

## Related Docs

- `docs/SETUP-GUIDE.md` explains the implemented architecture in more detail
- `.env.example` lists the environment variables used by the app
- `data/seed/freelancers.json` contains the demo freelancer dataset used for local seeding

## Key Files

- `app/api/agent/run/route.ts` starts the agent workflow
- `lib/agent/loop.ts` runs the tool-calling loop
- `lib/agent/executor.ts` dispatches tool calls to implementations
- `lib/tools/*` contains the actual tool logic
- `convex/schema.ts` defines the stored data model
- `components/agent/agent-runner.tsx` and `hooks/use-agent-stream.ts` power the live UI stream
- `docs/SETUP-GUIDE.md` contains a deeper implementation-oriented guide
