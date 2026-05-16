import { getRegionAdjustmentFactor } from './regions';

const WESTERN_REGIONS = ['us', 'usa', 'uk', 'gb', 'eu', 'europe', 'germany', 'france'];

export function adjustWesternRate(
  rate: number,
  targetRegion: string,
): { adjusted: number; note: string } {
  const factor = getRegionAdjustmentFactor(
    (targetRegion as any) ?? 'uganda',
  );
  const adjusted = Math.round(rate * factor);
  const note = `Adjusted from $${rate}/hr Western rate by ${Math.round(factor * 100)}% for ${targetRegion} market context.`;

  return { adjusted, note };
}

export function isWesternRate(region: string): boolean {
  const lower = region.toLowerCase();
  return WESTERN_REGIONS.some((w) => lower.includes(w));
}

export function adjustRateRange(
  minRate: number,
  maxRate: number,
  sourceRegion: string,
  targetRegion: string = 'uganda',
): { min: number; max: number; adjustmentNote?: string } {
  if (!isWesternRate(sourceRegion)) {
    return { min: minRate, max: maxRate };
  }

  const { adjusted: adjMin, note: minNote } = adjustWesternRate(
    minRate,
    targetRegion,
  );
  const { adjusted: adjMax } = adjustWesternRate(maxRate, targetRegion);

  return {
    min: adjMin,
    max: adjMax,
    adjustmentNote: minNote,
  };
}
