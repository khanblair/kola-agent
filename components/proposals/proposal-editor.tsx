'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ProposalPreview } from './proposal-preview';
import { useDebounce } from '@/hooks/use-debounce';

interface ProposalEditorProps {
  initialContent: string;
  tone?: string;
  onSave?: (content: string) => void;
}

export function ProposalEditor({ initialContent, tone, onSave }: ProposalEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [editing, setEditing] = useState(false);
  const debounced = useDebounce(content, 300);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700">Proposal</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Preview' : 'Edit'}
          </Button>
          {onSave && (
            <Button size="sm" onClick={() => onSave(debounced)}>
              Save
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="font-mono text-sm"
        />
      ) : (
        <ProposalPreview content={content} tone={tone} />
      )}
    </div>
  );
}
