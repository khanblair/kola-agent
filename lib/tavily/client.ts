const TAVILY_API_URL = 'https://api.tavily.com/search';

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  results: TavilySearchResult[];
  query: string;
}

export async function tavilySearch(
  query: string,
  options?: {
    maxResults?: number;
    searchDepth?: 'basic' | 'advanced';
    includeDomains?: string[];
  },
): Promise<TavilyResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return { results: [], query };
  }

  const body = {
    api_key: apiKey,
    query,
    max_results: options?.maxResults ?? 5,
    search_depth: options?.searchDepth ?? 'basic',
    include_domains: options?.includeDomains,
    include_answer: true,
  };

  const response = await fetch(TAVILY_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Tavily API error (${response.status}): ${text}`);
  }

  return response.json();
}
