/**
 * Shared data contracts for the vertical slice.
 * Capability packages depend on these shapes — not on each other's internals.
 */

/** Clarified research intent produced by Intent Analysis. */
export interface ResearchIntent {
  rawQuery: string;
  clarifiedQuestion: string;
  decisionGoal: string;
}

/**
 * Investigation plan produced by Research Planner (packages/core).
 * Describes which sources to consult, in what order, at what depth — not dispatch.
 */
export interface ResearchPlan {
  objective: string;
  sourceKinds: Array<"web" | "youtube" | "docs" | "papers">;
  priorityNotes: string;
}

/**
 * Concrete execution plan produced by Execution Planner (packages/core).
 * Describes what should be dispatched and with what retry parameters — pure data.
 * Research Orchestrator consumes this and actually runs it.
 */
export interface ExecutionPlan {
  tasks: Array<{
    id: string;
    sourceKind: "web" | "youtube" | "docs" | "papers";
    query: string;
    maxAttempts: number;
  }>;
  /** Task ids in intended dispatch sequence. */
  sequence: string[];
}

/**
 * Web (and future source) retrieval hit — Search → Orchestration handoff contract.
 * Verification still consumes EvidenceCandidate; orchestration adapts SearchResult → candidate.
 */
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  /** Which retrieval backend produced this hit. Production web path emits `"exa"`. */
  provider: "exa" | "brave" | "duckduckgo";
  /**
   * Source publication date from the provider when known.
   * ISO-8601 (or provider-native date string) when present; `null` when genuinely absent.
   * Do not use placeholder strings like `"unknown"`.
   */
  publishedDate: string | null;
  retrievedAt: string;
}

/**
 * Typed search outcomes. packages/search surfaces these; packages/orchestration decides next steps.
 * Search must not retry internally.
 *
 * Four outcomes:
 * - success
 * - no-usable-results (legitimate empty hit set — not an exception)
 * - transient-error (retryable)
 * - hard-error (not retryable)
 */
export type SearchOutcome =
  | { status: "success"; query: string; results: SearchResult[] }
  | { status: "no-usable-results"; query: string; detail?: string }
  | {
      status: "transient-error";
      query: string;
      detail: string;
      /** Always true — orchestration may retry. */
      retryable: true;
    }
  | {
      status: "hard-error";
      query: string;
      detail: string;
      /** Always false — orchestration must not retry as-if transient. */
      retryable: false;
    };

/** Raw evidence candidate from retrieval (pre-verification). */
export interface EvidenceCandidate {
  id: string;
  sourceUrl: string;
  sourceLabel: string;
  excerpt: string;
  /**
   * Claimed publication date from retrieval.
   * Real provider value when known; `null` when absent — never a placeholder string.
   */
  claimedPublicationDate: string | null;
}

/**
 * Evidence attributes — Verification → Reasoning handoff contract (Principle 6).
 * Reasoning must consume this shape; it must not invent a parallel ad hoc structure.
 *
 * Credibility score and claim-consistency are kept as **distinct** fields so consumers
 * can weight "credible but off-topic" differently from "on-topic but weak source"
 * (relevant to OPEN-2 — do not collapse them inside Verification).
 */
export interface EvidenceAttributes {
  evidenceId: string;
  sourceUrl: string;
  /** 0–1 source credibility from Verification's private scoring step. */
  sourceCredibility: number;
  /** Human-readable explanation of which signals drove sourceCredibility. */
  credibilityRationale: string;
  /** From EvidenceCandidate; `null` when retrieval had no date. */
  publicationDate: string | null;
  /**
   * 0–1 how well this candidate's content relates to / addresses the research query
   * (claim-consistency). Not a general truth score.
   */
  factualConsistency: number;
  /** Stance relative to the query when related; off-topic maps to neutral + low consistency. */
  claimSupport: "supports" | "refutes" | "neutral";
  /** Human-readable explanation of the consistency verdict. */
  consistencyRationale: string;
  verifiedAt: string;
}

/**
 * Typed verification outcomes — packages/verification surfaces these;
 * packages/orchestration decides retry/recovery (Verification must not retry LLM calls).
 */
export type VerificationOutcome =
  | { status: "success"; attributes: EvidenceAttributes[] }
  | {
      status: "transient-error";
      detail: string;
      retryable: true;
      /** Credibility may have completed; consistency step failed transiently. */
      partialAttributes?: EvidenceAttributes[];
    }
  | {
      status: "hard-error";
      detail: string;
      retryable: false;
    };

export interface ConsensusResult {
  summary: string;
  agreeingEvidenceIds: string[];
}

export interface ConflictResult {
  summary: string;
  conflictingEvidenceIds: string[];
}

/** Reasoning-side weights derived from EvidenceAttributes (OPEN-2 boundary). */
export interface EvidenceWeight {
  evidenceId: string;
  weight: number;
}

export interface ConfidenceAssessment {
  score: number;
  band: "low" | "medium" | "high";
  unknowns: string[];
  explanation: string;
}

export interface ResearchReport {
  executiveSummary: string;
  researchObjective: string;
  keyFindings: string[];
  evidence: EvidenceAttributes[];
  expertConsensus: string;
  conflictingEvidence: string;
  confidenceAssessment: string;
  importantUnknowns: string[];
  recommendedNextSteps: string[];
  references: string[];
}

export interface StoredKnowledgeRecord {
  id: string;
  storedAt: string;
  report: ResearchReport;
}
