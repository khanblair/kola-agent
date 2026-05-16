const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf'];

export function validateCV(
  file: File,
): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF files are accepted' };
  }

  if (file.size > MAX_CV_SIZE) {
    return {
      valid: false,
      error: 'CV file is too large — maximum size is 5MB',
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'CV file is empty' };
  }

  return { valid: true };
}
