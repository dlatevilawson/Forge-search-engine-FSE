import type { EvidenceCandidate } from "@repo/types";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

export type ConsistencySuccess = {
  status: "success";
  claimSupport: "supports" | "refutes" | "neutral";
  /** 0–1 relatedness to the query (not a truth score). */
  factualConsistency: number;
  rationale: string;
};

export type ConsistencyFailure =
  | { status: "transient-error"; detail: string; retryable: true }
  | { status: "hard-error"; detail: string; retryable: false };

export type ConsistencyOutcome = ConsistencySuccess | ConsistencyFailure;

type LlmJson = {
  claimSupport?: string;
  factualConsistency?: number;
  rationale?: string;
  related?: boolean;
};

/**
 * LLM-based claim-consistency check: does title+snippet relate to the research query?
 * Not fact-checking / truth verification. Does not retry — surfaces typed failures.
 */
export async function checkClaimConsistency(
  candidate: EvidenceCandidate,
  query: string,
  apiKey: string,
): Promise<ConsistencyOutcome> {
  const system = [
    "You assess whether a search result relates to a research query.",
    "This is consistency/relevance checking ONLY — not fact-checking and not truth verification.",
    "Return strict JSON with keys:",
    '  claimSupport: "supports" | "refutes" | "neutral"',
    "  factualConsistency: number 0..1 (how well the content addresses the query; off-topic → low)",
    "  rationale: short human-readable explanation (1-2 sentences)",
    "Use supports if the content clearly answers or affirms the query topic;",
    "refutes if it contradicts the apparent claim in the query;",
    "neutral if related but stance-unclear, or if off-topic (then set factualConsistency low).",
  ].join(" ");

  const user = JSON.stringify({
    query,
    result: {
      title: candidate.sourceLabel,
      url: candidate.sourceUrl,
      snippet: candidate.excerpt,
      publishedDate: candidate.claimedPublicationDate,
    },
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: controller.signal,
    });

    const text = await response.text();

    if (response.status === 429 || response.status === 408 || response.status >= 500) {
      return {
        status: "transient-error",
        detail: `OpenAI HTTP ${response.status}: ${text.slice(0, 200)}`,
        retryable: true,
      };
    }

    if (response.status === 401 || response.status === 403 || response.status === 400) {
      return {
        status: "hard-error",
        detail: `OpenAI HTTP ${response.status}: ${text.slice(0, 200)}`,
        retryable: false,
      };
    }

    if (!response.ok) {
      return {
        status: "hard-error",
        detail: `OpenAI HTTP ${response.status}: ${text.slice(0, 200)}`,
        retryable: false,
      };
    }

    let parsedOuter: { choices?: Array<{ message?: { content?: string } }> };
    try {
      parsedOuter = JSON.parse(text) as typeof parsedOuter;
    } catch {
      return {
        status: "transient-error",
        detail: "OpenAI response was not valid JSON",
        retryable: true,
      };
    }

    const content = parsedOuter.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return {
        status: "transient-error",
        detail: "OpenAI response missing message content",
        retryable: true,
      };
    }

    let body: LlmJson;
    try {
      body = JSON.parse(content) as LlmJson;
    } catch {
      return {
        status: "transient-error",
        detail: "OpenAI message content was not valid JSON",
        retryable: true,
      };
    }

    const supportRaw = (body.claimSupport ?? "neutral").toLowerCase();
    const claimSupport: ConsistencySuccess["claimSupport"] =
      supportRaw === "supports" || supportRaw === "refutes" || supportRaw === "neutral"
        ? supportRaw
        : "neutral";

    let factualConsistency = Number(body.factualConsistency);
    if (!Number.isFinite(factualConsistency)) {
      factualConsistency = 0.5;
    }
    factualConsistency = Math.max(0, Math.min(1, Number(factualConsistency.toFixed(3))));

    const rationale =
      typeof body.rationale === "string" && body.rationale.trim()
        ? body.rationale.trim()
        : "No rationale returned by model.";

    return {
      status: "success",
      claimSupport,
      factualConsistency,
      rationale,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const name = error instanceof Error ? error.name : "";
    const transient =
      name === "AbortError" ||
      /timeout|network|fetch failed|econnreset|enotfound|aborted/i.test(message);
    if (transient) {
      return {
        status: "transient-error",
        detail: message,
        retryable: true,
      };
    }
    return {
      status: "hard-error",
      detail: message,
      retryable: false,
    };
  } finally {
    clearTimeout(timer);
  }
}
