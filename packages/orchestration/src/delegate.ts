import type { ResearchDelegation, ResearchPlan } from "@repo/types";

/**
 * Research Delegation — coordination (assigns work).
 * CLOSED-1: lives in packages/orchestration (not core).
 */
export function delegateResearch(plan: ResearchPlan): ResearchDelegation {
  return {
    tasks: plan.sourceKinds.map((sourceKind, index) => ({
      id: `task-${index + 1}`,
      sourceKind,
      query: plan.objective,
    })),
  };
}
