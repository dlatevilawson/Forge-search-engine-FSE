import type { ResearchIntent, ResearchPlan } from "@repo/types";

/**
 * Intent Analysis — pure domain logic (no I/O, no cross-package coordination).
 */
export function analyzeIntent(rawQuery: string): ResearchIntent {
  return {
    rawQuery,
    clarifiedQuestion: rawQuery.trim(),
    decisionGoal: "Establish a factual answer with source-backed confidence",
  };
}

/**
 * Research Planning — pure domain logic producing a plan model.
 * Search *strategy* (what/order) lives here as data; execution is packages/search.
 */
export function planResearch(intent: ResearchIntent): ResearchPlan {
  return {
    objective: intent.clarifiedQuestion,
    sourceKinds: ["web", "docs"],
    priorityNotes: "Prefer primary scientific references; stub strategy only",
  };
}
