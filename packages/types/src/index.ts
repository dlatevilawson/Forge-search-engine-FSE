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
  /** Which retrieval backend produced this hit. */
  provider: "duckduckgo" | "brave";
  retrievedAt: string;
}

/**
 * Typed search outcomes. packages/search surfaces these; packages/orchestration decides retries.
 * Search must not retry internally.
 */
export type SearchOutcome =
  | { status: "success"; query: string; results: SearchResult[] }
  | { status: "no-results"; query: string; detail?: string }
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
  claimedPublicationDate: string;
}

/**
 * Evidence attributes — Verification → Reasoning handoff contract (Principle 6).
 * Reasoning must consume this shape; it must not invent a parallel ad hoc structure.
 */
export interface EvidenceAttributes {
  evidenceId: string;
  sourceUrl: string;
  /** 0–1 credibility embedded by Verification façade (internal scoring step). */
  sourceCredibility: number;
  publicationDate: string;
  /** Stubbed 0–1 consistency check from Verification */
  factualConsistency: number;
  claimSupport: "supports" | "refutes" | "neutral";
  verifiedAt: string;
}

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
