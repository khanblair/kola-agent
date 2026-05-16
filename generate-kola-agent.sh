#!/bin/bash

# =============================================================================
# KolaAgent — Project Structure Generator
# Kolaborate Agent Economy Hackathon 2026
#
# Usage:
#   Option A (Recommended): Run from inside your 'kola-agent' project directory:
#     bash generate-kola-agent.sh
#
#   Option B: Run from the parent directory of 'kola-agent':
#     bash generate-kola-agent.sh
# =============================================================================

set -e  # Exit immediately if any command fails

PROJECT="kola-agent"

echo ""
echo "=================================================="
echo "  KolaAgent Project Structure Generator"
echo "  Kolaborate Agent Economy Hackathon 2026"
echo "=================================================="
echo ""

# Smart Path Detection: Check if we are already inside the kola-agent folder
CURRENT_DIR=$(basename "$(pwd)")

if [ "$CURRENT_DIR" = "$PROJECT" ]; then
  echo "ℹ️  Already inside '$PROJECT' directory. Generating structure here."
  PROJECT_DIR="."
else
  PROJECT_DIR="$PROJECT"
  # Check if folder already exists
  if [ -d "$PROJECT" ]; then
    echo "⚠️  Folder '$PROJECT' already exists."
    read -p "   Overwrite and continue? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
      echo "Aborted."
      exit 0
    fi
  fi
  echo "🚀 Creating project directory: $PROJECT..."
  mkdir -p "$PROJECT"
fi

echo "🚀 Creating project structure..."
echo ""

# Move into the project directory if needed
if [ "$PROJECT_DIR" != "." ]; then
  cd "$PROJECT_DIR"
fi

# =============================================================================
# ROOT LEVEL FILES
# =============================================================================

touch .env.local
touch .env.example
touch .gitignore
touch .eslintrc.json
touch .prettierrc
touch next.config.ts
touch tailwind.config.ts
touch tsconfig.json
touch package.json
touch README.md
touch CHANGELOG.md
touch middleware.ts

echo "✅  Root files created"

# =============================================================================
# APP — Next.js App Router
# =============================================================================

# Root layout and page
mkdir -p app
touch app/layout.tsx
touch app/page.tsx
touch app/globals.css
touch app/loading.tsx
touch app/error.tsx
touch app/not-found.tsx

# Auth route group — Clerk sign-in / sign-up
mkdir -p "app/(auth)/sign-in/[[...sign-in]]"
mkdir -p "app/(auth)/sign-up/[[...sign-up]]"
touch "app/(auth)/layout.tsx"
touch "app/(auth)/sign-in/[[...sign-in]]/page.tsx"
touch "app/(auth)/sign-up/[[...sign-up]]/page.tsx"

# Main app route group — protected pages
mkdir -p "app/(main)/dashboard"
mkdir -p "app/(main)/onboarding"
mkdir -p "app/(main)/jobs/new"
mkdir -p "app/(main)/jobs/[jobId]"
mkdir -p "app/(main)/freelancer/profile"
mkdir -p "app/(main)/freelancer/upload-cv"
mkdir -p "app/(main)/matches/[matchId]"
mkdir -p "app/(main)/proposals/[proposalId]"
touch "app/(main)/layout.tsx"
touch "app/(main)/dashboard/page.tsx"
touch "app/(main)/dashboard/loading.tsx"
touch "app/(main)/onboarding/page.tsx"
touch "app/(main)/jobs/new/page.tsx"
touch "app/(main)/jobs/[jobId]/page.tsx"
touch "app/(main)/jobs/[jobId]/loading.tsx"
touch "app/(main)/freelancer/profile/page.tsx"
touch "app/(main)/freelancer/upload-cv/page.tsx"
touch "app/(main)/matches/[matchId]/page.tsx"
touch "app/(main)/proposals/[proposalId]/page.tsx"

echo "✅  App pages created"

# =============================================================================
# API ROUTES — Backend endpoints
# =============================================================================

# Agent — core agent loop (streaming)
mkdir -p app/api/agent/run
touch app/api/agent/run/route.ts

# CV — upload and parse pipeline
mkdir -p app/api/cv/upload
mkdir -p app/api/cv/parse
touch app/api/cv/upload/route.ts
touch app/api/cv/parse/route.ts

# Jobs — job management
mkdir -p app/api/jobs/create
mkdir -p app/api/jobs/publish
touch app/api/jobs/create/route.ts
touch app/api/jobs/publish/route.ts

# Matches — matching results
mkdir -p app/api/matches/fetch
touch app/api/matches/fetch/route.ts

# Notifications — outbound messaging
mkdir -p app/api/notify/telegram
mkdir -p app/api/notify/whatsapp
touch app/api/notify/telegram/route.ts
touch app/api/notify/whatsapp/route.ts

# PDF — export endpoint
mkdir -p app/api/pdf/export
touch app/api/pdf/export/route.ts

# Webhooks — Clerk user sync
mkdir -p app/api/webhooks/clerk
touch app/api/webhooks/clerk/route.ts

# Embeddings — vector generation
mkdir -p app/api/embeddings/generate
touch app/api/embeddings/generate/route.ts

echo "✅  API routes created"

# =============================================================================
# COMPONENTS — Reusable UI Components
# =============================================================================

# UI primitives — base design system components
mkdir -p components/ui
touch components/ui/button.tsx
touch components/ui/input.tsx
touch components/ui/textarea.tsx
touch components/ui/card.tsx
touch components/ui/badge.tsx
touch components/ui/avatar.tsx
touch components/ui/separator.tsx
touch components/ui/skeleton.tsx
touch components/ui/toast.tsx
touch components/ui/toaster.tsx
touch components/ui/progress.tsx
touch components/ui/dialog.tsx
touch components/ui/dropdown-menu.tsx
touch components/ui/select.tsx
touch components/ui/tabs.tsx
touch components/ui/tooltip.tsx
touch components/ui/label.tsx
touch components/ui/alert.tsx
touch components/ui/scroll-area.tsx
touch components/ui/spinner.tsx

# Layout components
mkdir -p components/layout
touch components/layout/navbar.tsx
touch components/layout/sidebar.tsx
touch components/layout/sidebar-nav.tsx
touch components/layout/page-header.tsx
touch components/layout/page-wrapper.tsx
touch components/layout/section.tsx

# Agent components — the star of the show
mkdir -p components/agent
touch components/agent/agent-runner.tsx       # orchestrates the full agent run
touch components/agent/agent-log.tsx          # live step-by-step ticker
touch components/agent/agent-log-item.tsx     # single log line
touch components/agent/agent-status-badge.tsx # running / complete / error
touch components/agent/agent-tool-icon.tsx    # icon per tool type

# Job components — job brief and scope
mkdir -p components/jobs
touch components/jobs/brief-input.tsx         # raw brief text area + submit
touch components/jobs/scope-card.tsx          # structured scope display
touch components/jobs/scope-clarity-score.tsx # 0-100 score with breakdown
touch components/jobs/deliverables-list.tsx   # list of extracted deliverables
touch components/jobs/red-flags-panel.tsx     # flagged issues
touch components/jobs/budget-breakdown.tsx    # line-item budget table
touch components/jobs/timeline-card.tsx       # project phases and timeline
touch components/jobs/job-status-badge.tsx    # draft / published / matched
touch components/jobs/job-card.tsx            # summary card for job list

# Freelancer components — profile and CV
mkdir -p components/freelancer
touch components/freelancer/cv-upload-zone.tsx       # drag-and-drop CV upload
touch components/freelancer/cv-processing-status.tsx # parse progress states
touch components/freelancer/profile-card.tsx          # freelancer summary card
touch components/freelancer/profile-editor.tsx        # editable profile fields
touch components/freelancer/skills-list.tsx           # extracted skills display
touch components/freelancer/experience-badge.tsx      # seniority indicator
touch components/freelancer/rate-range-display.tsx    # hourly rate range

# Matching components — match results
mkdir -p components/matching
touch components/matching/match-results-panel.tsx     # top 3 matches container
touch components/matching/match-card.tsx              # single candidate card
touch components/matching/match-score-ring.tsx        # circular score indicator
touch components/matching/fit-explanation.tsx         # why this person fits
touch components/matching/skill-gap-list.tsx          # missing skills
touch components/matching/rate-suggestion-card.tsx    # suggested rate + reason

# Proposal components — proposal generation and display
mkdir -p components/proposals
touch components/proposals/proposal-generator.tsx     # generate button + tone selector
touch components/proposals/tone-selector.tsx          # professional/confident/friendly
touch components/proposals/proposal-preview.tsx       # rendered proposal text
touch components/proposals/proposal-editor.tsx        # editable proposal text
touch components/proposals/proposal-actions.tsx       # copy / send / export buttons

# Notification components — notification status
mkdir -p components/notifications
touch components/notifications/notification-banner.tsx  # success/fail banner
touch components/notifications/channel-selector.tsx     # telegram / whatsapp
touch components/notifications/notification-log.tsx     # sent messages list

# PDF components — export UI
mkdir -p components/pdf
touch components/pdf/export-button.tsx         # trigger PDF generation
touch components/pdf/export-progress.tsx       # rendering state
touch components/pdf/scope-report-template.tsx # scope PDF layout
touch components/pdf/proposal-template.tsx     # proposal PDF layout

# Market data components — Tavily results display
mkdir -p components/market
touch components/market/rate-card.tsx          # live rate data display
touch components/market/rate-source-badge.tsx  # "Tavily live" vs "fallback"
touch components/market/region-selector.tsx    # Uganda / Kenya / Nigeria / SA

# Dashboard components — role-specific dashboards
mkdir -p components/dashboard
touch components/dashboard/client-dashboard.tsx
touch components/dashboard/freelancer-dashboard.tsx
touch components/dashboard/stats-card.tsx
touch components/dashboard/recent-activity.tsx
touch components/dashboard/quick-actions.tsx

# Onboarding components — first-time setup
mkdir -p components/onboarding
touch components/onboarding/role-selector.tsx        # client or freelancer
touch components/onboarding/onboarding-steps.tsx     # step progress indicator
touch components/onboarding/contact-setup.tsx        # telegram / whatsapp number

# Common / shared components
mkdir -p components/common
touch components/common/empty-state.tsx        # no data placeholder
touch components/common/error-boundary.tsx     # error catch wrapper
touch components/common/loading-dots.tsx       # animated loading indicator
touch components/common/copy-button.tsx        # copy to clipboard
touch components/common/confirm-dialog.tsx     # destructive action confirmation
touch components/common/file-size-display.tsx  # readable file size
touch components/common/timestamp.tsx          # formatted date/time
touch components/common/avatar-group.tsx       # stacked avatars
touch components/common/step-indicator.tsx     # numbered step display

echo "✅  Components created"

# =============================================================================
# LIB — Business Logic and Utilities
# =============================================================================

mkdir -p lib

# Agent — core agent orchestration
mkdir -p lib/agent
touch lib/agent/loop.ts             # the main while(true) tool-calling loop
touch lib/agent/prompt.ts           # system prompt builder
touch lib/agent/tools.ts            # tool definitions array (schemas)
touch lib/agent/executor.ts         # routes tool calls to implementations
touch lib/agent/stream.ts           # SSE streaming helper
touch lib/agent/types.ts            # AgentStep, ToolCall, AgentResult types

# Tools — individual tool implementations
mkdir -p lib/tools
touch lib/tools/search-market-rates.ts   # Tavily web search
touch lib/tools/fetch-matched-freelancers.ts  # Convex vector search
touch lib/tools/score-candidate.ts       # LLM-judged scoring
touch lib/tools/structure-brief.ts       # raw brief → structured scope
touch lib/tools/write-proposal.ts        # tailored proposal generator
touch lib/tools/notify-stakeholder.ts    # dispatch to telegram/whatsapp
touch lib/tools/export-pdf.ts            # jsPDF packaging

# Convex client helpers
mkdir -p lib/convex
touch lib/convex/client.ts          # Convex client singleton
touch lib/convex/auth.ts            # requireUser helper
touch lib/convex/queries.ts         # typed query wrappers
touch lib/convex/mutations.ts       # typed mutation wrappers

# DeepSeek API helpers
mkdir -p lib/deepseek
touch lib/deepseek/client.ts          # DeepSeek SDK client singleton (OpenAI compatible)
touch lib/deepseek/embeddings.ts      # text → vector embedding
touch lib/deepseek/parse-cv.ts        # CV text → FreelancerProfile
touch lib/deepseek/rate-limiter.ts    # request rate limiting

# Tavily — web search grounding
mkdir -p lib/tavily
touch lib/tavily/client.ts          # Tavily API client
touch lib/tavily/search.ts          # search with retry and fallback
touch lib/tavily/parser.ts          # extract rate data from results

# Notifications
mkdir -p lib/notifications
touch lib/notifications/telegram.ts      # Telegram Bot API wrapper
touch lib/notifications/whatsapp.ts      # WPPConnect wrapper
touch lib/notifications/dispatcher.ts    # routes to correct channel
touch lib/notifications/templates.ts     # message template strings

# PDF generation
mkdir -p lib/pdf
touch lib/pdf/generator.ts          # jsPDF orchestrator
touch lib/pdf/scope-report.ts       # scope report renderer
touch lib/pdf/proposal-doc.ts       # proposal document renderer
touch lib/pdf/styles.ts             # shared PDF styles and branding

# Rate card — Africa-specific fallback pricing
mkdir -p lib/rate-card
touch lib/rate-card/index.ts        # rate card lookup function
touch lib/rate-card/regions.ts      # per-region rate data
touch lib/rate-card/adjuster.ts     # Western rate bias correction

# Validation — input sanitisation
mkdir -p lib/validation
touch lib/validation/brief.ts       # job brief validation
touch lib/validation/cv.ts          # CV file validation
touch lib/validation/user.ts        # user profile validation
touch lib/validation/env.ts         # environment variable validation

# Utilities
mkdir -p lib/utils
touch lib/utils/cn.ts               # Tailwind class merger (clsx + twmerge)
touch lib/utils/format.ts           # currency, date, file size formatters
touch lib/utils/truncate.ts         # text truncation helper
touch lib/utils/sleep.ts            # async sleep utility
touch lib/utils/retry.ts            # exponential backoff retry wrapper
touch lib/utils/sanitize.ts         # HTML and input sanitisation
touch lib/utils/logger.ts           # structured console logger (dev only)

# Constants
mkdir -p lib/constants
touch lib/constants/regions.ts      # Africa region list and labels
touch lib/constants/skill-categories.ts  # skill taxonomy
touch lib/constants/agent-steps.ts  # step name → display label map
touch lib/constants/routes.ts       # all app route paths

# Error handling
mkdir -p lib/errors
touch lib/errors/api-error.ts       # typed API error class
touch lib/errors/agent-error.ts     # agent-specific error types
touch lib/errors/handler.ts         # global error handler

echo "✅  Lib files created"

# =============================================================================
# CONVEX — Database Schema and Functions
# =============================================================================

mkdir -p convex

touch convex/schema.ts              # full database schema with indexes
touch convex/auth.config.ts         # Clerk → Convex JWT config
mkdir -p convex/_generated
touch convex/_generated/.gitkeep    # Convex auto-generates this folder

# Database functions — organised by entity
mkdir -p convex/functions
touch convex/functions/users.ts         # getOrCreateUser, updateRole
touch convex/functions/freelancers.ts   # create, update, getByUserId
touch convex/functions/jobs.ts          # create, publish, getById, list
touch convex/functions/matches.ts       # create, vectorSearch, rank
touch convex/functions/proposals.ts     # create, update, getByMatch
touch convex/functions/notifications.ts # log, getByUser
touch convex/functions/embeddings.ts    # store and retrieve vectors

echo "✅  Convex files created"

# =============================================================================
# HOOKS — Custom React Hooks
# =============================================================================

mkdir -p hooks
touch hooks/use-agent-stream.ts     # SSE stream consumer for agent log
touch hooks/use-cv-upload.ts        # CV file upload with progress
touch hooks/use-clipboard.ts        # copy to clipboard with feedback
touch hooks/use-pdf-export.ts       # trigger and track PDF generation
touch hooks/use-notification.ts     # send and track notifications
touch hooks/use-role.ts             # get current user's role from Clerk
touch hooks/use-convex-user.ts      # get current user from Convex
touch hooks/use-debounce.ts         # debounce input changes
touch hooks/use-local-storage.ts    # type-safe localStorage access
touch hooks/use-media-query.ts      # responsive breakpoint detection

echo "✅  Hooks created"

# =============================================================================
# TYPES — Shared TypeScript Type Definitions
# =============================================================================

mkdir -p types
touch types/agent.ts            # AgentStep, AgentTool, AgentResult, AgentStatus
touch types/user.ts             # User, UserRole, UserProfile
touch types/freelancer.ts       # FreelancerProfile, Seniority, CVParseResult
touch types/job.ts              # Job, JobStatus, StructuredScope, RedFlag
touch types/match.ts            # Match, MatchScore, CandidateRanking
touch types/proposal.ts         # Proposal, ProposalTone, ProposalStatus
touch types/notification.ts     # Notification, NotificationChannel
touch types/market.ts           # MarketRate, RateCard, RegionRates
touch types/pdf.ts              # PDFDocument, PDFSection, ExportOptions
touch types/api.ts              # ApiResponse, ApiError, StreamEvent
touch types/convex.ts           # Convex document type helpers
touch types/env.d.ts            # process.env type declarations

echo "✅  Types created"

# =============================================================================
# CONFIG — Configuration Files
# =============================================================================

mkdir -p config
touch config/site.ts            # app name, description, URLs
touch config/nav.ts             # sidebar and navbar link definitions
touch config/agent.ts           # agent timeout, max steps, retry config
touch config/notification.ts    # notification templates and rate limits

echo "✅  Config files created"

# =============================================================================
# DATA — Seed Data and Static Assets
# =============================================================================

mkdir -p data/seed
touch data/seed/freelancers.json     # 5 demo freelancer profiles
touch data/seed/jobs.json            # 3 demo job briefs for testing
touch data/rate-card.json            # Africa-specific fallback rates
touch data/skill-taxonomy.json       # canonical skill names list

echo "✅  Data files created"

# =============================================================================
# SCRIPTS — Local Server Scripts
# =============================================================================

mkdir -p scripts
touch scripts/whatsapp-server.ts     # WPPConnect local WhatsApp server
touch scripts/seed-database.ts       # seeds Convex with demo data
touch scripts/test-agent.ts          # runs agent with a test brief
touch scripts/test-notifications.ts  # fires test Telegram + WhatsApp messages

echo "✅  Scripts created"

# =============================================================================
# PUBLIC — Static Assets
# =============================================================================

mkdir -p public/images
mkdir -p public/icons
mkdir -p public/fonts

touch public/images/logo.svg
touch public/images/logo-dark.svg
touch public/images/og-image.png
touch public/icons/favicon.ico
touch public/icons/icon-192.png
touch public/icons/icon-512.png

echo "✅  Public assets created"

# =============================================================================
# WRITE .gitignore
# =============================================================================

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables — NEVER commit these
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Next.js
.next/
out/
build/

# Convex generated files
convex/_generated/

# WPPConnect session data — contains WhatsApp auth tokens
.wppconnect/
wppconnect-session/

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V3
.Trashes
Thumbs.db

# Editor
.vscode/settings.json
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# TypeScript
*.tsbuildinfo

# Testing
coverage/
.nyc_output/

# Misc
.vercel
*.pem
EOF

echo "✅  .gitignore written"

# =============================================================================
# WRITE .env.example
# =============================================================================

cat > .env.example << 'EOF'
# =============================================================
# KolaAgent Environment Variables
# Copy this file to .env.local and fill in your values
# NEVER commit .env.local to git
# =============================================================

# --- DeepSeek API ---
# Get from: https://platform.deepseek.com
DEEPSEEK_API_KEY=

# --- Convex (Database) ---
# Get from: https://dashboard.convex.dev
NEXT_PUBLIC_CONVEX_URL=

# --- Clerk (Authentication) ---
# Get from: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# --- Tavily (Web Search Grounding) ---
# Get from: https://app.tavily.com
TAVILY_API_KEY=

# --- Telegram (Notifications) ---
# Get token from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=
# Your personal chat ID for testing — message @userinfobot
TELEGRAM_TEST_CHAT_ID=

# --- WPPConnect (WhatsApp — Optional) ---
# Session name for your local WhatsApp connection
WPPCONNECT_SESSION_NAME=kola-agent
# Port for the local WPPConnect server
WPPCONNECT_PORT=3001

# --- App ---
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KolaAgent
EOF

echo "✅  .env.example written"

# =============================================================================
# WRITE .prettierrc
# =============================================================================

cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
EOF

echo "✅  .prettierrc written"

# =============================================================================
# WRITE .eslintrc.json
# =============================================================================

cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
EOF

echo "✅  .eslintrc.json written"

# =============================================================================
# PRINT FINAL SUMMARY
# =============================================================================

echo ""
echo "=================================================="
echo "  ✅ KolaAgent structure generated successfully"
echo "=================================================="
echo ""
echo "📁 Project: $(pwd)"
echo ""
echo "📊 Summary:"
echo "   $(find . -type f | wc -l | tr -d ' ') files created"
echo "   $(find . -type d | wc -l | tr -d ' ') directories created"
echo ""
echo "🔧 Next steps:"
echo ""
echo "   1. cd kola-agent"
echo "   2. npx create-next-app@latest . --typescript --tailwind --app --src-dir no --import-alias '@/*'"
echo "      (when prompted, say YES to all options)"
echo "   3. npm install openai @modelcontextprotocol/sdk"
echo "   4. npm install convex @clerk/nextjs"  
echo "   5. npm install node-telegram-bot-api @wppconnect-team/wppconnect"
echo "   6. npm install pdf-parse jspdf html2canvas"
echo "   7. npm install clsx tailwind-merge lucide-react"
echo "   8. npm install --save-dev @types/node-telegram-bot-api @types/pdf-parse"
echo "   9. cp .env.example .env.local  — then fill in your API keys"
echo "  10. npx convex dev  — to initialise your Convex database"
echo "  11. git init && git add . && git commit -m 'chore: initial project structure'"
echo ""
echo "📚 Refer to KolaAgent-Step-by-Step-Guide.md for full build instructions"
echo ""
echo "Good luck — let's win this. 🏆"
echo ""
