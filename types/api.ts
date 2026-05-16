export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type StreamEventType =
  | 'step_start'
  | 'step_complete'
  | 'step_error'
  | 'agent_complete'
  | 'agent_error';

export interface StreamEvent {
  type: StreamEventType;
  tool?: string;
  summary?: string;
  duration?: number;
  error?: string;
  data?: Record<string, unknown>;
}
