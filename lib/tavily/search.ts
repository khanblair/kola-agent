import { tavilySearch } from './client';
import { retry } from '@/lib/utils/retry';

interface MarketRateSearchResult {
  rawResults: { title: string; url: string; content: string }[];
  answer?: string;
}

export async function searchMarketRates(
  projectType: string,
  skills: string,
  region: string = 'East Africa',
): Promise<MarketRateSearchResult> {
  const query = buildRateQuery(projectType, skills, region);

  const result = await retry(
    async () => {
      const response = await tavilySearch(query, {
        maxResults: 5,
        searchDepth: 'advanced',
      });

      if (response.results.length === 0) {
        throw new Error('No results from Tavily');
      }

      return response;
    },
    2,
    2_000,
  );

  return {
    rawResults: result.results.map((r) => ({
      title: r.title,
      url: r.url,
      content: r.content,
    })),
    answer: (result as any).answer,
  };
}

function buildRateQuery(
  projectType: string,
  skills: string,
  region: string,
): string {
  const year = new Date().getFullYear();
  return `${projectType} developer hourly rate ${region} ${year} freelance ${skills}`.trim();
}
