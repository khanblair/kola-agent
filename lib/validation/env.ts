const requiredEnvVars = [
  'DEEPSEEK_API_KEY',
  'NEXT_PUBLIC_CONVEX_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
] as const;

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing = requiredEnvVars.filter(
    (key) => !process.env[key],
  );

  return { valid: missing.length === 0, missing };
}
