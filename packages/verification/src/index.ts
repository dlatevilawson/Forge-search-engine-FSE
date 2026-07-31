import type {
  EvidenceAttributes,
  EvidenceCandidate,
  VerificationOutcome,
} from "@repo/types";
import { checkClaimConsistency } from "./consistency.ts";
import { scoreCredibility } from "./credibility.ts";

export type VerifyEvidenceOptions = {
  /** Research query / claim the candidates must be checked against. */
  query: string;
};

/**
 * Verification façade — single public entry for Evidence Verification.
 *
 * Internally:
 * 1. Deterministic credibility scoring (`scoreCredibility` — private, not exported)
 * 2. LLM-based claim-consistency check (`checkClaimConsistency` — private)
 *
 * Callers (orchestration) must only call `verifyEvidence`. Do not import scoring internals.
 * Does not retry LLM failures — returns typed VerificationOutcome for orchestration to decide.
 */
export async function verifyEvidence(
  candidates: EvidenceCandidate[],
  options: VerifyEvidenceOptions,
): Promise<VerificationOutcome> {
  const query = options.query?.trim();
  if (!query) {
    return {
      status: "hard-error",
      detail: "Verification requires a non-empty query for claim-consistency checking",
      retryable: false,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      status: "hard-error",
      detail: "OPENAI_API_KEY is not set",
      retryable: false,
    };
  }

  const now = new Date().toISOString();
  const attributes: EvidenceAttributes[] = [];

  for (const candidate of candidates) {
    const credibility = scoreCredibility(candidate);
    const consistency = await checkClaimConsistency(candidate, query, apiKey);

    if (consistency.status === "transient-error") {
      return {
        status: "transient-error",
        detail: consistency.detail,
        retryable: true,
        partialAttributes: attributes.length ? attributes : undefined,
      };
    }
    if (consistency.status === "hard-error") {
      return {
        status: "hard-error",
        detail: consistency.detail,
        retryable: false,
      };
    }

    attributes.push({
      evidenceId: candidate.id,
      sourceUrl: candidate.sourceUrl,
      sourceCredibility: credibility.score,
      credibilityRationale: credibility.rationale,
      publicationDate: candidate.claimedPublicationDate,
      factualConsistency: consistency.factualConsistency,
      claimSupport: consistency.claimSupport,
      consistencyRationale: consistency.rationale,
      verifiedAt: now,
    });
  }

  return { status: "success", attributes };
}
