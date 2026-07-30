import type { SearchResult } from "@repo/types";

const DDG_HTML_ENDPOINT = "https://html.duckduckgo.com/html/";

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeDuckDuckGoUrl(href: string): string {
  try {
    const absolute = href.startsWith("http")
      ? href
      : `https://duckduckgo.com${href}`;
    const parsed = new URL(absolute);
    const uddg = parsed.searchParams.get("uddg");
    if (uddg) return decodeURIComponent(uddg);
    return absolute;
  } catch {
    return href;
  }
}

/**
 * Parse DuckDuckGo HTML results page into SearchResult hits.
 * Kept dependency-free (regex) — modest, web-only, not a general parser framework.
 */
export function parseDuckDuckGoHtml(
  html: string,
  limit: number,
): SearchResult[] {
  const retrievedAt = new Date().toISOString();
  const blocks = html.split(/class="result__a"/i).slice(1);
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const block of blocks) {
    if (results.length >= limit) break;

    const hrefMatch = block.match(/href="([^"]+)"/i);
    const titleMatch = block.match(/^[^>]*>([\s\S]*?)<\/a>/i);
    const snippetMatch = block.match(
      /class="result__snippet"[^>]*>([\s\S]*?)<\/(?:a|td|div)/i,
    );

    if (!hrefMatch || !titleMatch) continue;

    const url = decodeDuckDuckGoUrl(hrefMatch[1]);
    if (!url.startsWith("http") || seen.has(url)) continue;
    seen.add(url);

    const title = stripTags(titleMatch[1]);
    const snippet = snippetMatch ? stripTags(snippetMatch[1]) : "";
    if (!title) continue;

    results.push({
      id: `web-${results.length + 1}`,
      title,
      url,
      snippet,
      provider: "duckduckgo",
      retrievedAt,
    });
  }

  return results;
}

export async function fetchDuckDuckGoHtml(
  query: string,
  options: { limit: number; timeoutMs: number; signal?: AbortSignal },
): Promise<Response> {
  // GET works from this environment; POST often returns a bot interstitial (HTTP 202, no results).
  const url = new URL(DDG_HTML_ENDPOINT);
  url.searchParams.set("q", query);

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
    return await fetch(url, {
      method: "GET",
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent":
          "Mozilla/5.0 (compatible; ForgeSearchEngineVerticalSlice/0.1; +research)",
      },
      signal: controller.signal,
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}
