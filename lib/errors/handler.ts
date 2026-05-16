import { ApiError } from './api-error';
import { AgentError } from './agent-error';
import { logger } from '@/lib/utils/logger';

export function handleError(error: unknown): { message: string; statusCode: number } {
  if (error instanceof ApiError) {
    logger.error('API Error', error.toJSON());
    return { message: error.message, statusCode: error.statusCode };
  }

  if (error instanceof AgentError) {
    logger.error('Agent Error', {
      message: error.message,
      step: error.step,
      retryable: error.retryable,
    });
    return { message: error.message, statusCode: 500 };
  }

  if (error instanceof Error) {
    logger.error('Unexpected Error', error.message);
    return { message: 'An unexpected error occurred', statusCode: 500 };
  }

  logger.error('Unknown Error', error);
  return { message: 'An unknown error occurred', statusCode: 500 };
}
