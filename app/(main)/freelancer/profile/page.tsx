'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { ProfileEditor } from '@/components/freelancer/profile-editor';
import { ProfileCard } from '@/components/freelancer/profile-card';
import { useConvexUser } from '@/hooks/use-convex-user';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Spinner } from '@/components/ui/spinner';
import type { FreelancerProfile } from '@/types/freelancer';
import { useState } from 'react';
import { Briefcase, GraduationCap, Award, Heart, Users } from 'lucide-react';

export default function FreelancerProfilePage() {
  const { convexUser, isLoaded, clerkId } = useConvexUser();
  const [saving, setSaving] = useState(false);

  const freelancerProfile = useQuery(
    api.functions.freelancers.getByUserId,
    clerkId ? { clerkId } : 'skip',
  );

  const handleSave = async (data: FreelancerProfile) => {
    setSaving(true);
    try {
      await fetch('/api/freelancers/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || freelancerProfile === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const profile = freelancerProfile as any;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="My Profile"
        description="Keep your skills and experience up to date for better matching."
      />

      {profile && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column: Compact Cards & Actions */}
          <div className="md:col-span-1 space-y-6">
            <ProfileCard
              name={convexUser ? (convexUser as any).name ?? 'Freelancer' : 'Freelancer'}
              profile={{
                skills: profile.skills ?? [],
                yearsOfExperience: profile.yearsOfExperience ?? 0,
                seniority: profile.seniority ?? 'mid',
                notableProjects: profile.notableProjects ?? [],
                region: profile.region ?? 'uganda',
                cvText: profile.cvText ?? '',
                hourlyRateMin: profile.hourlyRateMin,
                hourlyRateMax: profile.hourlyRateMax,
              }}
            />

            <Section title="Edit Profile">
              <ProfileEditor
                initial={profile ? {
                  skills: profile.skills,
                  yearsOfExperience: profile.yearsOfExperience,
                  seniority: profile.seniority,
                  notableProjects: profile.notableProjects,
                  region: profile.region,
                  hourlyRateMin: profile.hourlyRateMin,
                  hourlyRateMax: profile.hourlyRateMax,
                } : undefined}
                onSave={handleSave}
                loading={saving}
              />
            </Section>
          </div>

          {/* Right Column: Beautiful Parsed CV Sections */}
          <div className="md:col-span-2 space-y-6">
            {/* Work History */}
            {profile.workHistory && profile.workHistory.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-base">Work History</h3>
                </div>
                <div className="relative pl-6 border-l-2 border-indigo-50 space-y-6">
                  {profile.workHistory.map((item: string, idx: number) => {
                    const parts = item.split(',');
                    const role = parts[0]?.trim();
                    const company = parts.slice(1).join(',')?.trim();
                    return (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-indigo-600 bg-white" />
                        <p className="text-sm font-semibold text-neutral-800">{role}</p>
                        {company && <p className="text-xs text-neutral-500 mt-0.5">{company}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-base">Education</h3>
                </div>
                <div className="space-y-4">
                  {profile.education.map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start bg-neutral-50/50 p-3 rounded-xl border border-neutral-100/55">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-neutral-800">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-base">Certifications</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.certifications.map((item: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-100/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer Experience */}
            {profile.volunteerExperience && profile.volunteerExperience.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-base">Volunteer & Mentorship</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {profile.volunteerExperience.map((item: string, idx: number) => {
                    const parts = item.split('–');
                    const title = parts[0]?.trim() || item;
                    const desc = parts.slice(1).join('–')?.trim();
                    return (
                      <div key={idx} className="bg-rose-50/20 border border-rose-100/30 p-3 rounded-xl space-y-1">
                        <p className="text-xs font-semibold text-rose-900">{title}</p>
                        {desc && <p className="text-[11px] text-neutral-600">{desc}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Referees */}
            {profile.referees && profile.referees.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                  <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-base">Professional References</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {profile.referees.map((item: string, idx: number) => {
                    const namePart = item.split('(')[0]?.trim() || item;
                    const detailsPart = item.match(/\(([^)]+)\)/)?.[1] || '';
                    const contactPart = item.split(')')[1]?.trim() || '';
                    return (
                      <div key={idx} className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-2">
                        <div>
                          <p className="text-sm font-semibold text-neutral-800">{namePart}</p>
                          {detailsPart && <p className="text-xs text-neutral-500 font-medium">{detailsPart}</p>}
                        </div>
                        {contactPart && (
                          <div className="text-[11px] text-neutral-600 border-t border-neutral-200/50 pt-2 space-y-1">
                            {contactPart.split(',').map((contact, cIdx) => (
                              <p key={cIdx} className="truncate">{contact.replace('-', '').trim()}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
