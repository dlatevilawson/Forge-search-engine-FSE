import { analyzeIntent, planExecution, planResearch } from "@repo/core";
import { storeKnowledge } from "@repo/memory";
import {
  analyzeConflict,
  analyzeConsensus,
  assessConfidence,
  weightEvidence,
} from "@repo/reasoning";
import { generateReport } from "@repo/reporting";
import { collectEvidence } from "@repo/search";
import { verifyEvidence } from "@repo/verification";

/** Hardcoded research query for the thinnest vertical slice. */
export const HARDCODED_QUERY =
  "What is the boiling point of water at sea level?";

export interface VerticalSliceResult {
  stages: string[];
  report: ReturnType<typeof generateReport>;
  storedId: string;
}

/**
 * Research Orchestrator stub — the only planner/orchestrator piece with side effects.
 * Calls pure planners in core, then dispatches capability packages.
 * OPEN-2 / OPEN-3 remain open; OPEN-1 closed → this package owns coordination.
 */
export function runVerticalSlice(
  query: string = HARDCODED_QUERY,
): VerticalSliceResult {
  const stages: string[] = [];

  // 1. Intent Analysis — pure transform in core; orchestrator invokes it
  const intent = analyzeIntent(query);
  stages.push("1 Intent Analysis");

  // 2. Research Planning — Research Planner (core, pure)
  const researchPlan = planResearch(intent);
  stages.push("2 Research Planning");

  // 3. Research Delegation — Execution Planner (core, pure) then dispatch here
  const executionPlan = planExecution(researchPlan);
  stages.push("3 Research Delegation");

  // 4. Evidence Collection (search — retrieval only; orchestrator dispatches)
  const candidates = collectEvidence(executionPlan);
  stages.push("4 Evidence Collection");

  // 5. Evidence Verification — façade only (OPEN-2 experiment)
  const attributes = verifyEvidence(candidates);
  stages.push("5 Evidence Verification");

  // 6. Consensus Analysis (reasoning)
  const consensus = analyzeConsensus(attributes);
  stages.push("6 Consensus Analysis");

  // 7. Conflict Analysis (reasoning)
  const conflict = analyzeConflict(attributes);
  stages.push("7 Conflict Analysis");

  // Reasoning weights EvidenceAttributes only — no direct scoreCredibility access
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
