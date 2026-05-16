export type Region = 'uganda' | 'kenya' | 'nigeria' | 'south-africa';

export interface MarketRate {
  skill: string;
  minRate: number;
  maxRate: number;
  currency: string;
  source: 'tavily' | 'fallback';
  region: Region;
}

export interface RateCardEntry {
  skill: string;
  junior: { min: number; max: number };
  mid: { min: number; max: number };
  senior: { min: number; max: number };
  currency: string;
}

export interface RegionRates {
  region: Region;
  currency: string;
  rates: RateCardEntry[];
}
