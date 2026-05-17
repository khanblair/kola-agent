import { searchMarketRates } from '@/lib/tavily/search';
import { parseRateData } from '@/lib/tavily/parser';
import { lookupRate, inferSkillCategory, type RegionKey } from '@/lib/rate-card';

export async function searchMarketRatesTool(
  projectType: string,
  skills: string,
  region?: string,
): Promise<string> {
  try {
    const result = await searchMarketRates(
      projectType,
      skills,
      region || 'East Africa',
    );

    const targetRegion = (region?.toLowerCase() as RegionKey) || 'uganda';
    const { rates, adjustedRates } = parseRateData(
      result.rawResults,
      targetRegion,
    );

    if (rates.length === 0) {
      return buildFallbackResponse(projectType, skills, targetRegion);
    }

    let response = `## Market Rate Search Results\n\n`;
    response += `**Source:** Tavily live web search\n`;
    response += `**Region:** ${region || 'East Africa'}\n\n`;

    for (const rate of rates) {
      response += `- **${rate.source}**: ${rate.minRate ? `$${rate.minRate}–$${rate.maxRate}/hr` : 'Rate data not extractable'} (${rate.region})\n`;
    }

    if (adjustedRates) {
      response += `\n**Adjusted rate for ${targetRegion}:** $${adjustedRates.min}–$${adjustedRates.max}/hr`;
      if (adjustedRates.adjustmentNote) {
        response += `\n_${adjustedRates.adjustmentNote}_`;
      }
    }

    if (result.answer) {
      response += `\n\n**Tavily summary:** ${result.answer}`;
    }

    return response;
  } catch (error) {
    return buildFallbackResponse(
      projectType,
      skills,
      (region?.toLowerCase() as RegionKey) || 'uganda',
    );
  }
}

function buildFallbackResponse(
  projectType: string,
  skills: string,
  region: RegionKey,
): string {
  const skillCategory = inferSkillCategory(skills.split(','));
  const juniorRate = lookupRate(region, skillCategory, 'junior');
  const midRate = lookupRate(region, skillCategory, 'mid');
  const seniorRate = lookupRate(region, skillCategory, 'senior');

  let response = `## Market Rate — Fallback Rate Card\n\n`;
  response += `**Live market data unavailable. Using Africa rate card fallback.**\n\n`;
  response += `| Seniority | Rate Range |\n|-----------|------------|\n`;
  response += `| Junior | ${formatRate(juniorRate)} |\n`;
  response += `| Mid | ${formatRate(midRate)} |\n`;
  response += `| Senior | ${formatRate(seniorRate)} |\n`;

  return response;
}

function formatRate(
  rate: { min: number; max: number; currency: string } | null,
): string {
  if (!rate) return 'N/A';
  return `$${rate.min}–$${rate.max}/hr`;
}
