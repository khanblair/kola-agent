export type Region = 'uganda' | 'kenya' | 'nigeria' | 'south-africa';

export const regions: Record<
  Region,
  { label: string; currency: string; code: string }
> = {
  uganda: { label: 'Uganda', currency: 'UGX', code: 'UG' },
  kenya: { label: 'Kenya', currency: 'KES', code: 'KE' },
  nigeria: { label: 'Nigeria', currency: 'NGN', code: 'NG' },
  'south-africa': { label: 'South Africa', currency: 'ZAR', code: 'ZA' },
} as const;

export const regionList = Object.entries(regions).map(([value, data]) => ({
  value: value as Region,
  ...data,
}));
