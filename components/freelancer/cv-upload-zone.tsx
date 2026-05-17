'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Upload, FileText } from 'lucide-react';

interface CvUploadZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  loading?: boolean;
}

export function CvUploadZone({ onFile, accept = '.pdf,.doc,.docx,.txt', loading }: CvUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors',
        dragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400',
        loading && 'pointer-events-none opacity-60',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      {loading ? (
        <>
          <FileText className="mb-3 h-10 w-10 text-primary-400 animate-pulse" />
          <p className="text-sm font-medium text-neutral-600">Processing CV...</p>
        </>
      ) : (
        <>
          <Upload className="mb-3 h-10 w-10 text-neutral-400" />
          <p className="text-sm font-medium text-neutral-700">
            Drop your CV here or click to upload
          </p>
          <p className="mt-1 text-xs text-neutral-400">PDF, DOC, DOCX, or TXT</p>
        </>
      )}
    </div>
  );
}
