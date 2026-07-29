import type { EvidenceAttributes, EvidenceCandidate } from "@repo/types";

/**
 * Stub credibility scoring (Verification side of OPEN-2).
 * Kept as its own function so the boundary with Reasoning.weightEvidence stays visible.
 */
export function scoreCredibility(candidate: EvidenceCandidate): number {
  // Stub only — not real scoring. Docs sources slightly preferred.
  if (candidate.sourceUrl.includes("/docs/")) return 0.92;
  if (candidate.sourceUrl.includes("/web/")) return 0.85;
  return 0.7;
}

/**
 * Evidence Verification — produces the EvidenceAttributes contract for Reasoning.
 * Credibility must be supplied from scoreCredibility (distinct call) so OPEN-2 stays visible.
 */
export function verifyEvidence(
  candidates: EvidenceCandidate[],
  credibilityByEvidenceId: Record<string, number>,
): EvidenceAttributes[] {
  const now = new Date().toISOString();
  return candidates.map((candidate) => {
    const sourceCredibility = credibilityByEvidenceId[candidate.id];
    if (sourceCredibility === undefined) {
      throw new Error(
        `Missing credibility score for ${candidate.id}; call scoreCredibility first`,
      );
    }
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
