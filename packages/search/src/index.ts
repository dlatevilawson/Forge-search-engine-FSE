import type { SearchOutcome, SearchResult } from "@repo/types";
import { fetchExaSearch, mapExaResultsToSearchResults } from "./exa.ts";

export type SearchWebOptions = {
  limit?: number;
  timeoutMs?: number;
  /** Test hook — forces a typed outcome without hitting the network. */
  forceFailure?: "no-usable-results" | "transient-error" | "hard-error";
  signal?: AbortSignal;
};

function forceFailureFromEnv(): SearchWebOptions["forceFailure"] {
  const raw = process.env.SEARCH_FORCE_FAILURE?.trim().toLowerCase();
  // Accept legacy alias "no-results" from the previous pass.
  if (raw === "no-results" || raw === "no-usable-results") {
    return "no-usable-results";
  }
  if (raw === "transient-error" || raw === "hard-error") {
    return raw;
  }
  return undefined;
}

function isTransientNetworkMessage(message: string, name?: string): boolean {
  if (name === "AbortError") return true;
  return /timeout|network|fetch failed|econnreset|enotfound|aborted/i.test(
    message,
  );
}

/**
 * Real web-only retrieval via Exa Search API.
 * Returns typed SearchOutcome — does not retry. Orchestration owns retry/recovery.
 *
 * Requires EXA_API_KEY. DuckDuckGo HTML scrape has been retired from this path
 * (see docs/04b provider decision; audit scripts retained as historical evidence).
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

  if (forceFailure === "no-usable-results") {
    return {
      status: "no-usable-results",
      query: trimmed,
      detail: "Forced no-usable-results (SEARCH_FORCE_FAILURE)",
    };
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

  const apiKey = process.env.EXA_API_KEY?.trim();
  if (!apiKey) {
    return {
      status: "hard-error",
      query: trimmed,
      detail: "EXA_API_KEY is not set",
      retryable: false,
    };
  }

  const fetched = await fetchExaSearch(apiKey, trimmed, {
    limit,
    timeoutMs,
    signal: options.signal,
  });

  if (fetched.kind === "network") {
    if (isTransientNetworkMessage(fetched.message)) {
      return {
        status: "transient-error",
        query: trimmed,
        detail: fetched.message,
        retryable: true,
      };
    }
    return {
      status: "hard-error",
      query: trimmed,
      detail: fetched.message,
      retryable: false,
    };
  }

  const { status, bodyText } = fetched;

  // Transient upstream conditions — orchestration may retry.
  if (status === 429 || status === 408 || status >= 500) {
    return {
      status: "transient-error",
      query: trimmed,
      detail: `Upstream HTTP ${status}`,
      retryable: true,
    };
  }

  // Auth / billing / client errors — not retryable without config change.
  if (status === 401 || status === 403 || status === 402 || status === 400) {
    return {
      status: "hard-error",
      query: trimmed,
      detail: `Upstream HTTP ${status}${bodyText ? `: ${bodyText.slice(0, 200)}` : ""}`,
      retryable: false,
    };
  }

  if (status !== 200) {
    return {
      status: "hard-error",
      query: trimmed,
      detail: `Upstream HTTP ${status}`,
      retryable: false,
    };
  }

  const mapped = mapExaResultsToSearchResults(bodyText, limit);

  if (mapped.parseError) {
    // 200 with unreadable body — treat as transient (may be truncated/proxy glitch).
    return {
      status: "transient-error",
      query: trimmed,
      detail: mapped.parseError,
      retryable: true,
    };
  }

  const results: SearchResult[] = mapped.results;
  if (results.length === 0) {
    return {
      status: "no-usable-results",
      query: trimmed,
      detail:
        "Exa returned zero usable hits after dropping results with missing title or URL",
    };
  }

  return { status: "success", query: trimmed, results };
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
