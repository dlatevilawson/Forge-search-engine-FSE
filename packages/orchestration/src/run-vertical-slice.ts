import { analyzeIntent, planExecution, planResearch } from "@repo/core";
import { storeKnowledge } from "@repo/memory";
import {
  analyzeConflict,
  analyzeConsensus,
  assessConfidence,
  weightEvidence,
} from "@repo/reasoning";
import { generateReport } from "@repo/reporting";
import { retrieveForSourceKind } from "@repo/search";
import type {
  EvidenceCandidate,
  ExecutionPlan,
  SearchOutcome,
  SearchResult,
} from "@repo/types";
import { verifyEvidence } from "@repo/verification";

/** Hardcoded research query for the thinnest vertical slice. */
export const HARDCODED_QUERY =
  "What is the boiling point of water at sea level?";

export interface RetrievalAttemptLog {
  taskId: string;
  sourceKind: string;
  attempt: number;
  maxAttempts: number;
  outcome: SearchOutcome["status"];
  detail?: string;
}

export interface VerticalSliceResult {
  stages: string[];
  report: ReturnType<typeof generateReport>;
  storedId: string;
  searchResults: SearchResult[];
  retrievalLog: RetrievalAttemptLog[];
  /**
   * Aggregate Evidence Collection outcome for the run.
   * Policy for non-success (retry broader, clarify, fail session) is founder-owned —
   * this field exists so orchestration can pattern-match without throwing.
   */
  collectionOutcome: SearchOutcome["status"];
}

/**
 * Adapt SearchResult → EvidenceCandidate for the still-stubbed verification façade.
 * Lives in orchestration so packages/verification stays untouched this pass.
 */
export function searchResultsToEvidenceCandidates(
  results: SearchResult[],
): EvidenceCandidate[] {
  return results.map((result) => ({
    id: result.id,
    sourceUrl: result.url,
    sourceLabel: result.title,
    excerpt: result.snippet,
    // SearchResult has no publication date — placeholder until a richer contract.
    claimedPublicationDate: "unknown",
  }));
}

/**
 * Orchestration-owned retry: search surfaces typed outcomes; we decide retries.
 * Retries only `transient-error`. Does not retry no-usable-results or hard-error.
 */
export async function retrieveTaskWithRetry(
  task: ExecutionPlan["tasks"][number],
  log: RetrievalAttemptLog[],
): Promise<SearchOutcome> {
  let last: SearchOutcome | undefined;

  for (let attempt = 1; attempt <= task.maxAttempts; attempt++) {
    const outcome = await retrieveForSourceKind(task.sourceKind, task.query);
    last = outcome;
    log.push({
      taskId: task.id,
      sourceKind: task.sourceKind,
      attempt,
      maxAttempts: task.maxAttempts,
      outcome: outcome.status,
      detail: "detail" in outcome ? outcome.detail : undefined,
    });

    if (
      outcome.status === "success" ||
      outcome.status === "no-usable-results"
    ) {
      return outcome;
    }
    if (outcome.status === "hard-error") {
      return outcome;
    }
    // transient-error — retry if attempts remain
    if (attempt < task.maxAttempts) {
      continue;
    }
    return outcome;
  }

  return (
    last ?? {
      status: "hard-error",
      query: task.query,
      detail: "No retrieval attempts executed",
      retryable: false,
    }
  );
}

function summarizeCollectionOutcome(
  taskOutcomes: SearchOutcome[],
  collectedCount: number,
): SearchOutcome["status"] {
  if (collectedCount > 0) return "success";
  if (taskOutcomes.some((o) => o.status === "no-usable-results")) {
    return "no-usable-results";
  }
  if (taskOutcomes.some((o) => o.status === "transient-error")) {
    return "transient-error";
  }
  if (taskOutcomes.some((o) => o.status === "hard-error")) {
    return "hard-error";
  }
  return "no-usable-results";
}

/**
 * Research Orchestrator — side-effectful run loop.
 * Real web retrieval via packages/search; downstream stages remain stubbed.
 */
export async function runVerticalSlice(
  query: string = HARDCODED_QUERY,
): Promise<VerticalSliceResult> {
  const stages: string[] = [];
  const retrievalLog: RetrievalAttemptLog[] = [];

  const intent = analyzeIntent(query);
  stages.push("1 Intent Analysis");

  const researchPlan = planResearch(intent);
  stages.push("2 Research Planning");

  const executionPlan = planExecution(researchPlan);
  stages.push("3 Research Delegation");

  const collected: SearchResult[] = [];
  const taskOutcomes: SearchOutcome[] = [];
  for (const taskId of executionPlan.sequence) {
    const task = executionPlan.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error(`Execution Plan missing task ${taskId}`);
    }
    const outcome = await retrieveTaskWithRetry(task, retrievalLog);
    taskOutcomes.push(outcome);
    if (outcome.status === "success") {
      collected.push(...outcome.results);
    }
    // no-usable-results / transient-error / hard-error: recorded, not thrown.
    // Founder policy for next action is deferred.
  }
  stages.push("4 Evidence Collection");

  const collectionOutcome = summarizeCollectionOutcome(
    taskOutcomes,
    collected.length,
  );

  // Minimal adapter — verification package untouched. Empty candidates are valid
  // when collectionOutcome is non-success (placeholder path; not a product policy).
  const candidates = searchResultsToEvidenceCandidates(collected);
  const attributes = verifyEvidence(candidates);
  stages.push("5 Evidence Verification");

  const consensus = analyzeConsensus(attributes);
  stages.push("6 Consensus Analysis");

  const conflict = analyzeConflict(attributes);
  stages.push("7 Conflict Analysis");

  const weights = weightEvidence(attributes);
  const confidence = assessConfidence(attributes, weights, consensus, conflict);
  stages.push("8 Confidence Assessment");

  const report = generateReport({
    intent,
    evidence: attributes,
    consensus,
    conflict,
    confidence,
  });
  stages.push("9 Report Generation");

  const stored = storeKnowledge(report);
  stages.push("10 Knowledge Storage");

  return {
    stages,
    report,
    storedId: stored.id,
    searchResults: collected,
    retrievalLog,
    collectionOutcome,
  };
}
