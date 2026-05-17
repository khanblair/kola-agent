'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { CvUploadZone } from '@/components/freelancer/cv-upload-zone';
import { CvProcessingStatus } from '@/components/freelancer/cv-processing-status';
import { SkillsList } from '@/components/freelancer/skills-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CVParseResult } from '@/types/freelancer';

type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

export default function UploadCvPage() {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<CVParseResult | null>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setError(null);
    setParseResult(null);
    setStatus('uploading');

    try {
      const form = new FormData();
      form.append('cv', file);

      setStatus('processing');
      const res = await fetch('/api/freelancers/upload-cv', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Upload failed');
      }

      const data = (await res.json()) as { data?: CVParseResult };
      setParseResult(data.data ?? null);
      setStatus('complete');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFileName('');
    setError(null);
    setParseResult(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Upload CV"
        description="Upload your CV to auto-fill your freelancer profile with skills and experience."
      />

      <Section>
        {(status === 'idle' || status === 'error') && (
          <CvUploadZone onFile={handleFile} loading={false} />
        )}

        <CvProcessingStatus
          status={status}
          fileName={fileName}
          error={error ?? undefined}
        />

        {status === 'complete' && parseResult && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h3 className="text-sm font-semibold text-green-800">CV Parsed Successfully</h3>
              <p className="mt-1 text-sm text-green-700">
                <span className="font-medium">Name:</span> {parseResult.name}
              </p>
              <p className="text-sm text-green-700">
                <span className="font-medium">Experience:</span> {parseResult.yearsOfExperience} years ({parseResult.seniority})
              </p>
              <p className="text-sm text-green-700">
                <span className="font-medium">Region:</span> {parseResult.region}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Detected Skills</h4>
              <SkillsList skills={parseResult.skills} max={20} />
            </div>

            {parseResult.notableProjects.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Notable Projects</h4>
                <ul className="space-y-1">
                  {parseResult.notableProjects.map((p, i) => (
                    <li key={i} className="text-sm text-neutral-600 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{i + 1}</Badge>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleReset}>Upload Another</Button>
              <Button variant="outline" onClick={() => window.location.href = '/freelancer/profile'}>
                View Profile
              </Button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
