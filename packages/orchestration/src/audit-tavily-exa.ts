/**
 * Empirical bake-off: Tavily vs Exa (throwaway audit).
 *
 * Does NOT call packages/search searchWeb() or change production providers.
 * Calls each official API directly, maps responses onto the existing SearchResult
 * field shape for a contract-fit check, and mirrors the DuckDuckGo audit methodology.
 *
 * Sustained-burst mode (closes the DuckDuckGo-parity load gap):
 *   15 real queries at ~400ms intervals — same shape as audit-duckduckgo.ts.
 *   Exa runs first (leading candidate); Tavily is secondary when its key is present.
 *   Clustering after ~request 6 is reported explicitly — that is what broke DuckDuckGo.
 *
 * Required env (set before running):
 *   TAVILY_API_KEY  — free tier at https://app.tavily.com (no card)
 *   EXA_API_KEY     — free credits at https://dashboard.exa.ai/api-keys
 *
 * If a key is missing, that provider is skipped and reported — the other still runs.
 * If a provider returns payment/quota exhaustion mid-burst, the burst stops and reports
 * rather than continuing into paid spend.
 *
 * Usage:
 *   pnpm audit-tavily-exa
 *   pnpm audit-tavily-exa -- --sustained-burst   # 15×~400ms burst only (no session)
 */

const BURST_QUERIES = [
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
] as const;

const SESSION_QUERIES = [
  "What is the boiling point of water at sea level?",
  "boiling point of water at 1 atmosphere",
  "does altitude change water boiling temperature",
  "why does water boil at 100 Celsius at sea level",
] as const;

const INTERVAL_MS = 400;

/** Same fields as packages/types SearchResult — provider left as string for bake-off. */
type SearchResultShape = {
  id: string;
  title: string;
  url: string;
  snippet: string;
  provider: string;
  retrievedAt: string;
};

type AttemptClass =
  | "success"
  | "rate-limited"
  | "empty"
  | "malformed"
  | "http-error"
  | "network-error";

type AttemptRow = {
  n: number;
  query: string;
  classification: AttemptClass;
  httpStatus?: number;
  detail?: string;
  ms: number;
  mapped?: SearchResultShape[];
  mappingGaps?: string[];
  costUsd?: number;
};

type ClusteringReport = {
  summary: string;
  failIndices: number[];
  firstFailureAt: number | null;
  failuresAtOrBefore6: number;
  failuresAfter6: number;
  duckduckgoLikeCluster: boolean;
  longestFailureStreak: number;
  longestFailureStreakStartsAt: number | null;
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function classifyHttp(status: number): AttemptClass {
  if (status === 429) return "rate-limited";
  // Payment / quota exhaustion — treat as hard http-error; burst runner may abort.
  if (status === 402 || status === 403) return "http-error";
  if (status >= 500 || status === 202) return "http-error";
  if (status >= 400) return "http-error";
  return "http-error";
}

function isBudgetStopStatus(status: number | undefined, detail?: string): boolean {
  if (status === 402) return true;
  const d = (detail ?? "").toLowerCase();
  return (
    d.includes("insufficient") ||
    d.includes("payment required") ||
    d.includes("quota") ||
    (d.includes("credit") && d.includes("exceed")) ||
    d.includes("out of credits") ||
    d.includes("billing")
  );
}

function contractFit(mapped: SearchResultShape[]): string[] {
  const gaps: string[] = [];
  for (const [i, hit] of mapped.entries()) {
    if (!hit.id) gaps.push(`result[${i}].id missing`);
    if (!hit.title) gaps.push(`result[${i}].title missing/empty`);
    if (!hit.url || !/^https?:\/\//i.test(hit.url)) {
      gaps.push(`result[${i}].url missing or not http(s)`);
    }
    // snippet may be empty string — note but allow (quality spot-check handles usability)
    if (hit.snippet == null) gaps.push(`result[${i}].snippet null/undefined`);
    if (!hit.provider) gaps.push(`result[${i}].provider missing`);
    if (!hit.retrievedAt) gaps.push(`result[${i}].retrievedAt missing`);
  }
  return gaps;
}

function qualityNote(hits: SearchResultShape[]): string {
  if (hits.length === 0) return "no hits to inspect";
  const sample = hits.slice(0, 2);
  const parts = sample.map((h, i) => {
    const titleOk = h.title.trim().length > 3;
    const urlOk = /^https?:\/\//i.test(h.url);
    const snipOk = (h.snippet ?? "").trim().length > 20;
    return `#${i + 1} title=${titleOk ? "ok" : "weak"} url=${urlOk ? "ok" : "bad"} snippet=${snipOk ? "ok" : "thin"}`;
  });
  return parts.join("; ");
}

function tally(rows: AttemptRow[]): Record<AttemptClass, number> {
  const t: Record<AttemptClass, number> = {
    success: 0,
    "rate-limited": 0,
    empty: 0,
    malformed: 0,
    "http-error": 0,
    "network-error": 0,
  };
  for (const r of rows) t[r.classification] += 1;
  return t;
}

function longestFailureStreak(rows: AttemptRow[]): {
  length: number;
  startsAt: number | null;
} {
  let best = 0;
  let bestStart: number | null = null;
  let cur = 0;
  let curStart: number | null = null;
  for (const r of rows) {
    if (r.classification !== "success") {
      if (cur === 0) curStart = r.n;
      cur += 1;
      if (cur > best) {
        best = cur;
        bestStart = curStart;
      }
    } else {
      cur = 0;
      curStart = null;
    }
  }
  return { length: best, startsAt: bestStart };
}

function clusteringReport(rows: AttemptRow[]): ClusteringReport {
  const fails = rows
    .filter((r) => r.classification !== "success")
    .map((r) => r.n);
  const streak = longestFailureStreak(rows);
  if (fails.length === 0) {
    return {
      summary: "no failures — no clustering",
      failIndices: [],
      firstFailureAt: null,
      failuresAtOrBefore6: 0,
      failuresAfter6: 0,
      duckduckgoLikeCluster: false,
      longestFailureStreak: 0,
      longestFailureStreakStartsAt: null,
    };
  }
  const early = fails.filter((n) => n <= 6).length;
  const late = fails.filter((n) => n > 6).length;
  // DuckDuckGo pattern: early requests succeed, then MULTIPLE failures cluster after ~request 6
  // (burst/session limit). A single isolated malformed/empty response after request 6 is NOT
  // that pattern — require several late failures or a consecutive streak.
  const duckduckgoLikeCluster =
    fails.length >= 3 &&
    late >= Math.ceil(fails.length * 0.7) &&
    early <= 2 &&
    (fails[0] ?? 0) >= 6 &&
    streak.length >= 3;
  let summary: string;
  if (fails.length === 1) {
    const only = rows.find((r) => r.n === fails[0]);
    summary =
      `single isolated non-success at request ${fails[0]} ` +
      `(classification=${only?.classification}; HTTP ${only?.httpStatus ?? "none"}) — ` +
      `NOT a multi-failure post-#6 rate-limit/session collapse`;
  } else if (duckduckgoLikeCluster) {
    summary = `CLUSTERED after early successes (first failure at request ${fails[0]}; fail indices: ${fails.join(", ")}) — DuckDuckGo-like pattern`;
  } else if (early >= Math.ceil(fails.length * 0.7)) {
    summary = `failures concentrated early (first failure at request ${fails[0]}; fail indices: ${fails.join(", ")})`;
  } else {
    summary = `failures spread (first failure at request ${fails[0]}; fail indices: ${fails.join(", ")})`;
  }
  if (fails.length > 1 && streak.length >= 3) {
    summary += `; longest failure streak=${streak.length} starting at request ${streak.startsAt}`;
  }
  return {
    summary,
    failIndices: fails,
    firstFailureAt: fails[0] ?? null,
    failuresAtOrBefore6: early,
    failuresAfter6: late,
    duckduckgoLikeCluster,
    longestFailureStreak: streak.length,
    longestFailureStreakStartsAt: streak.startsAt,
  };
}

function clusteringNote(rows: AttemptRow[]): string {
  return clusteringReport(rows).summary;
}

// --- Tavily ---

type TavilyRaw = {
  results?: Array<{
    title?: string;
    url?: string;
    content?: string;
    raw_content?: string;
    score?: number;
  }>;
  answer?: string;
  query?: string;
};

async function callTavily(apiKey: string, query: string): Promise<{
  classification: AttemptClass;
  httpStatus?: number;
  detail?: string;
  ms: number;
  mapped: SearchResultShape[];
  mappingGaps: string[];
  rawPreview?: string;
}> {
  const started = Date.now();
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: 5,
        search_depth: "basic",
        include_answer: false,
      }),
    });
    const ms = Date.now() - started;
    const text = await res.text();
    if (!res.ok) {
      return {
        classification: classifyHttp(res.status),
        httpStatus: res.status,
        detail: text.slice(0, 200),
        ms,
        mapped: [],
        mappingGaps: [],
      };
    }
    let data: TavilyRaw;
    try {
      data = JSON.parse(text) as TavilyRaw;
    } catch {
      return {
        classification: "malformed",
        httpStatus: res.status,
        detail: "JSON parse failed",
        ms,
        mapped: [],
        mappingGaps: ["body not JSON"],
        rawPreview: text.slice(0, 120),
      };
    }
    const retrievedAt = new Date().toISOString();
    const mapped: SearchResultShape[] = (data.results ?? []).map((r, i) => ({
      id: `tavily-${i + 1}`,
      title: r.title ?? "",
      url: r.url ?? "",
      snippet: r.content ?? r.raw_content ?? "",
      provider: "tavily",
      retrievedAt,
    }));
    if (mapped.length === 0) {
      return {
        classification: "empty",
        httpStatus: res.status,
        detail: "results array empty or missing",
        ms,
        mapped,
        mappingGaps: contractFit(mapped),
      };
    }
    const gaps = contractFit(mapped);
    return {
      classification: gaps.length ? "malformed" : "success",
      httpStatus: res.status,
      detail: gaps.length ? gaps.join("; ") : undefined,
      ms,
      mapped,
      mappingGaps: gaps,
    };
  } catch (e) {
    return {
      classification: "network-error",
      detail: e instanceof Error ? e.message : String(e),
      ms: Date.now() - started,
      mapped: [],
      mappingGaps: [],
    };
  }
}

// --- Exa ---

type ExaRaw = {
  results?: Array<{
    id?: string;
    title?: string | null;
    url?: string;
    text?: string | null;
    highlights?: string[] | null;
    summary?: string | null;
    publishedDate?: string | null;
  }>;
};

async function callExa(apiKey: string, query: string): Promise<{
  classification: AttemptClass;
  httpStatus?: number;
  detail?: string;
  ms: number;
  mapped: SearchResultShape[];
  mappingGaps: string[];
  rawPreview?: string;
  costUsd?: number;
}> {
  const started = Date.now();
  try {
    // Avoid billable extras: no contents/summaries — title+url only may leave snippet empty.
    // Request lightweight highlights so SearchResult.snippet can be populated within free tier.
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        query,
        numResults: 5,
        type: "auto",
        contents: {
          highlights: { maxCharacters: 200 },
        },
      }),
    });
    const ms = Date.now() - started;
    const text = await res.text();
    if (!res.ok) {
      return {
        classification: classifyHttp(res.status),
        httpStatus: res.status,
        detail: text.slice(0, 200),
        ms,
        mapped: [],
        mappingGaps: [],
      };
    }
    let data: ExaRaw & { costDollars?: { total?: number } | number };
    try {
      data = JSON.parse(text) as ExaRaw & {
        costDollars?: { total?: number } | number;
      };
    } catch {
      return {
        classification: "malformed",
        httpStatus: res.status,
        detail: "JSON parse failed",
        ms,
        mapped: [],
        mappingGaps: ["body not JSON"],
        rawPreview: text.slice(0, 120),
      };
    }
    const costUsd =
      typeof data.costDollars === "number"
        ? data.costDollars
        : typeof data.costDollars?.total === "number"
          ? data.costDollars.total
          : undefined;
    const retrievedAt = new Date().toISOString();
    const mapped: SearchResultShape[] = (data.results ?? []).map((r, i) => {
      const highlight = Array.isArray(r.highlights)
        ? r.highlights.filter(Boolean).join(" … ")
        : "";
      const snippet = highlight || r.text || r.summary || "";
      return {
        id: r.id ?? `exa-${i + 1}`,
        title: r.title ?? "",
        url: r.url ?? "",
        snippet,
        provider: "exa",
        retrievedAt,
      };
    });
    if (mapped.length === 0) {
      return {
        classification: "empty",
        httpStatus: res.status,
        detail: "results array empty or missing",
        ms,
        mapped,
        mappingGaps: contractFit(mapped),
        costUsd,
      };
    }
    const gaps = contractFit(mapped);
    // Empty snippets are a soft gap for Exa if highlights missing — flag but still success if url+title present
    const hardGaps = gaps.filter((g) => !g.includes("snippet"));
    const thinSnippets = mapped.filter((m) => !(m.snippet ?? "").trim()).length;
    return {
      classification: hardGaps.length ? "malformed" : "success",
      httpStatus: res.status,
      detail:
        hardGaps.length || thinSnippets
          ? [
              ...hardGaps,
              thinSnippets
                ? `${thinSnippets}/${mapped.length} hits have empty snippet`
                : null,
            ]
              .filter(Boolean)
              .join("; ")
          : undefined,
      ms,
      mapped,
      mappingGaps: gaps,
      costUsd,
    };
  } catch (e) {
    return {
      classification: "network-error",
      detail: e instanceof Error ? e.message : String(e),
      ms: Date.now() - started,
      mapped: [],
      mappingGaps: [],
    };
  }
}

async function runBurst(
  name: string,
  call: (q: string) => ReturnType<typeof callTavily>,
): Promise<{ rows: AttemptRow[]; abortedForBudget: boolean }> {
  console.log(
    `\n=== ${name}: SUSTAINED BURST (15 queries, ~${INTERVAL_MS}ms apart — DuckDuckGo methodology) ===\n`,
  );
  const rows: AttemptRow[] = [];
  let abortedForBudget = false;
  for (let i = 0; i < BURST_QUERIES.length; i++) {
    const query = BURST_QUERIES[i];
    const r = await call(query);
    const row: AttemptRow = {
      n: i + 1,
      query,
      classification: r.classification,
      httpStatus: r.httpStatus,
      detail: r.detail,
      ms: r.ms,
      mapped: r.mapped,
      mappingGaps: r.mappingGaps,
      costUsd: "costUsd" in r ? (r as { costUsd?: number }).costUsd : undefined,
    };
    rows.push(row);
    const statusBit = r.httpStatus != null ? ` HTTP ${r.httpStatus}` : "";
    const costBit =
      row.costUsd != null ? ` cost=$${row.costUsd}` : "";
    const extra = r.detail ? ` — ${r.detail}` : "";
    console.log(
      `${String(i + 1).padStart(2)}. [${r.classification}] ${r.ms}ms${statusBit}${costBit}${extra}`,
    );
    console.log(`    q: ${query}`);
    if (r.mapped.length) {
      console.log(`    hits: ${r.mapped.length}; quality: ${qualityNote(r.mapped)}`);
    }
    if (isBudgetStopStatus(r.httpStatus, r.detail)) {
      abortedForBudget = true;
      console.log(
        `\n!! ${name} burst ABORTED at request ${i + 1}: free-tier/quota/billing signal detected (HTTP ${r.httpStatus}). Not continuing into paid spend.`,
      );
      break;
    }
    if (i < BURST_QUERIES.length - 1) await sleep(INTERVAL_MS);
  }
  const t = tally(rows);
  const cluster = clusteringReport(rows);
  console.log(`\n${name} burst tallies:`, JSON.stringify(t));
  console.log(
    `success rate: ${((t.success / rows.length) * 100).toFixed(1)}% (${t.success}/${rows.length})`,
  );
  console.log(`clustering: ${cluster.summary}`);
  console.log(
    `clustering detail: firstFailureAt=${cluster.firstFailureAt} early(<=6)=${cluster.failuresAtOrBefore6} late(>6)=${cluster.failuresAfter6} duckduckgoLike=${cluster.duckduckgoLikeCluster}`,
  );
  if (abortedForBudget) {
    console.log(`${name} burst incomplete due to budget stop.`);
  }
  return { rows, abortedForBudget };
}

async function runSession(
  name: string,
  call: (q: string) => ReturnType<typeof callTavily>,
): Promise<AttemptRow[]> {
  console.log(`\n=== ${name}: REALISTIC SESSION (4 sequential related queries) ===\n`);
  const rows: AttemptRow[] = [];
  for (let i = 0; i < SESSION_QUERIES.length; i++) {
    const query = SESSION_QUERIES[i];
    const r = await call(query);
    rows.push({
      n: i + 1,
      query,
      classification: r.classification,
      httpStatus: r.httpStatus,
      detail: r.detail,
      ms: r.ms,
      mapped: r.mapped,
      mappingGaps: r.mappingGaps,
    });
    console.log(
      `${i + 1}. [${r.classification}] ${r.ms}ms hits=${r.mapped.length}${r.detail ? ` — ${r.detail}` : ""}`,
    );
    console.log(`   q: ${query}`);
    if (r.mapped[0]) {
      console.log(`   top: ${r.mapped[0].title.slice(0, 80)}`);
      console.log(`        ${r.mapped[0].url}`);
    }
    if (i < SESSION_QUERIES.length - 1) await sleep(INTERVAL_MS);
  }
  const ok = rows.every((r) => r.classification === "success");
  console.log(
    `\n${name} session: ${ok ? "ALL SUCCESS (clean)" : "HAD FAILURES"} — ${rows.filter((r) => r.classification === "success").length}/${rows.length}`,
  );
  return rows;
}

function summarizeProvider(
  name: string,
  keyPresent: boolean,
  burst: AttemptRow[] | null,
  session: AttemptRow[] | null,
  abortedForBudget = false,
): void {
  console.log(`\n========== ${name} SUMMARY ==========`);
  if (!keyPresent) {
    console.log("SKIPPED — API key not set in environment.");
    console.log(
      name === "Tavily"
        ? "Set TAVILY_API_KEY (https://app.tavily.com — free tier, no card)."
        : "Set EXA_API_KEY (https://dashboard.exa.ai/api-keys — free credits).",
    );
    return;
  }
  if (!burst) {
    console.log("Incomplete run.");
    return;
  }
  const bt = tally(burst);
  const cluster = clusteringReport(burst);
  console.log(
    `Burst: ${bt.success}/${burst.length} success (${((bt.success / burst.length) * 100).toFixed(1)}%); ${cluster.summary}`,
  );
  console.log(
    `Burst classification breakdown: ${JSON.stringify(bt)}`,
  );
  console.log(
    `HTTP statuses seen: ${[...new Set(burst.map((r) => r.httpStatus ?? "none"))].join(", ")}`,
  );
  if (abortedForBudget) {
    console.log(
      "Budget stop: burst aborted mid-run after free-tier/quota/billing signal — did not continue into paid spend.",
    );
  }
  if (session) {
    console.log(
      `Session: ${session.filter((r) => r.classification === "success").length}/${session.length} success`,
    );
  } else {
    console.log("Session: skipped (--sustained-burst mode)");
  }
  const sample = burst.find((r) => r.classification === "success")?.mapped ?? [];
  console.log(`Quality spot-check (first burst success): ${qualityNote(sample)}`);
  const gaps = new Set(burst.flatMap((r) => r.mappingGaps ?? []));
  console.log(
    `Contract fit: ${gaps.size === 0 ? "maps cleanly to SearchResult fields (id/title/url/snippet/provider/retrievedAt)" : `gaps observed: ${[...gaps].join(" | ")}`}`,
  );
  const costs = burst
    .map((r) => r.costUsd)
    .filter((c): c is number => typeof c === "number");
  if (costs.length) {
    const total = costs.reduce((a, b) => a + b, 0);
    console.log(
      `Reported cost (sum of provider costDollars over ${costs.length} responses): $${total.toFixed(4)}`,
    );
  }
}

async function main(): Promise<void> {
  const tavilyKey = process.env.TAVILY_API_KEY?.trim();
  const exaKey = process.env.EXA_API_KEY?.trim();
  const sustainedBurstOnly = process.argv.includes("--sustained-burst");

  console.log("=== FSE empirical bake-off: Tavily & Exa ===");
  console.log(`TAVILY_API_KEY: ${tavilyKey ? "PRESENT" : "MISSING"}`);
  console.log(`EXA_API_KEY:    ${exaKey ? "PRESENT" : "MISSING"}`);
  console.log(
    `Mode: ${sustainedBurstOnly ? "sustained-burst only (15×~400ms, DuckDuckGo methodology)" : "burst + session"}`,
  );
  console.log(
    "Order: Exa first (leading candidate), Tavily second.",
  );
  console.log(
    "Note: does not modify packages/search; calls provider APIs directly.",
  );
  console.log(
    "Budget: ~15 Exa searches ≈ $0.105; ~15 Tavily basic ≈ 15 credits. Abort on 402/quota rather than paid spend.",
  );

  if (!tavilyKey && !exaKey) {
    console.log(
      "\nNo provider keys available. Inject TAVILY_API_KEY and/or EXA_API_KEY and re-run:",
    );
    console.log("  pnpm audit-tavily-exa");
    process.exitCode = 2;
    summarizeProvider("Exa", false, null, null);
    summarizeProvider("Tavily", false, null, null);
    return;
  }

  let tavilyBurst: AttemptRow[] | null = null;
  let tavilySession: AttemptRow[] | null = null;
  let exaBurst: AttemptRow[] | null = null;
  let exaSession: AttemptRow[] | null = null;
  let exaAborted = false;
  let tavilyAborted = false;

  // Exa first — this pass exists to close the sustained-load gap for the leading candidate.
  if (exaKey) {
    const call = (q: string) => callExa(exaKey, q);
    const burst = await runBurst("Exa", call);
    exaBurst = burst.rows;
    exaAborted = burst.abortedForBudget;
    if (!sustainedBurstOnly && !exaAborted) {
      exaSession = await runSession("Exa", call);
    }
  } else {
    console.log("\n[Exa] skipped — EXA_API_KEY missing");
  }

  if (tavilyKey) {
    const call = (q: string) => callTavily(tavilyKey, q);
    const burst = await runBurst("Tavily", call);
    tavilyBurst = burst.rows;
    tavilyAborted = burst.abortedForBudget;
    if (!sustainedBurstOnly && !tavilyAborted) {
      tavilySession = await runSession("Tavily", call);
    }
  } else {
    console.log("\n[Tavily] skipped — TAVILY_API_KEY missing");
  }

  summarizeProvider("Exa", Boolean(exaKey), exaBurst, exaSession, exaAborted);
  summarizeProvider(
    "Tavily",
    Boolean(tavilyKey),
    tavilyBurst,
    tavilySession,
    tavilyAborted,
  );

  // Compact machine-readable evidence for the sustained-burst gap close-out.
  const evidence = {
    mode: sustainedBurstOnly ? "sustained-burst" : "burst+session",
    intervalMs: INTERVAL_MS,
    queryCount: BURST_QUERIES.length,
    queries: [...BURST_QUERIES],
    exa: exaBurst
      ? {
          abortedForBudget: exaAborted,
          tallies: tally(exaBurst),
          clustering: clusteringReport(exaBurst),
          rows: exaBurst.map((r) => ({
            n: r.n,
            query: r.query,
            classification: r.classification,
            httpStatus: r.httpStatus ?? null,
            detail: r.detail ?? null,
            ms: r.ms,
            hitCount: r.mapped?.length ?? 0,
            costUsd: r.costUsd ?? null,
          })),
        }
      : null,
    tavily: tavilyBurst
      ? {
          abortedForBudget: tavilyAborted,
          tallies: tally(tavilyBurst),
          clustering: clusteringReport(tavilyBurst),
          rows: tavilyBurst.map((r) => ({
            n: r.n,
            query: r.query,
            classification: r.classification,
            httpStatus: r.httpStatus ?? null,
            detail: r.detail ?? null,
            ms: r.ms,
            hitCount: r.mapped?.length ?? 0,
          })),
        }
      : null,
  };
  console.log("\n=== SUSTAINED-BURST EVIDENCE JSON ===");
  console.log(JSON.stringify(evidence, null, 2));
}

await main();
