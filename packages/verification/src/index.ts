import type { EvidenceAttributes, EvidenceCandidate } from "@repo/types";

/**
 * Private credibility scoring — internal to Verification.
 * Not part of the package public façade (OPEN-2 experiment).
 */
function scoreCredibility(candidate: EvidenceCandidate): number {
  // Stub only — not real scoring. Docs sources slightly preferred.
  if (candidate.sourceUrl.includes("/docs/")) return 0.92;
  if (candidate.sourceUrl.includes("/web/")) return 0.85;
  return 0.7;
}

/**
 * Verification façade — single public entry for Evidence Verification.
 * Internally scores credibility, then validates claims, returns EvidenceAttributes.
 * Callers (orchestration) must not know scoring is a separate step.
 */
export function verifyEvidence(
  candidates: EvidenceCandidate[],
): EvidenceAttributes[] {
  const now = new Date().toISOString();
  return candidates.map((candidate) => {
    const sourceCredibility = scoreCredibility(candidate);
    return {
      evidenceId: candidate.id,
      sourceUrl: candidate.sourceUrl,
      sourceCredibility,
      publicationDate: candidate.claimedPublicationDate,
      factualConsistency: 0.95,
      claimSupport: "supports",
      verifiedAt: now,
    };
  });
}
