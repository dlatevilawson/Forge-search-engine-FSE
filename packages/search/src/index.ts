import type { SearchOutcome, SearchResult } from "@repo/types";
import { fetchDuckDuckGoHtml, parseDuckDuckGoHtml } from "./duckduckgo.ts";

export type SearchWebOptions = {
  limit?: number;
  timeoutMs?: number;
  /** Test hook — forces a typed failure without hitting the network. */
  forceFailure?: "no-results" | "transient-error" | "hard-error";
  signal?: AbortSignal;
};

function forceFailureFromEnv(): SearchWebOptions["forceFailure"] {
  const raw = process.env.SEARCH_FORCE_FAILURE?.trim().toLowerCase();
  if (raw === "no-results" || raw === "transient-error" || raw === "hard-error") {
    return raw;
  }
  return undefined;
}

/**
 * Real web-only retrieval.
 * Returns typed SearchOutcome — does not retry. Orchestration owns retry/recovery.
 *
 * Provider: DuckDuckGo HTML (no API key). Optional BRAVE_API_KEY is reserved for a
 * future backend swap; not required for this pass.
 */
export async function searchWeb(
  query: string,
  options: SearchWebOptions = {},
): Promise<SearchOutcome> {
  const trimmed = query.trim();
  const limit = options.limit ?? 5;
  const timeoutMs = options.timeoutMs ?? 12_000;
  const forceFailure = options.forceFailure ?? forceFailureFromEnv();

  if (!trimmed) {
    return {
      status: "hard-error",
      query,
      detail: "Empty search query",
      retryable: false,
    };
  }

  if (forceFailure === "no-results") {
    return { status: "no-results", query: trimmed, detail: "Forced no-results (SEARCH_FORCE_FAILURE)" };
  }
  if (forceFailure === "transient-error") {
    return {
      status: "transient-error",
      query: trimmed,
      detail: "Forced transient-error (SEARCH_FORCE_FAILURE)",
      retryable: true,
    };
  }
  if (forceFailure === "hard-error") {
    return {
      status: "hard-error",
      query: trimmed,
      detail: "Forced hard-error (SEARCH_FORCE_FAILURE)",
      retryable: false,
    };
  }

  try {
    const response = await fetchDuckDuckGoHtml(trimmed, {
      limit,
      timeoutMs,
      signal: options.signal,
    });

    if (response.status === 429 || response.status === 202 || response.status >= 500) {
      return {
        status: "transient-error",
        query: trimmed,
        detail: `Upstream HTTP ${response.status}`,
        retryable: true,
      };
    }

    if (!response.ok) {
      return {
        status: "hard-error",
        query: trimmed,
        detail: `Upstream HTTP ${response.status}`,
        retryable: false,
      };
    }

    const html = await response.text();
    if (!html || html.length < 50) {
      return {
        status: "transient-error",
        query: trimmed,
        detail: "Empty or truncated upstream body",
        retryable: true,
      };
    }

    const results: SearchResult[] = parseDuckDuckGoHtml(html, limit);
    if (results.length === 0) {
      return {
        status: "no-results",
        query: trimmed,
        detail: "Parser found zero result blocks",
      };
    }

    return { status: "success", query: trimmed, results };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const transient =
      error instanceof Error &&
      (error.name === "AbortError" ||
        /timeout|network|fetch failed|econnreset|enotfound/i.test(message));

    if (transient) {
      return {
        status: "transient-error",
        query: trimmed,
        detail: message,
        retryable: true,
      };
    }

    return {
      status: "hard-error",
      query: trimmed,
      detail: message,
      retryable: false,
    };
  }
}

/**
 * Source-kind entry. Only `web` is implemented. Other kinds return hard-error
 * (not stubbed success) so orchestration must decide — no silent fake hits.
 */
export async function retrieveForSourceKind(
  sourceKind: "web" | "youtube" | "docs" | "papers",
  query: string,
  options?: SearchWebOptions,
): Promise<SearchOutcome> {
  if (sourceKind === "web") {
    return searchWeb(query, options);
  }
  return {
    status: "hard-error",
    query,
    detail: `${sourceKind} retrieval is not implemented in this pass`,
    retryable: false,
  };
}
