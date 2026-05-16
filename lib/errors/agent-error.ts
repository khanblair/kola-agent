export class AgentError extends Error {
  constructor(
    message: string,
    public readonly step?: string,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export class ToolExecutionError extends AgentError {
  constructor(
    toolName: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(`Tool "${toolName}" failed: ${message}`, toolName, true);
    this.name = 'ToolExecutionError';
  }
}

export class AgentTimeoutError extends AgentError {
  constructor(timeoutMs: number) {
    super(`Agent timed out after ${timeoutMs}ms`, undefined, true);
    this.name = 'AgentTimeoutError';
  }
}
