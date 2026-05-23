import { Show, UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Users,
  FileText,
  Bell,
  FileDown,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Market Research',
    desc: 'Searches live African market rates using real-time web data',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Semantic Matching',
    desc: 'Finds the best freelancer by meaning, not just keywords',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Proposal Writing',
    desc: 'Generates a tailored proposal referencing real projects',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Notifications',
    desc: 'Sends alerts via Telegram or WhatsApp automatically',
  },
  {
    icon: <FileDown className="w-6 h-6" />,
    title: 'PDF Export',
    desc: 'Packages scope report and proposal for download',
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const user = await currentUser();
    if (!user?.publicMetadata?.role) {
      redirect('/onboarding');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-base">K</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              KolaAgent
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="sm:hidden p-2 rounded-lg bg-primary-600 text-white"
                aria-label="Dashboard"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
              <UserButton />
            </Show>

            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:text-foreground hover:bg-neutral-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </Show>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 lg:py-32 text-center bg-gradient-to-b from-primary-50/60 via-background to-background">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium mb-6">
          <Zap className="w-3.5 h-3.5" />
          Kolaborate Agent Economy Hackathon 2026
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight max-w-3xl leading-tight">
          One brief. Complete proposal package.{' '}
          <span className="text-primary-600">Zero manual work.</span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-foreground-muted max-w-xl leading-relaxed">
          KolaAgent is an autonomous AI agent that takes a job brief and
          completes the full freelancer proposal workflow for the African
          marketplace — start to finish, on its own.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Show when="signed-out">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-md"
            >
              Try KolaAgent
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-md"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Show>
          <Link
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl border border-border text-foreground-muted hover:text-foreground hover:border-border-hover transition-colors"
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="px-4 py-16 sm:py-24 bg-background-secondary">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              What the agent does autonomously
            </h2>
            <p className="mt-3 text-foreground-muted max-w-lg mx-auto">
              Paste a job brief. Click once. The agent handles everything below
              without asking for help.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-xl border border-border bg-background p-6 hover:shadow-lg hover:border-primary-200 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-foreground-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Result ── */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            The output
          </h2>
          <p className="mt-3 text-foreground-muted max-w-lg mx-auto">
            After a single click, the user receives a complete proposal
            package.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              'Structured scope report with deliverables and timeline',
              'Market-rate budget grounded in live African pricing data',
              'Top 3 freelancer matches with semantic similarity scores',
              'Tailored proposal referencing the freelancer\'s real projects',
              'Telegram and WhatsApp notifications already sent',
              'Downloadable PDF scope report and proposal',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-primary-50/50"
              >
                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-16 sm:py-20 bg-primary-600">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready to see it in action?
          </h2>
          <p className="mt-3 text-primary-100">
            Sign up, post a job brief, and watch the agent run — all 7 steps,
            completely autonomously.
          </p>
          <div className="mt-8">
            <Show when="signed-out">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-white text-primary-700 hover:bg-primary-50 transition-colors shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/jobs/new"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-white text-primary-700 hover:bg-primary-50 transition-colors shadow-lg"
              >
                Post a Job Brief
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Show>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-4 py-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-foreground-muted">
          <span>KolaAgent — Built for Kolaborate Africa</span>
          <span>Next.js · Clerk · Convex · Claude · Tavily</span>
        </div>
      </footer>
    </div>
  );
}
