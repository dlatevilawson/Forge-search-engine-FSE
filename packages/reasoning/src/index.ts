import type {
  ConfidenceAssessment,
  ConflictResult,
  ConsensusResult,
  EvidenceAttributes,
  EvidenceWeight,
} from "@repo/types";

/**
 * Stub evidence weighting (Reasoning side of OPEN-2).
 * Consumes the EvidenceAttributes contract from Verification — not an ad hoc parallel shape.
 * Does not call verification internals (credibility scoring is private to the verification façade).
 */
export function weightEvidence(attributes: EvidenceAttributes[]): EvidenceWeight[] {
  return attributes.map((item) => ({
    evidenceId: item.evidenceId,
    // Combines EvidenceAttributes contract fields for reasoning (not verification internals).
    weight: Number(
      (
        item.sourceCredibility * 0.6 +
        item.factualConsistency * 0.4
      ).toFixed(3),
    ),
  }));
}

/** Consensus Analysis stub. */
export function analyzeConsensus(attributes: EvidenceAttributes[]): ConsensusResult {
  const supporting = attributes.filter((a) => a.claimSupport === "supports");
  return {
    summary:
      supporting.length > 0
        ? "Stub consensus: independent sources agree on 100°C at sea level."
        : "Stub consensus: insufficient supporting evidence.",
    agreeingEvidenceIds: supporting.map((a) => a.evidenceId),
  };
}

/** Conflict Analysis stub. */
export function analyzeConflict(attributes: EvidenceAttributes[]): ConflictResult {
  const conflicting = attributes.filter((a) => a.claimSupport === "refutes");
  return {
    summary:
      conflicting.length === 0
        ? "Stub conflict: no material disagreements in this slice."
        : "Stub conflict: conflicting claims present.",
    conflictingEvidenceIds: conflicting.map((a) => a.evidenceId),
  };
}

/** Confidence Assessment stub — uses Reasoning weights, not Verification scores directly. */
export function assessConfidence(
  attributes: EvidenceAttributes[],
  weights: EvidenceWeight[],
  consensus: ConsensusResult,
  conflict: ConflictResult,
): ConfidenceAssessment {
  const avgWeight =
    weights.reduce((sum, w) => sum + w.weight, 0) / Math.max(weights.length, 1);
  const score = Number(avgWeight.toFixed(3));
  const band: ConfidenceAssessment["band"] =
    score >= 0.85 ? "high" : score >= 0.6 ? "medium" : "low";

  return {
    score,
    band,
    unknowns: [
      "Stub slice did not vary altitude or purity",
      "No real source corpus was queried",
    ],
    explanation: `Stub confidence ${band} (${score}) from weighted EvidenceAttributes; consensus="${consensus.summary}"; conflict="${conflict.summary}"; n=${attributes.length}.`,
  };
}
