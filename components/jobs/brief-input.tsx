'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';

interface BriefInputProps {
  onSubmit: (briefText: string) => void;
  loading?: boolean;
}

const MIN_LENGTH = 50;

export function BriefInput({ onSubmit, loading }: BriefInputProps) {
  const [text, setText] = useState('');
  const debounced = useDebounce(text, 300);
  const charCount = debounced.length;
  const isValid = charCount >= MIN_LENGTH;

  return (
    <div className="space-y-3">
      <label htmlFor="brief" className="block text-sm font-medium text-neutral-700">
        Job Brief
      </label>
      <Textarea
        id="brief"
        placeholder="Describe the project, required skills, timeline, and budget expectations..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="resize-y"
      />
      <div className="flex items-center justify-between">
        <span className={`text-xs ${isValid ? 'text-green-600' : 'text-neutral-400'}`}>
          {charCount} / {MIN_LENGTH} min characters
        </span>
        <Button onClick={() => onSubmit(text)} disabled={!isValid || loading} loading={loading}>
          Analyze Brief
        </Button>
      </div>
    </div>
  );
}
