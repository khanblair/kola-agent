export function validateBrief(brief: string): {
  valid: boolean;
  error?: string;
} {
  if (!brief || brief.trim().length === 0) {
    return { valid: false, error: 'Job brief is required' };
  }

  if (brief.trim().length < 50) {
    return {
      valid: false,
      error: 'Job brief is too short — provide at least 50 characters describing the project',
    };
  }

  if (brief.length > 5000) {
    return {
      valid: false,
      error: 'Job brief is too long — keep it under 5000 characters',
    };
  }

  return { valid: true };
}
