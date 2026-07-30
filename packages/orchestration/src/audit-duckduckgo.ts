/**
 * DuckDuckGo reliability audit — 15 real queries, no forced failures.
 * Classifies each attempt: success | bot-interstitial/transient | no-usable-results | hard-error | malformed
 */
import { searchWeb } from "@repo/search";

const QUERIES = [
  "What is the boiling point of water at sea level?",
  "capital of France",
  "TypeScript discriminated unions",
  "photosynthesis equation",
  "who invented the telephone",
  "speed of light in vacuum",
  "React useEffect cleanup function",
  "mitochondria function",
  "JWT vs session cookies",
  "Mount Everest height meters",
  "HTTP 202 Accepted meaning",
  "Newtonian gravity formula",
  "PostgreSQL JSONB vs JSON",
  "when was the Magna Carta signed",
  "how does a lithium ion battery work",
];

type Bucket =
  | "success"
  | "transient-error"
  | "no-usable-results"
  | "hard-error";

const tallies: Record<Bucket, number> = {
  success: 0,
  "transient-error": 0,
  "no-usable-results": 0,
  "hard-error": 0,
};

const rows: Array<{
  n: number;
  query: string;
  status: string;
  detail?: string;
  results?: number;
  ms: number;
}> = [];

console.log("=== DuckDuckGo HTML scrape audit (15 queries) ===\n");

for (let i = 0; i < QUERIES.length; i++) {
  const query = QUERIES[i];
  const started = Date.now();
  const outcome = await searchWeb(query, { limit: 5, timeoutMs: 15_000 });
  const ms = Date.now() - started;
  tallies[outcome.status] += 1;
  rows.push({
    n: i + 1,
    query,
    status: outcome.status,
    detail: "detail" in outcome ? outcome.detail : undefined,
    results: outcome.status === "success" ? outcome.results.length : 0,
    ms,
  });
  const extra =
    outcome.status === "success"
      ? ` results=${outcome.results.length}`
      : outcome.status !== "success" && "detail" in outcome
        ? ` — ${outcome.detail}`
        : "";
  console.log(`${String(i + 1).padStart(2)}. [${outcome.status}] ${ms}ms${extra}`);
  console.log(`    q: ${query}`);
  // Small pause to avoid looking like a burst scraper.
  await new Promise((r) => setTimeout(r, 400));
}

console.log("\n=== Summary ===");
console.log(JSON.stringify(tallies, null, 2));
console.log(
  `success rate: ${((tallies.success / QUERIES.length) * 100).toFixed(1)}% (${tallies.success}/${QUERIES.length})`,
);
console.log(
  `bot/transient rate: ${((tallies["transient-error"] / QUERIES.length) * 100).toFixed(1)}%`,
);
console.log(
  `no-usable-results rate: ${((tallies["no-usable-results"] / QUERIES.length) * 100).toFixed(1)}%`,
);
console.log(
  `hard-error rate: ${((tallies["hard-error"] / QUERIES.length) * 100).toFixed(1)}%`,
);
