import {
  type RegionKey,
  type SkillCategory,
  type Seniority,
  getRegionData,
  regionKeys,
} from './regions';
import { adjustRateRange, isWesternRate } from './adjuster';

export type { RegionKey, SkillCategory, Seniority };
export { isWesternRate, adjustRateRange };

export function lookupRate(
  region: RegionKey,
  skill: SkillCategory,
  seniority: Seniority,
): { min: number; max: number; currency: string } | null {
  const regionData = getRegionData(region);
  if (!regionData) return null;

  const skillRates = regionData.rates[skill];
  if (!skillRates) return null;

  const rate = skillRates[seniority];
  if (!rate) return null;

  return {
    min: rate.min,
    max: rate.max,
    currency: regionData.currency,
  };
}

export function lookupRateAllSeniorities(
  region: RegionKey,
  skill: SkillCategory,
): Record<Seniority, { min: number; max: number }> | null {
  const regionData = getRegionData(region);
  if (!regionData) return null;

  return regionData.rates[skill] ?? null;
}

export function inferSkillCategory(skills: string[]): SkillCategory {
  const lower = skills.map((s) => s.toLowerCase());

  if (
    lower.some(
      (s) =>
        s.includes('react') ||
        s.includes('next.js') ||
        s.includes('node') ||
        s.includes('fullstack') ||
        s.includes('full-stack') ||
        s.includes('express'),
    )
  )
    return 'full-stack-web';
  if (
    lower.some(
      (s) =>
        s.includes('react native') ||
        s.includes('flutter') ||
        s.includes('mobile') ||
        s.includes('ios') ||
        s.includes('android'),
    )
  )
    return 'mobile-development';
  if (
    lower.some(
      (s) =>
        s.includes('figma') ||
        s.includes('ux') ||
        s.includes('ui') ||
        s.includes('design') ||
        s.includes('wireframe'),
    )
  )
    return 'ui-ux-design';
  if (
    lower.some(
      (s) =>
        s.includes('python') ||
        s.includes('data') ||
        s.includes('sql') ||
        s.includes('machine learning') ||
        s.includes('pandas'),
    )
  )
    return 'data-analysis';
  if (
    lower.some(
      (s) =>
        s.includes('illustrator') ||
        s.includes('photoshop') ||
        s.includes('brand') ||
        s.includes('logo') ||
        s.includes('graphic'),
    )
  )
    return 'graphic-design';

  return 'full-stack-web';
}

export { regionKeys };
