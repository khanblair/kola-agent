'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { BriefInput } from '@/components/jobs/brief-input';
import { RegionSelector } from '@/components/market/region-selector';
import { AgentRunner } from '@/components/agent/agent-runner';
import { Section } from '@/components/layout/section';
import type { Region } from '@/types/market';

export default function NewJobPage() {
  const router = useRouter();
  const [briefText, setBriefText] = useState('');
  const [region, setRegion] = useState<Region>('uganda');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBriefSubmit = (text: string) => {
    setBriefText(text);
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader title="Post a New Job" description="Describe your project and let the agent handle the rest." />

      {!submitted ? (
        <Section title="Job Brief" description="Describe the project, required skills, timeline, and any budget expectations.">
          <div className="space-y-4">
            <div className="max-w-xs">
              <RegionSelector value={region} onChange={setRegion} />
            </div>
            <BriefInput onSubmit={handleBriefSubmit} loading={loading} />
          </div>
        </Section>
      ) : (
        <Section title="Agent Running" description="The agent is processing your brief autonomously.">
          <AgentRunner
            briefText={briefText}
            region={region}
            onComplete={() => {}}
          />
        </Section>
      )}
    </div>
  );
}
