import type { AgentTool, AgentStep } from './types';

export interface SSEEvent {
  type: 'step_start' | 'step_complete' | 'step_error' | 'agent_complete' | 'agent_error';
  tool?: string;
  summary?: string;
  duration?: number;
  error?: string;
  data?: Record<string, unknown>;
}

export function createSSEStream() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    start(c) {
      controller = c;
    },
    cancel() {
      controller = null;
    },
  });

  function send(event: SSEEvent) {
    if (!controller) return;
    const data = `data: ${JSON.stringify(event)}\n\n`;
    controller.enqueue(encoder.encode(data));
  }

  function close() {
    if (!controller) return;
    controller.close();
    controller = null;
  }

  function sendStepStart(tool: AgentTool) {
    send({ type: 'step_start', tool });
  }

  function sendStepComplete(step: AgentStep) {
    send({
      type: 'step_complete',
      tool: step.tool,
      summary: step.summary,
      duration: step.duration,
    });
  }

  function sendStepError(tool: AgentTool, error: string) {
    send({ type: 'step_error', tool, error });
  }

  function sendAgentComplete(data?: Record<string, unknown>) {
    send({ type: 'agent_complete', data });
    close();
  }

  function sendAgentError(error: string) {
    send({ type: 'agent_error', error });
    close();
  }

  return {
    stream,
    send,
    close,
    sendStepStart,
    sendStepComplete,
    sendStepError,
    sendAgentComplete,
    sendAgentError,
  };
}

export type AgentStream = ReturnType<typeof createSSEStream>;
