import type { EvidenceCandidate } from "@repo/types";

/**
 * Small, explicit domain-tier lists for first-pass credibility scoring.
 * Not a comprehensive reputation taxonomy — expand deliberately later.
 */
const HIGH_TIER_HOST_SUFFIXES = [
  ".gov",
  ".edu",
  ".gov.uk",
  ".ac.uk",
] as const;

const HIGH_TIER_HOSTS = new Set([
  "wikipedia.org",
  "en.wikipedia.org",
  "nist.gov",
  "who.int",
  "cdc.gov",
  "nih.gov",
  "pubmed.ncbi.nlm.nih.gov",
  "ncbi.nlm.nih.gov",
  "nature.com",
  "science.org",
  "sciencedirect.com",
  "springer.com",
  "arxiv.org",
  "iapws.org",
  "britannica.com",
]);

const MEDIUM_TIER_HOSTS = new Set([
  "reuters.com",
  "bbc.com",
  "bbc.co.uk",
  "nytimes.com",
  "apnews.com",
  "theguardian.com",
  "washingtonpost.com",
  "npr.org",
  "cnn.com",
  "forbes.com",
  "bloomberg.com",
  "aws.amazon.com",
  "cloud.google.com",
  "microsoft.com",
  "ibm.com",
  "nvidia.com",
]);

export type CredibilityScore = {
  score: number;
  rationale: string;
};

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function domainTier(host: string | null): {
  tier: "high" | "medium" | "default";
  reason: string;
} {
  if (!host) {
    return { tier: "default", reason: "unparseable host" };
  }
  if (HIGH_TIER_HOSTS.has(host)) {
    return { tier: "high", reason: `high-tier reference host (${host})` };
  }
  for (const suffix of HIGH_TIER_HOST_SUFFIXES) {
    if (host.endsWith(suffix)) {
      return { tier: "high", reason: `high-tier suffix (${suffix}) on ${host}` };
    }
  }
  // Match registrable parent (e.g. news.bbc.co.uk → bbc.co.uk already listed;
  // foo.nature.com → nature.com)
  const parts = host.split(".");
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join(".");
    if (HIGH_TIER_HOSTS.has(parent)) {
      return { tier: "high", reason: `high-tier parent host (${parent})` };
    }
    if (MEDIUM_TIER_HOSTS.has(parent)) {
      return { tier: "medium", reason: `medium-tier parent host (${parent})` };
    }
  }
  if (MEDIUM_TIER_HOSTS.has(host)) {
    return { tier: "medium", reason: `medium-tier host (${host})` };
  }
  return { tier: "default", reason: `unlisted/low-signal host (${host})` };
}

function dateSignal(claimed: string | null): {
  points: number;
  reason: string;
} {
  if (claimed == null || !claimed.trim()) {
    return { points: 0, reason: "no publication date (null)" };
  }
  const ms = Date.parse(claimed);
  if (Number.isNaN(ms)) {
    return { points: 0, reason: `publication date present but unparseable ("${claimed}")` };
  }
  return { points: 0.12, reason: `parseable publication date (${claimed})` };
}

/**
 * Deterministic credibility scoring — private to Verification (OPEN-2 façade).
 * Signals: domain tier, publication-date presence/parseability, HTTPS.
 * Author/byline is not on EvidenceCandidate yet — noted, not invented.
 */
export function scoreCredibility(candidate: EvidenceCandidate): CredibilityScore {
  const host = hostnameOf(candidate.sourceUrl);
  const domain = domainTier(host);
  const date = dateSignal(candidate.claimedPublicationDate);

  let score = 0.45;
  const parts: string[] = [];

  if (domain.tier === "high") {
    score += 0.3;
    parts.push(`+0.30 domain: ${domain.reason}`);
  } else if (domain.tier === "medium") {
    score += 0.15;
    parts.push(`+0.15 domain: ${domain.reason}`);
  } else {
    parts.push(`+0.00 domain: ${domain.reason}`);
  }

  score += date.points;
  parts.push(
    date.points > 0
      ? `+${date.points.toFixed(2)} date: ${date.reason}`
      : `+0.00 date: ${date.reason}`,
  );

  const isHttps = /^https:\/\//i.test(candidate.sourceUrl);
  if (isHttps) {
    score += 0.08;
    parts.push("+0.08 transport: HTTPS");
  } else if (/^http:\/\//i.test(candidate.sourceUrl)) {
    score -= 0.1;
    parts.push("-0.10 transport: non-HTTPS");
  } else {
    parts.push("+0.00 transport: scheme unclear");
  }

  parts.push(
    "author/byline: not available on EvidenceCandidate (signal skipped)",
  );

  // Clamp
  score = Math.max(0, Math.min(1, Number(score.toFixed(3))));

  return {
    score,
    rationale: `base 0.45; ${parts.join("; ")} → ${score.toFixed(3)}`,
  };
}
