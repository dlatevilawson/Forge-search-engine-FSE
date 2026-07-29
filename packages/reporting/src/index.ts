import type {
  ConfidenceAssessment,
  ConflictResult,
  ConsensusResult,
  EvidenceAttributes,
  ResearchIntent,
  ResearchReport,
} from "@repo/types";

/** Report Generation — assembly only; does not own memory or workspace. */
export function generateReport(input: {
  intent: ResearchIntent;
  evidence: EvidenceAttributes[];
  consensus: ConsensusResult;
  conflict: ConflictResult;
  confidence: ConfidenceAssessment;
}): ResearchReport {
  const { intent, evidence, consensus, conflict, confidence } = input;
  return {
    executiveSummary:
      "Stub report: at sea level (1 atm), pure water boils at 100°C / 212°F.",
    researchObjective: intent.clarifiedQuestion,
    keyFindings: [
      "Boiling point at sea level is 100°C under standard atmospheric pressure",
      `Confidence band: ${confidence.band}`,
    ],
    evidence,
    expertConsensus: consensus.summary,
    conflictingEvidence: conflict.summary,
    confidenceAssessment: confidence.explanation,
    importantUnknowns: confidence.unknowns,
    recommendedNextSteps: [
      "Replace stubs with real retrieval and verification",
      "Re-run with altitude and impurity variations",
    ],
    references: evidence.map((e) => e.sourceUrl),
  };
}
