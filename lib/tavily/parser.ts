import { isWesternRate, adjustRateRange } from '@/lib/rate-card/adjuster';

interface RawResult {
  title: string;
  url: string;
  content: string;
}

interface ParsedRate {
  source: string;
  minRate: number | null;
  maxRate: number | null;
  region: string;
  rawText: string;
}

const RATE_PATTERN = /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*[-–to]+\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/gi;

const REGION_HINTS: Record<string, string[]> = {
  us: ['us', 'usa', 'united states', 'america', 'american'],
  uk: ['uk', 'united kingdom', 'british', 'britain', 'london'],
  eu: ['europe', 'germany', 'france', 'european'],
  uganda: ['uganda', 'kampala', 'east africa', 'east african'],
  kenya: ['kenya', 'nairobi', 'kenyan'],
  nigeria: ['nigeria', 'lagos', 'nigerian'],
  'south-africa': ['south africa', 'johannesburg', 'cape town', 'south african'],
};

export function parseRateData(
  results: RawResult[],
  targetRegion: string = 'uganda',
): {
  rates: ParsedRate[];
  adjustedRates: {
    min: number;
    max: number;
    currency: string;
    adjustmentNote?: string;
  } | null;
} {
  const rates: ParsedRate[] = [];

  for (const result of results) {
    const detectedRegion = detectRegion(result.content);
    const parsed = extractRates(result.content);

    if (parsed) {
      rates.push({
        source: result.title,
        minRate: parsed.min,
        maxRate: parsed.max,
        region: detectedRegion,
        rawText: result.content.slice(0, 200),
      });
    }
  }

  const africanRate = rates.find((r) => !isWesternRate(r.region));
  const westernRate = rates.find((r) => isWesternRate(r.region));

  let adjustedRates = null;
  const baseRate = africanRate ?? westernRate;

  if (baseRate && baseRate.minRate && baseRate.maxRate) {
    const sourceRegion = baseRate.region;
    const adjusted = adjustRateRange(
      baseRate.minRate,
      baseRate.maxRate,
      sourceRegion,
      targetRegion,
    );
    adjustedRates = {
      min: adjusted.min,
      max: adjusted.max,
      currency: 'USD',
      adjustmentNote: adjusted.adjustmentNote,
    };
  }

  return { rates, adjustedRates };
}

function extractRates(text: string): { min: number; max: number } | null {
  RATE_PATTERN.lastIndex = 0;
  const match = RATE_PATTERN.exec(text);
  if (!match) return null;
  return {
    min: parseFloat(match[1].replace(',', '')),
    max: parseFloat(match[2].replace(',', '')),
  };
}

function detectRegion(text: string): string {
  const lower = text.toLowerCase();
  for (const [region, hints] of Object.entries(REGION_HINTS)) {
    if (hints.some((hint) => lower.includes(hint))) return region;
  }
  return 'unknown';
}
