import type { SearchResult } from "@repo/types";

const EXA_SEARCH_ENDPOINT = "https://api.exa.ai/search";

export type ExaFetchResult =
  | { kind: "http"; status: number; bodyText: string }
  | { kind: "network"; message: string };

type ExaApiResult = {
  id?: string;
  title?: string | null;
  url?: string;
  text?: string | null;
  highlights?: string[] | null;
  summary?: string | null;
};

type ExaApiResponse = {
  results?: ExaApiResult[];
};

/**
 * Call Exa /search. Does not classify outcomes — packages/search/index.ts maps status → SearchOutcome.
 * Lightweight highlights only (no full-text / summary extras) to keep cost low.
 */
export async function fetchExaSearch(
  apiKey: string,
  query: string,
  options: { limit: number; timeoutMs: number; signal?: AbortSignal },
): Promise<ExaFetchResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);

  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    else {
      options.signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  try {
    const response = await fetch(EXA_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        query,
        numResults: options.limit,
        type: "auto",
        contents: {
          highlights: { maxCharacters: 400 },
        },
      }),
      signal: controller.signal,
    });
    const bodyText = await response.text();
    return { kind: "http", status: response.status, bodyText };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { kind: "network", message };
  } finally {
    clearTimeout(timer);
  }
}

function snippetFromExaHit(hit: ExaApiResult): string {
  if (Array.isArray(hit.highlights)) {
    const joined = hit.highlights.filter(Boolean).join(" … ").trim();
    if (joined) return joined;
  }
  const text = (hit.text ?? "").trim();
  if (text) return text;
  const summary = (hit.summary ?? "").trim();
  if (summary) return summary;
  return "";
}

/**
 * Map Exa hits → SearchResult[], dropping individually unusable hits.
 *
 * Policy (empty title/snippet edge case from sustained-burst audit):
 * - Missing/invalid URL → drop hit
 * - Empty/whitespace title → drop hit (cannot form a citable SearchResult)
 * - Empty snippet → keep hit with snippet "" (contract allows empty string; DDG did the same)
 *
 * Never invent titles. Never let one bad hit poison the batch.
 */
export function mapExaResultsToSearchResults(
  bodyText: string,
  limit: number,
): { results: SearchResult[]; parseError?: string } {
  let data: ExaApiResponse;
  try {
    data = JSON.parse(bodyText) as ExaApiResponse;
  } catch {
    return { results: [], parseError: "Exa response body was not valid JSON" };
  }

  if (!data || !Array.isArray(data.results)) {
    return { results: [], parseError: "Exa response missing results array" };
  }

  const retrievedAt = new Date().toISOString();
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const hit of data.results) {
    if (results.length >= limit) break;

    const url = (hit.url ?? "").trim();
    if (!/^https?:\/\//i.test(url) || seen.has(url)) continue;
    seen.add(url);

    const title = (hit.title ?? "").trim();
    // Drop empty-title hits rather than placeholder — evidence-first product needs real labels.
    if (!title) continue;

    const snippet = snippetFromExaHit(hit);

    results.push({
      id: hit.id?.trim() || `exa-${results.length + 1}`,
      title,
      url,
      snippet,
      provider: "exa",
      retrievedAt,
    });
  }

  return { results };
}
