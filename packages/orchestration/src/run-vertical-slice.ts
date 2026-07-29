import { analyzeIntent, planResearch } from "@repo/core";
import { storeKnowledge } from "@repo/memory";
import {
  analyzeConflict,
  analyzeConsensus,
  assessConfidence,
  weightEvidence,
} from "@repo/reasoning";
import { generateReport } from "@repo/reporting";
import { collectEvidence } from "@repo/search";
import { scoreCredibility, verifyEvidence } from "@repo/verification";
import { delegateResearch } from "./delegate.ts";

/** Hardcoded research query for the thinnest vertical slice. */
export const HARDCODED_QUERY =
  "What is the boiling point of water at sea level?";

export interface VerticalSliceResult {
  stages: string[];
  report: ReturnType<typeof generateReport>;
  storedId: string;
}

/**
 * Runs all ten Logical Research Pipeline stages as distinct calls.
 * Stub-only. OPEN-2 and OPEN-3 remain open; OPEN-1 closed → this package.
 */
export function runVerticalSlice(
  query: string = HARDCODED_QUERY,
): VerticalSliceResult {
  const stages: string[] = [];

  // 1. Intent Analysis (core — pure)
  const intent = analyzeIntent(query);
  stages.push("1 Intent Analysis");

  // 2. Research Planning (core — pure)
  const plan = planResearch(intent);
  stages.push("2 Research Planning");

  // 3. Research Delegation (orchestration — coordination)
  const delegation = delegateResearch(plan);
  stages.push("3 Research Delegation");

  // 4. Evidence Collection (search — retrieval only)
  const candidates = collectEvidence(delegation);
  stages.push("4 Evidence Collection");

  // 5. Evidence Verification — OPEN-2 seam starts here:
  //    Verification.scoreCredibility (distinct) → EvidenceAttributes contract
  const credibilityByEvidenceId = Object.fromEntries(
    candidates.map((candidate) => [candidate.id, scoreCredibility(candidate)]),
  );
  const attributes = verifyEvidence(candidates, credibilityByEvidenceId);
  stages.push("5 Evidence Verification");

  // 6. Consensus Analysis (reasoning)
  const consensus = analyzeConsensus(attributes);
  stages.push("6 Consensus Analysis");

  // 7. Conflict Analysis (reasoning)
  const conflict = analyzeConflict(attributes);
  stages.push("7 Conflict Analysis");

  // OPEN-2 seam continues: Reasoning.weightEvidence consumes EvidenceAttributes
  // (must not invent a parallel structure; must not call scoreCredibility).
  const weights = weightEvidence(attributes);

  // 8. Confidence Assessment (reasoning)
  const confidence = assessConfidence(attributes, weights, consensus, conflict);
  stages.push("8 Confidence Assessment");

  // 9. Report Generation (reporting)
  const report = generateReport({
    intent,
    evidence: attributes,
    consensus,
    conflict,
    confidence,
  });
  stages.push("9 Report Generation");

  // 10. Knowledge Storage (memory — in-memory stub; no workspace)
  const stored = storeKnowledge(report);
  stages.push("10 Knowledge Storage");

  return { stages, report, storedId: stored.id };
}
