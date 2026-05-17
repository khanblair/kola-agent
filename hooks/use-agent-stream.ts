'use client';

import { useState, useCallback, useRef } from 'react';
import type { AgentStep, AgentStatus, AgentTool } from '@/types/agent';
import type { StreamEvent } from '@/types/api';

interface UseAgentStreamReturn {
  steps: AgentStep[];
  status: AgentStatus;
  error: string | null;
  run: (briefText: string, region?: string) => Promise<void>;
  reset: () => void;
}

export function useAgentStream(): UseAgentStreamReturn {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setSteps([]);
    setStatus('idle');
    setError(null);
    abortRef.current?.abort();
  }, []);

  const run = useCallback(async (briefText: string, region?: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSteps([]);
    setStatus('running');
    setError(null);

    try {
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefText, region }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ?? `Request failed (${response.status})`,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event: StreamEvent = JSON.parse(raw);
            handleEvent(event);
          } catch {
            // skip malformed JSON
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const message = (err as Error).message ?? 'Agent run failed';
      setError(message);
      setStatus('error');
    }

    function handleEvent(event: StreamEvent) {
      switch (event.type) {
        case 'step_start':
          setSteps((prev) => [
            ...prev,
            { tool: event.tool as AgentTool, status: 'running', summary: '' },
          ]);
          break;

        case 'step_complete':
          setSteps((prev) =>
            prev.map((s, i) => {
              if (i === prev.length - 1 && s.tool === event.tool && s.status === 'running') {
                return {
                  ...s,
                  status: 'complete' as const,
                  summary: event.summary ?? '',
                  duration: event.duration,
                };
              }
              return s;
            }),
          );
          break;

        case 'step_error':
          setSteps((prev) =>
            prev.map((s, i) => {
              if (i === prev.length - 1 && s.tool === event.tool && s.status === 'running') {
                return {
                  ...s,
                  status: 'error' as const,
                  error: event.error,
                };
              }
              return s;
            }),
          );
          break;

        case 'agent_complete':
          setStatus('complete');
          break;

        case 'agent_error':
          setError(event.error ?? 'Unknown error');
          setStatus('error');
          break;
      }
    }
  }, []);

  return { steps, status, error, run, reset };
}
