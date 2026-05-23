'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { MatchScoreRing } from '@/components/matching/match-score-ring';
import { ToneSelector } from '@/components/proposals/tone-selector';
import { ProposalPreview } from '@/components/proposals/proposal-preview';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Sparkles, Send, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import type { ProposalTone } from '@/types/proposal';

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.proposalId as string;

  const match = useQuery(api.functions.matches.getById, { matchId: proposalId as any });
  const saveProposal = useMutation(api.functions.proposals.create);

  const [content, setContent] = useState('');
  const [tone, setTone] = useState<ProposalTone>('professional');
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize content if match already has an existing proposal
  useEffect(() => {
    if (match?.proposalText) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent(match.proposalText);
    }
    if (match?.proposalTone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTone(match.proposalTone as ProposalTone);
    }
  }, [match]);

  if (match === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (match === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-neutral-500 font-medium">Match record not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const m = match as any;
  const scope = m.job?.structuredScope || {};
  const skills = scope.requiredSkills || [];

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: proposalId, tone }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Failed to generate proposal');
      }
      const data = (await res.json()) as { data?: { content: string } };
      setContent(data.data?.content ?? '');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await saveProposal({
        matchId: proposalId as any,
        proposalText: content,
        proposalTone: tone,
      });
      router.push('/freelancer/proposals');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-neutral-800">Draft Application</h2>
            <p className="text-xs text-neutral-400 font-medium">For: {scope.title || m.job?.briefText}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {m.status === 'proposed' && <Badge variant="warning">Submitted</Badge>}
          {m.status === 'accepted' && <Badge variant="success">Hired</Badge>}
          {m.status === 'rejected' && <Badge variant="error">Declined</Badge>}
          {m.status === 'pending' && <Badge variant="info">Drafting</Badge>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Proposal Editor Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="AI Pitch Assistance">
            <div className="bg-indigo-50/20 rounded-2xl border border-indigo-150/30 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-neutral-700 block mb-1">Cover Letter Tone</span>
                  <ToneSelector value={tone} onChange={setTone} />
                </div>
                <Button
                  onClick={handleGenerate}
                  loading={generating}
                  disabled={m.status !== 'pending' && m.status !== 'proposed'}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 font-semibold text-xs"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate AI Cover Letter
                </Button>
              </div>
              {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
            </div>
          </Section>

          <Section title="Pitch & Proposal Text">
            <div className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your custom application cover letter here or generate one using the AI tool above..."
                rows={14}
                disabled={m.status !== 'pending' && m.status !== 'proposed'}
                className="font-medium text-sm leading-relaxed p-4 rounded-2xl border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
              />

              {m.status === 'pending' && (
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={!content.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 rounded-xl px-5 py-2.5"
                  >
                    <Send className="h-4 w-4" />
                    Submit Formal Proposal
                  </Button>
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* Right Side: Job details side panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/10" />

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-800 text-base leading-snug">
                {scope.title || m.job?.briefText}
              </h3>
              <p className="text-xs text-neutral-400 font-medium">
                Matching Score Details
              </p>
            </div>

            {/* Score Ring */}
            <div className="flex items-center gap-4 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100">
              <div className="shrink-0">
                <MatchScoreRing score={m.score || 0} size={54} />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-neutral-800 block">{m.score}% AI Match Fit</span>
                <p className="text-neutral-500 leading-snug">{m.explanation || 'Excellent credentials alignment.'}</p>
              </div>
            </div>

            {/* Quick Metadata info */}
            <div className="space-y-3 text-xs font-semibold text-neutral-600">
              {m.job?.region && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  <span>Region: {m.job.region.charAt(0).toUpperCase() + m.job.region.slice(1)}</span>
                </div>
              )}
              {m.suggestedRateMin !== undefined && (
                <div className="flex items-center gap-2.5">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span>Suggested Rate: ${m.suggestedRateMin}-${m.suggestedRateMax}/hr</span>
                </div>
              )}
            </div>

            {/* Skills required */}
            {skills.length > 0 && (
              <div className="space-y-2 border-t border-neutral-50 pt-4">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Required Skills</p>
                <div className="flex flex-wrap gap-1">
                  {skills.map((skill: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-50 text-neutral-600 border border-neutral-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
