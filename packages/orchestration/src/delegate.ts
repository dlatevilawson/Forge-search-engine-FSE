import type { ResearchDelegation, ResearchPlan } from "@repo/types";

/**
 * Research Delegation — coordination (assigns work). Lives here because it
 * sequences/delegates rather than holding pure domain models.
 *
 * OPEN-1 remains open: this package exists because the vertical slice needed a
 * home for coordination; founders still decide whether this is the lasting home.
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
