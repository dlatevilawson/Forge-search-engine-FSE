import type {
  ExecutionPlan,
  ResearchIntent,
  ResearchPlan,
} from "@repo/types";

/**
 * Intent Analysis — pure domain logic (no I/O, no cross-package coordination).
 * Invoked by Research Orchestrator; logic lives here in core.
 */
export function analyzeIntent(rawQuery: string): ResearchIntent {
  return {
    rawQuery,
    clarifiedQuestion: rawQuery.trim(),
    decisionGoal: "Establish a factual answer with source-backed confidence",
  };
}

/**
 * Research Planner — pure.
 * Takes user intent → Research Plan (sources, order, depth). No dispatch.
 */
export function planResearch(intent: ResearchIntent): ResearchPlan {
  return {
    objective: intent.clarifiedQuestion,
    sourceKinds: ["web", "docs"],
    priorityNotes: "Prefer primary scientific references; stub strategy only",
  };
}

/**
 * Execution Planner — pure.
 * Takes Research Plan → Execution Plan (task list + retry params).
 * Decides what should happen; does not make anything happen.
 */
export function planExecution(researchPlan: ResearchPlan): ExecutionPlan {
  const tasks = researchPlan.sourceKinds.map((sourceKind, index) => ({
    id: `task-${index + 1}`,
    sourceKind,
    query: researchPlan.objective,
    maxAttempts: 1,
  }));
  return {
    tasks,
    sequence: tasks.map((t) => t.id),
  };
}
