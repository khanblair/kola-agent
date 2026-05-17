'use client';

import { useState, useCallback } from 'react';

export function useCvUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ name: string; skills: string[] } | null>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      form.append('cv', file);

      const res = await fetch('/api/freelancers/upload-cv', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Upload failed');
      }

      const data = (await res.json()) as { data?: { name: string; skills: string[] } };
      setResult(data.data ?? null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error, result };
}
