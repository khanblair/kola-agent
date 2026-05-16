# KolaAgent — Complete Build Guide
## Step-by-Step Project Guide · No Code · Agent Economy Hackathon
### Kolaborate Build Challenge · May 19–25, 2026

---

## Before You Start: Understanding What You Are Building

KolaAgent is not a chatbot. It is not a form that calls an API. It is an
autonomous agent — a system that receives one instruction, breaks it into
decisions, executes those decisions using tools, and returns a complete
professional output without asking for help in between.

The difference matters because the judges specifically said:
"The agent must autonomously complete a multi-step professional task
with minimal human input." A chatbot that waits for the user between
every step will not place. KolaAgent runs start to finish on its own.

Think of it like hiring a very capable assistant. You hand them a job
brief and say "handle this." They go away, research the client, read
your CV, write your proposal, send the notifications, and come back
with a finished package. You did not help. That is the bar.

---

## The Project At a Glance

**What the user does:** Paste a job brief or URL. Click one button.

**What KolaAgent does autonomously:**
1. Searches the web for real African market rates for this type of project
2. Reads the job brief and structures it into a clean scope document
3. Searches the database for the best-matching freelancer by semantic similarity
4. Scores the top candidates and explains why each is or is not a fit
5. Generates a tailored proposal personalised to the winning freelancer's CV
6. Recommends a rate grounded in real market data, not guesses
7. Sends a notification to the freelancer via Telegram or WhatsApp
8. Packages everything into a downloadable PDF

**What the user receives:** A complete proposal package. No manual work.

---

## Project Structure Overview

Your project has four main zones. Understanding these zones before you
touch any code will save you from confusion later.

### Zone 1 — The Frontend (What users see)
This is the visual layer. It has three main screens: the client screen
where a job brief is submitted, the agent log screen where users watch
the agent work in real time, and the results screen where the final
output is displayed and downloaded. Built with Next.js and Tailwind CSS.

### Zone 2 — The Backend (What runs on the server)
This is where the agent loop lives. When the user clicks the button,
a request hits the backend. The backend starts the Claude agent,
manages the tool-calling loop, executes each tool as the agent requests
it, and streams the results back to the frontend in real time.
Built with Next.js API Routes — no separate server needed.

### Zone 3 — The Database (Where data lives)
This is where freelancer profiles, job posts, match results, and
proposals are stored permanently. Not JSON files on disk — a real
cloud database with proper indexes and authentication checks.
Built with Convex.

### Zone 4 — The Tools (What the agent can do)
These are the individual capabilities the agent can choose to call.
Each tool is a discrete function: search the web, fetch freelancers,
score a candidate, write a proposal, send a notification, export a PDF.
The agent decides which tool to call next based on what it has learned
so far. Built as MCP-compatible tool definitions.

---

## Part 1 — Project Setup

### Step 1.1 — Create Your Project Folder

Start by creating a new Next.js project. Name it something clean and
professional — this name will appear in your GitHub repository URL
which judges will visit. A name like `kolaagent` or `kola-agent` is
appropriate. Avoid generic names like `hackathon-project`.

Choose TypeScript when prompted. TypeScript is not optional — the
judges specifically praised TypeScript usage and penalised weak typing
in the last cohort.

Choose the App Router when prompted. This is the modern Next.js
architecture and the one Kolaborate uses internally.

Choose Tailwind CSS when prompted. This handles all your styling
without needing a separate CSS file system.

### Step 1.2 — Set Up Your Environment Variables File

Create a file called `.env.local` in the root of your project.
This file will hold all your secret keys. It must never be committed
to GitHub — confirm your `.gitignore` file already lists it.

You will need slots for the following keys. You do not need to fill
them all immediately — add them as you set up each service:

- Your Anthropic API key (for Claude)
- Your Convex deployment URL
- Your Clerk publishable key
- Your Clerk secret key
- Your Tavily API key (for web search grounding)
- Your Telegram bot token
- Your Telegram chat ID for testing
- Your WPPConnect session name (for WhatsApp, added later)

### Step 1.3 — Plan Your Folder Structure Before Writing Anything

Before creating any files, decide where everything lives. A confused
folder structure causes bugs that are very hard to find under time
pressure. The structure that works for this project is:

Your `app` folder holds all pages and API routes. Inside it, create
route groups for authentication pages and main application pages.
Create an `api` folder inside `app` for your backend endpoints —
specifically an `agent` endpoint where the main loop runs, a `cv`
endpoint where CV uploads are processed, and a `notify` endpoint
where notification requests are handled.

Your `components` folder holds all reusable UI pieces. The most
important ones are the AgentLog component (the live step ticker),
the BriefInput component (the job input form), the ResultPanel
component (the final output display), the CVUpload component, and
the FreelancerCard component.

Your `lib` folder holds all non-UI logic. Inside it, create a
`tools` subfolder for each individual agent tool, an `agent` file
for the main loop logic, a `notifications` folder for Telegram and
WhatsApp, and a `pdf` file for export logic.

Your `convex` folder is created automatically when you set up Convex.
It holds your database schema and all database query/mutation functions.

Your `data` folder holds your seed data — the five demo freelancer
profiles you will use for testing before real CVs are uploaded.

### Step 1.4 — Initialise Git Immediately

Create your GitHub repository now, before writing any code. Push your
empty project. From this point forward, commit every time you complete
a meaningful step — not just at the end of each day. The judges
reviewed commit history and noted that kolamatch-intelligence had
"12 thoughtful conventional commits over five days." That pattern
signals a real build process, not a last-minute scramble.

Use conventional commit messages: `feat:`, `fix:`, `chore:`, `docs:`.
For example: `feat: add Convex schema for freelancers and jobs` or
`feat: implement Tavily grounding tool for market rate search`.

---

## Part 2 — Authentication (Day 1 Priority)

Authentication was your lowest score last time. Fix it first so you
are not rushed at the end.

### Step 2.1 — Create a Clerk Account

Go to clerk.com and create a free account. Create a new application.
Name it KolaAgent. Choose Email and Google as sign-in methods — these
are the most universally accessible for African users.

Once created, Clerk gives you two keys: a publishable key and a secret
key. Add both to your `.env.local` file immediately.

### Step 2.2 — Understand What Clerk Does For You

Clerk handles everything authentication-related so you do not have to:
user registration, login, session management, password reset, and
identity verification on every API call. In your last project, you
stored an email in localStorage and called that authentication. Clerk
replaces that entirely with real, verified sessions.

Every user who signs in through Clerk gets a unique Clerk ID. This ID
is what you use to identify users throughout your database — never
store passwords yourself, never manage sessions yourself.

### Step 2.3 — Add Clerk to Your Next.js Project

Install the Clerk Next.js package. Wrap your entire application in
the Clerk provider. Add Clerk's middleware file to protect routes —
this middleware automatically checks if a user is signed in before
allowing them to access any protected page. Configure which routes are
public (the landing page and sign-in page) and which require login
(everything else).

### Step 2.4 — Create Sign-In and Sign-Up Pages

Clerk provides pre-built UI components for sign-in and sign-up.
Use them. Do not build your own login form — that is wasted time.
Place the sign-in component on a `/sign-in` route and the sign-up
component on a `/sign-up` route. Clerk handles the entire flow.

### Step 2.5 — Define User Roles

KolaAgent has two types of users: clients (who post jobs) and
freelancers (who receive matches and proposals). When a user signs up,
ask them to choose their role. Store this role in Clerk's user metadata.
Every subsequent page and API call checks this role to show the right
interface and allow the right actions.

---

## Part 3 — Database Setup With Convex (Day 1 Priority)

### Step 3.1 — Create a Convex Account

Go to convex.dev and create a free account. Create a new project.
Name it kolaagent. Convex gives you a deployment URL — add it to
your `.env.local` file.

Install the Convex package in your project and run the Convex
development command. This creates a `convex` folder in your project
automatically.

### Step 3.2 — Understand How Convex Works

Convex is a real-time database that lives in the cloud. Unlike JSON
files on disk (which break on Vercel) or traditional databases
(which require complex setup), Convex is designed for exactly this
kind of Next.js application.

You define your data structure in a schema file. Convex enforces that
structure — if you try to save data in the wrong shape, it rejects it.
This is what the judges meant by "real database with proper schema."

You write queries (for reading data) and mutations (for writing data)
as Convex functions. Your frontend calls these functions directly —
no REST API, no SQL, no manual connection management.

### Step 3.3 — Design Your Schema (Before Writing It)

Think carefully about what data you need to store and how it relates.
You have five main data types:

**Users** — everyone who has an account. Stores their Clerk ID, email,
name, and role (client or freelancer). The Clerk ID is the bridge
between Clerk's auth system and your database.

**Freelancer Profiles** — extended information about freelancer users.
Stores their extracted skills, years of experience, seniority level,
notable past projects, their region, the raw text of their CV, and
a numerical embedding (a list of numbers that represents their profile
for semantic matching). Also stores their Telegram chat ID and
WhatsApp number for notifications.

**Jobs** — project briefs posted by clients. Stores the raw brief text,
the structured scope the AI generated, the market rate data Tavily
returned, the job status (draft, published, matched, closed), and
a numerical embedding for matching against freelancer profiles.

**Matches** — the connection between a job and a freelancer. Stores
the match score, the AI's explanation of why this freelancer fits,
any identified skill gaps, the suggested rate, the generated proposal
text, the chosen proposal tone, and the match status.

**Notifications** — a log of every message sent. Stores who it was
sent to, which channel (Telegram or WhatsApp), the message content,
whether it was delivered, and when.

### Step 3.4 — Add Vector Indexes for Semantic Matching

This is the specific upgrade the judges recommended. A vector index
allows you to search for freelancers by meaning, not just by keywords.

When a job comes in requiring "mobile app development for logistics,"
a keyword search finds only freelancers who used those exact words.
A vector search finds freelancers whose profiles are semantically
similar — including someone whose CV says "built delivery tracking
systems for e-commerce" even if they never used the word "logistics."

Add a vector index on the freelancer profile's embedding field and
on the job's embedding field. Convex supports this natively.

### Step 3.5 — Connect Clerk to Convex

When a user signs in via Clerk, Convex needs to know who they are.
This connection is called a JWT bridge. Write a Convex mutation called
`getOrCreateUser` that runs whenever a user signs in. It checks if
a user with this Clerk ID already exists in the database. If yes,
return their profile. If no, create a new user record and return it.

This mutation runs automatically on every sign-in, keeping Clerk and
Convex perfectly synchronised.

---

## Part 4 — The Agent Brain (Day 2 Priority)

This is the core of the entire project. Everything else supports this.

### Step 4.1 — Understand the Tool-Calling Loop

Claude does not run your tools. You do. Claude tells you which tool
it wants to call and what inputs to pass. You run the tool. You give
Claude the result. Claude decides what to do next. This continues
until Claude says it is done.

The loop has four states:
- Claude is thinking (generating a response)
- Claude wants a tool (you run it and return the result)
- Claude is done (you return the final output to the user)
- Something went wrong (you handle the error gracefully)

Your backend API route manages this loop. It starts with the user's
job brief and does not stop until Claude has completed the full workflow.

### Step 4.2 — Write the System Prompt Carefully

The system prompt is the instruction set Claude operates under for
every agent run. It defines who Claude is, what it is trying to
accomplish, what tools it has available, and how it should behave.

The system prompt for KolaAgent should establish the following:

Claude is an autonomous freelance matching agent operating for the
Kolaborate Africa marketplace. Its goal is to complete the full
proposal workflow — from raw brief to packaged output — without
asking the user for additional input.

Claude must always begin by searching for real-time market rates
before making any financial estimates. It must never invent numbers.
If Tavily returns no useful results, it must fall back to the built-in
African rate card and say so explicitly.

Claude must match freelancers semantically, not by keyword. It must
explain its reasoning for every match score in plain English. It must
flag skill gaps honestly — not hide them to make a weaker match
look stronger.

Claude must complete all steps before returning. It must not stop
after proposal generation and forget to send notifications or export
the PDF.

Include the regional context: Kolaborate serves Uganda, Kenya, Nigeria,
and South Africa. Include the Mobile Money integration premium.
Include the instruction to adjust Western rate data downward when
the live search returns primarily US or European figures.

Do not include any database contents in the system prompt. The agent
fetches what it needs via tools.

### Step 4.3 — Define Each Tool

You have six tools. For each one, define three things: the name
(what Claude calls when it wants to use it), the description (what
the tool does, written clearly so Claude chooses it at the right
moment), and the input schema (what information Claude must provide
when calling it).

**Tool 1 — search_market_rates**
This tool calls the Tavily web search API with a query built from
the project type, required skills, and region. It returns the top
results including current market rate ranges from freelance platforms,
job boards, and industry reports. Claude uses this to ground every
budget estimate in real data.

**Tool 2 — fetch_matched_freelancers**
This tool takes the job description, converts it to an embedding,
and runs a vector similarity search against the freelancer database
in Convex. It returns the top three matches with their profiles,
skills, experience, and contact information. This is semantic
matching — not keyword filtering.

**Tool 3 — score_candidate**
This tool takes one freelancer profile and the structured job
requirements and asks Claude to reason about the match. It returns
a numerical score from 0 to 100, a plain-English explanation of
why this person fits, a list of any skill gaps, and a suggested
rate range based on their experience level and the market data
already retrieved. Claude calls this tool once per candidate.

**Tool 4 — write_proposal**
This tool takes the winning freelancer's profile, the structured
job scope, the market rate data, and the chosen tone (professional,
confident, or friendly). It generates a complete tailored proposal
that references the freelancer's specific past projects, addresses
the exact deliverables in the brief, and opens with a hook that
is not generic. The judges' own rubric praised proposals that
"explicitly banned generic openers."

**Tool 5 — notify_stakeholder**
This tool sends a message to either the client or the freelancer
via either Telegram or WhatsApp. It takes the recipient type,
the channel, the message content, and a dashboard link. It logs
the notification to the Convex notifications table regardless of
whether delivery succeeds, so there is always a record.

**Tool 6 — export_pdf**
This tool packages the complete output — scope report, match
results, proposal, rate recommendation — into a formatted PDF.
It takes the document type and all content, renders it using
jsPDF, and returns a download link. The PDF header includes
KolaAgent and Kolaborate branding.

### Step 4.4 — Stream the Agent Log to the Frontend

As the agent runs, each tool call must appear in real time on
the user's screen. Do not wait until the agent finishes and return
everything at once — that produces a blank screen for 30 seconds
followed by a wall of text. That is not a demo. That is a loading spinner.

Use Next.js streaming responses to push each agent step to the
frontend as it happens. When Claude requests a tool, push a "running"
event. When the tool completes, push a "complete" event with a
human-readable summary. The AgentLog component on the frontend
receives these events and displays them as a live ticker.

This streaming log is the single most important UI element in your
entire project. It is what makes autonomy visible. It is what judges
will screenshot. Build it early and make sure it works before
building anything else.

---

## Part 5 — Freelancer CV Upload and Profile Pipeline (Day 3)

### Step 5.1 — Build the CV Upload Screen

Create a dedicated screen for freelancers to upload their CV.
This screen is only visible to users with the freelancer role.
It should accept PDF files only — no Word documents, no images.
Show the file name after selection and a clear upload button.
Show a progress indicator while the CV is being processed.

### Step 5.2 — Understand What Happens to the CV

When a CV is uploaded, four things happen in sequence:

First, the PDF is read and its text content is extracted. The raw
text of a CV is often messy — headers, bullet points, dates, and
skills all mixed together. That is fine. Claude reads messy text well.

Second, the extracted text is sent to Claude with a specific instruction:
pull out the freelancer's name, list of skills, years of experience,
seniority level (junior, mid, or senior), and their most notable past
projects. Return this as structured data, not prose.

Third, the structured profile is sent to an embedding model to generate
a vector — a list of numbers that mathematically represents the meaning
of this profile. This vector is what enables semantic matching later.

Fourth, the structured profile and the vector are saved to the Convex
freelancers table. The freelancer is now in the matching pool.

### Step 5.3 — Seed Five Demo Profiles

For testing, create five demo freelancer profiles manually so you do
not need to upload real CVs during development. Cover these five
skill areas: full-stack web development, mobile app development,
UI/UX design, data analysis, and graphic design. Give each profile
a realistic Ugandan or East African name, a believable skill set,
and two or three past project descriptions.

Store these profiles directly in Convex using a seed script you can
run once. They will be present in the matching pool immediately.

### Step 5.4 — Show the Freelancer Their Profile

After upload, show the freelancer a summary of what the AI extracted
from their CV: their detected skills, their inferred seniority level,
and their notable projects. Let them edit any field that was extracted
incorrectly. Save the corrections to Convex. This step costs very little
time to build and prevents the matching from being poisoned by a
misread CV.

---

## Part 6 — The Tavily Grounding Integration (Day 2, Critical)

### Step 6.1 — Create a Tavily Account

Go to tavily.com and create a free account. Tavily is a search API
built specifically for AI applications — it returns clean, structured
results that are easy for Claude to read, unlike raw Google results.
The free tier gives you enough searches for development and demo.

Add your Tavily API key to your `.env.local` file.

### Step 6.2 — Understand Why This Is Your Competitive Moat

The judges wrote this in the evaluation report: "Only one submission
used live web search to ground its AI outputs in real-time market data.
For an AI-for-freelancers hackathon in 2026, this should arguably have
been more common. Future briefs might explicitly call out grounding
as a scoring axis."

They are telling you that in the next hackathon, grounding will be
a named criterion. You already do it. Every other team will scramble
to add it. You double down.

### Step 6.3 — Design Your Search Queries Carefully

When the agent calls the search_market_rates tool, the query sent
to Tavily must be specific enough to return useful results. A bad
query like "web developer rates" returns generic global information.
A good query like "mobile app developer hourly rate Uganda Kenya 2025
freelance" returns regionally relevant data.

Build your query from three pieces of information: the primary skill
required by the job, the project type (mobile, web, data, design),
and the client's region if known, defaulting to East Africa.

### Step 6.4 — Handle the Africa Rate Bias Problem

Most search results for developer rates are US or European-centric.
A search for "UI/UX designer hourly rate" will return $75–150/hr
figures that are completely misaligned with the Kolaborate market.

Your system prompt must instruct Claude to recognise this bias and
adjust. If the returned rates are primarily from the US, UK, or
Western Europe, Claude should apply the regional adjustment: reduce
by 40–60% for East African market context, and note this adjustment
explicitly in the output so the client understands the reasoning.

Also maintain a static fallback rate card in your code for when
Tavily returns no useful results. The fallback covers Uganda, Kenya,
Nigeria, and South Africa with ranges for each major skill category.
Claude uses this fallback only when live data is unavailable,
and always says so when it does.

---

## Part 7 — Notifications (Day 5)

### Step 7.1 — Set Up Telegram First

Telegram is your primary notification channel because it is completely
reliable, requires no phone scanning, has no ban risk, and takes
under five minutes to set up.

Open Telegram and search for BotFather. Send it the command `/newbot`.
Follow the prompts — give your bot a name (KolaAgent) and a username.
BotFather gives you a token. Add it to your `.env.local` file.

To get your chat ID for testing, search for the userinfobot in
Telegram and message it. It returns your numeric chat ID. Add this
to your `.env.local` file as your test recipient.

### Step 7.2 — Understand the Two Notification Moments

There are exactly two points in the KolaAgent workflow where
notifications fire:

The first is when a job is scoped and matched. The top matched
freelancer receives a message telling them a new project matches
their skills, the estimated budget range, and a link to their
dashboard to view the scope and generate their proposal.

The second is when a proposal is generated and ready. The client
receives a message telling them their job has a matched proposal
ready, who it is from, and a link to their dashboard to review it.

Both messages should be concise, contain a clear call to action,
and include the dashboard link. No long messages. Business happens
on mobile in Uganda — short messages get opened.

### Step 7.3 — Set Up WhatsApp via WPPConnect

WhatsApp is your secondary channel, included because it is the
dominant business communication tool across Africa and because
you built it into KolaMatch successfully.

WPPConnect runs as a separate local Node.js script alongside your
main Next.js application. It connects to WhatsApp Web by scanning
a QR code once with your phone. After the initial scan, the session
persists on your machine until it is manually disconnected.

Create a separate script file for the WPPConnect server. It starts
a local server on a different port from your main application.
When the main application needs to send a WhatsApp message, it makes
an internal HTTP request to this local server. The local server
forwards the message to WhatsApp.

Be aware of the risk: WPPConnect uses an unofficial WhatsApp
connection. Meta does not sanction it and can ban the connected
number if it detects unusual activity. For demo purposes, use a
secondary phone number, not your primary number. Do not send
messages at high volume. The judges already know this risk and
accepted it — they noted it in the report but did not penalise
for it at the prototype stage.

### Step 7.4 — Build a Notification Preference System

Let users choose their preferred notification channel during
onboarding: Telegram, WhatsApp, or both. Store this preference
in their Convex profile. When the notify_stakeholder tool fires,
check the recipient's preference and route accordingly.

If both channels are selected, send to Telegram first (more
reliable). Send to WhatsApp as a secondary confirmation.

---

## Part 8 — PDF Export (Day 5)

### Step 8.1 — Decide What Goes in Each Document

KolaAgent produces two PDF documents per completed workflow:

**The Scope Report** is for the client. It contains the original
raw brief they submitted, the AI-generated structured scope with
deliverables and timeline, the Scope Clarity Score with explanations,
the budget range with line-item breakdown showing how the number
was calculated, the real-time market rate data from Tavily showing
the source and retrieval date, any red flags identified, and the
top three freelancer matches with their scores and fit explanations.

**The Proposal Package** is for the freelancer. It contains the
structured job scope so the freelancer has the clean version to
reference, their match score and why they were selected, the
tailored proposal text ready to send, the recommended rate with
justification, and any skill gaps identified with suggested learning
directions.

### Step 8.2 — Design the PDF Layout Before Building It

Sketch the layout on paper before writing any code. The PDF should
feel like a real business document — not a web page printed to PDF.

Use the Kolaborate brand colours for headers. Include the KolaAgent
logo and the date of generation in the header of every page.
Use clear section headings. Use a table for the budget breakdown.
Use a progress bar visual for the Scope Clarity Score. Keep margins
generous. Use a readable body font size.

### Step 8.3 — Implement the Export Button

Place an Export PDF button prominently on the results screen.
It should be visible without scrolling. When clicked, it generates
both documents simultaneously and triggers a download for each.
Show a brief loading state while the PDF renders — this takes
1–3 seconds and a blank button click with no feedback feels broken.

Label the downloaded files clearly: `KolaAgent-Scope-Report-[date].pdf`
and `KolaAgent-Proposal-[JobTitle]-[date].pdf`. Judges will open
these files. Named files look professional. `document(1).pdf` does not.

---

## Part 9 — The AgentLog UI (Build This First on Day 4)

### Step 9.1 — Why This Component Is Your Most Important Demo Asset

The judges cannot see your code running. They cannot see Claude
deciding which tool to call next. All they see is what appears on
screen. The AgentLog component makes the agent's invisible reasoning
visible. Without it, your project looks like a form that returns
a text block. With it, your project looks like a thinking system.

Build this component before the proposal generator, before PDF export,
before notifications. If you run out of time and can only finish
four things, the AgentLog is one of them.

### Step 9.2 — What the AgentLog Displays

The AgentLog is a dark-background panel that appears as soon as the
user clicks the Run Agent button. It updates in real time as the
agent progresses.

Each step in the log shows: a status icon (spinning for in-progress,
green check for complete, red X for error), the name of the tool
being called in a distinct colour, a human-readable summary of what
the tool is doing or what it returned, and the time taken in
milliseconds once complete.

Example of what a judge sees during the demo:

```
Agent Activity Log

✅  search_market_rates       East Africa mobile dev: $28–45/hr (Tavily, live data)
✅  structure_brief           Extracted 6 deliverables, 3 phases, 8-week timeline
✅  fetch_matched_freelancers  3 candidates retrieved via vector similarity search
✅  score_candidate           Alice M. — 91/100 · Senior Mobile Developer
✅  score_candidate           David K. — 78/100 · Mid Full-Stack
✅  score_candidate           Amara N. — 71/100 · Mid Backend
⚡  write_proposal            Drafting for Alice M. (professional tone)...
✅  write_proposal            340-word proposal complete
✅  notify_stakeholder        Telegram sent to Alice M. (+256 XXX)
✅  notify_stakeholder        Telegram sent to client
✅  export_pdf                Scope report and proposal packaged
```

The whole run takes 25–45 seconds. During that time the user watches
real work happening. That is your demo.

### Step 9.3 — The Final Results Screen

After the AgentLog completes, the results screen fades in below it.
It shows three panels side by side: the Scope Report summary on the
left, the top match card in the centre with the match score and
fit explanation, and the proposal preview on the right with a
character count and tone indicator.

Two large buttons at the bottom: Export PDFs and Send to Freelancer.
Both are already done by the time this screen appears — the buttons
simply confirm the actions that already happened automatically.

This distinction is important for the demo: the agent already sent
the notification and generated the PDF. The buttons are confirmations,
not triggers. That is what autonomous means.

---

## Part 10 — The README (Write This Last, Score 5/5)

### Step 10.1 — The Structure That Scores Full Marks

The judges gave 3/5 for README integrity last time because the tone
was hyperbolic and some claims were hard to verify. The fix is simple:
be completely literal. Say only what is implemented. Link every
feature to the file that implements it.

Your README must have these sections in this order:

**Project name and one-sentence description.** Not a marketing tagline.
A plain description of what the project does. Example: "KolaAgent is
an autonomous AI agent that takes a job brief and completes the full
freelancer proposal workflow — market research, candidate matching,
proposal writing, notifications, and PDF export — with no human input
between start and finish."

**What it does.** A numbered list of the eight autonomous steps.
Written as facts, not promises.

**Features with file paths.** Every documented feature must link to
the exact file where it is implemented. This is the most important
section for scoring. If you cannot provide a file path, remove the
feature from the README.

**What is not implemented.** A short, honest list of scope that was
intentionally deferred. This demonstrates maturity and honesty,
not weakness. Judges respect it explicitly — they gave 5/5 to
the submission that "explicitly marks the matching as deterministic MVP."

**Setup instructions.** Step by step, in plain language, covering
every environment variable needed and every service that must be
configured before the project runs. A judge should be able to clone
your repo and run it in under 15 minutes by following your README.

**Tech stack.** A clean table listing each technology and why you
chose it. No paragraph explanations needed — just the table.

### Step 10.2 — Words to Avoid

Do not use any of these words or phrases anywhere in your README:
State-of-the-Art, Elite, Revolutionary, Cutting-edge, Groundbreaking,
Best-in-class, Next-generation, Powerful, Seamless, Robust.

These words triggered the judge's comment about hyperbole last time.
Replace every adjective with a fact. Instead of "powerful AI matching,"
write "Claude-powered semantic matching via Convex vector indexes."
A fact is more impressive than an adjective.

---

## Part 11 — The 3-Minute Demo Video (Day 7)

### Step 11.1 — Script the Video Before Recording

Write your script before you open Loom. Know exactly what you will
say and do at every second. A scripted demo looks confident. An
unscripted demo rambles and runs long.

Your script structure:

**0:00–0:20 — The problem (20 seconds)**
State the problem in one sentence. "Freelancers on Kolaborate spend
hours writing proposals for jobs they're not sure they'll win. Clients
post vague briefs that attract mismatched applications. KolaAgent
fixes both — autonomously."

**0:20–0:45 — The input (25 seconds)**
Show the job brief input screen. Paste a realistic brief — use the
"Uber for logistics with mobile money integration" example or
something similar. Explain that this is all the human input
KolaAgent needs. Click the button.

**0:45–2:00 — The agent running (75 seconds)**
Watch the AgentLog together with the viewer. Narrate what each step
means in plain English. Point out the Tavily live data explicitly —
"notice it's pulling real East African market rates, not estimates."
Point out the vector matching — "it's matching semantically, not
by keywords." This 75 seconds is your entire technical demonstration.

**2:00–2:30 — The output (30 seconds)**
Show the results screen. Briefly show the scope report, the match
card with the score and explanation, and the proposal. Click Export
PDF and show the downloaded files.

**2:30–3:00 — The close (30 seconds)**
Show the Telegram notification that fired during the run. One sentence
on stack: "Built on Next.js, Convex, Clerk, and Claude — runs locally,
deploys to Vercel." One sentence on the story: "This is the production
version of KolaMatch Intelligence — same AI ambition, real database,
real auth, native tool calling."

### Step 11.2 — Recording Tips

Use Loom. Record your screen only — not your face. Faces add nothing
to a technical demo and create compression artifacts.

Set your browser zoom to 110% so everything is legible. Close all
other browser tabs. Turn off notifications on your machine. Use
a fast internet connection so Tavily results return quickly during
the recording. Have the job brief pre-typed in a separate text file
so you can paste it cleanly without typos.

Record in one take if possible. If you make a small mistake, keep
going — judges understand live demos. Stop and re-record only if
something fundamentally breaks.

---

## Part 12 — Submission Checklist

Use this checklist the morning of May 25, before the 23:59 EAT deadline.

### Code Quality
- [ ] TypeScript strict mode with zero type errors
- [ ] No `console.log` statements left in production code
- [ ] No hardcoded API keys in any file
- [ ] `.env.local` is in `.gitignore` and not committed
- [ ] All five demo freelancer profiles seeded in Convex
- [ ] Error states handled on all API routes (no unhandled crashes)
- [ ] Loading states shown on all async operations

### Authentication and Database
- [ ] Clerk sign-in and sign-up working
- [ ] Role selection (client / freelancer) working on first login
- [ ] Convex schema deployed with all tables and indexes
- [ ] Clerk to Convex JWT bridge working
- [ ] Server-side auth check on every API route

### Agent Functionality
- [ ] Full agent loop runs end to end without errors
- [ ] Tavily search returns results and Claude reads them
- [ ] Vector matching returns top 3 candidates
- [ ] Scoring runs for all 3 candidates
- [ ] Proposal generates successfully
- [ ] Telegram notification fires and is received
- [ ] PDF export downloads successfully

### Frontend
- [ ] AgentLog updates in real time during agent run
- [ ] Results screen displays after agent completes
- [ ] CV upload works and profile is saved to Convex
- [ ] Freelancer can see their extracted profile and edit it
- [ ] All buttons have loading states and error states

### Submission Materials
- [ ] GitHub repository is public
- [ ] README has every feature linked to its file path
- [ ] README has honest "not implemented" section
- [ ] README setup instructions work (test on a clean clone)
- [ ] Loom video is exactly 3 minutes or under
- [ ] Loom video is unlisted but accessible via link
- [ ] 200-word write-up is written and under 200 words
- [ ] Submission portal entry is complete before 23:59 EAT

---

## Common Mistakes to Avoid

**Mistake 1 — Building features before the agent loop works.**
The agent loop is everything. If it does not run, nothing else matters.
Do not touch the PDF export or the notifications until the core loop
completes successfully at least once.

**Mistake 2 — Leaving JSON files anywhere in the project.**
The judges will look for `loadData`, `readFileSync`, and `JSON.parse`
on file paths. If they find them, your Engineering score drops immediately.
All data goes through Convex. No exceptions.

**Mistake 3 — Documenting features you did not finish.**
If a feature is 80% done, either finish it or remove it from the README.
A partially working feature that is documented as complete is worse than
an honest "not implemented" note. The judges found this in two submissions
last time and penalised both.

**Mistake 4 — Forgetting to handle the WhatsApp session in the demo.**
If you demo WhatsApp, the WPPConnect session must be active before you
start recording. Scan the QR code, wait for the session to confirm,
then start Loom. A broken WhatsApp notification in the middle of your
demo video is the most avoidable failure point.

**Mistake 5 — Using adjectives instead of facts in the README.**
Every time you want to write "powerful" or "seamless," stop and replace
it with what the feature actually does. Judges are engineers. Facts
impress them. Marketing language makes them suspicious.

**Mistake 6 — Leaving CLAUDE.md or AGENTS.md in the repository.**
These files reveal AI-assisted scaffolding. The judges noted their
presence explicitly in the last evaluation. If Claude generated any
scaffold files, delete them before your final push. Declare AI
assistance in your write-up as the rules require, but do not leave
internal artefact files in the repo.

---

## The One Thing That Wins This

You already know what the judges look for. You already have code
they praised. You already know the exact three things that cost you
the full A. Every other team is guessing.

Fix Engineering from 1/5 to 5/5 by replacing JSON files with Convex
and localStorage auth with Clerk. That is the entire difference between
an A− and an A+. The AI work is already at 5/5. The scope is already
at 5/5. The build status is already at 5/5.

Two targeted fixes. One more win.

---

*KolaAgent · Built on KolaMatch Intelligence — Cohort I Winner*
*Next.js · Clerk · Convex · Claude API · Tavily · Telegram · WPPConnect · jsPDF*
*Kolaborate Agent Economy Hackathon · May 19–25, 2026*