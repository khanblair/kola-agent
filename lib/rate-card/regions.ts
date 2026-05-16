import rateCardData from '@/data/rate-card.json';

export type RegionKey = 'uganda' | 'kenya' | 'nigeria' | 'south-africa';
export type SkillCategory =
  | 'full-stack-web'
  | 'mobile-development'
  | 'ui-ux-design'
  | 'data-analysis'
  | 'graphic-design';
export type Seniority = 'junior' | 'mid' | 'senior';

export interface RegionRateData {
  currency: string;
  adjustmentFactor: number;
  rates: Record<
    SkillCategory,
    Record<Seniority, { min: number; max: number }>
  >;
}

const regions = rateCardData.regions as Record<
  RegionKey,
  RegionRateData
>;

export const regionKeys = Object.keys(regions) as RegionKey[];

export function getRegionData(region: RegionKey): RegionRateData {
  return regions[region];
}

export function getRegionCurrency(region: RegionKey): string {
  return regions[region]?.currency ?? 'USD';
}

export function getRegionAdjustmentFactor(region: RegionKey): number {
  return regions[region]?.adjustmentFactor ?? 0.45;
}

export { regions };
