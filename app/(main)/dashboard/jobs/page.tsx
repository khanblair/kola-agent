'use client';

import { useUser } from '@clerk/nextjs';
import { PageHeader } from '@/components/layout/page-header';
import type { UserRole } from '@/types/user';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, Briefcase, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyJobsPage() {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as UserRole) ?? 'client';

  // Fetch client's jobs in real-time
  const clientJobs = useQuery(
    api.functions.jobs.listByClient,
    role === 'client' ? {} : 'skip'
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="My Jobs"
          description="Manage your project briefs and find freelancer matches."
        />
        <Link href="/jobs/new">
          <Button className="flex items-center gap-2 self-start sm:self-auto bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-150">
            <Plus className="w-4 h-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      {clientJobs === undefined ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : clientJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
          <div className="p-4 bg-primary-50 text-primary-600 rounded-full">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-neutral-900">No jobs posted yet</h3>
            <p className="text-sm text-neutral-500 max-w-sm">
              Define a project scope using AI to find the perfect matched freelancers.
            </p>
          </div>
          <Link href="/jobs/new">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white">Get Started</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clientJobs.map((job) => {
            const scope = job.structuredScope;
            const title = scope?.roleTitle ?? 'AI Scoped Project';
            const budget = scope?.budgetEstMax 
              ? `$${scope.budgetEstMin} - $${scope.budgetEstMax}`
              : 'Scoping in progress...';
            const duration = scope?.durationWeeks 
              ? `${scope.durationWeeks} weeks`
              : '';

            return (
              <div key={job._id} className="group relative flex flex-col justify-between p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      job.status === 'published' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      job.status === 'matched' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      job.status === 'closed' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                    {job.region && (
                      <span className="flex items-center gap-1 text-xs text-neutral-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.region}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-neutral-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-neutral-500 line-clamp-2">
                      {job.briefText}
                    </p>
                  </div>

                  {scope && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-xs">
                      <div>
                        <p className="text-neutral-400">Budget</p>
                        <p className="font-medium text-neutral-805">{budget}</p>
                      </div>
                      {duration && (
                        <div>
                          <p className="text-neutral-400">Duration</p>
                          <p className="font-medium text-neutral-805">{duration}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100">
                  <Link href={`/jobs/${job._id}`} className="w-full block">
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2 group/btn">
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
