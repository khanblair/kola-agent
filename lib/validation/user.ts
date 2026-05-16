export function validateUserName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  return { valid: true };
}

export function validateRegion(region: string): {
  valid: boolean;
  error?: string;
} {
  const valid = ['uganda', 'kenya', 'nigeria', 'south-africa'];
  if (!valid.includes(region)) {
    return { valid: false, error: 'Invalid region' };
  }
  return { valid: true };
}
