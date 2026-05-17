'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AgentLog } from './agent-log';
import { useAgentStream } from '@/hooks/use-agent-stream';

interface AgentRunnerProps {
  briefText: string;
  region?: string;
  onComplete?: () => void;
}

export function AgentRunner({ briefText, region, onComplete }: AgentRunnerProps) {
  const { steps, status, error, run, reset } = useAgentStream();
  const [hasStarted, setHasStarted] = useState(false);

  const handleRun = async () => {
    setHasStarted(true);
    await run(briefText, region);
    if (onComplete) onComplete();
  };

  useEffect(() => {
    if (briefText.trim() && !hasStarted) {
      handleRun();
    }
  }, [briefText]);

  const handleReset = () => {
    reset();
    setHasStarted(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {!hasStarted ? (
          <Button onClick={handleRun} disabled={!briefText.trim()}>
            Run Agent
          </Button>
        ) : (
          <>
            <Button
              onClick={handleRun}
              disabled={status === 'running' || !briefText.trim()}
              loading={status === 'running'}
            >
              {status === 'running' ? 'Running...' : 'Re-run'}
            </Button>
            {(status === 'complete' || status === 'error') && (
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {(hasStarted || steps.length > 0) && (
        <AgentLog steps={steps} status={status} />
      )}
    </div>
  );
}
