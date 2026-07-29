import type { EvidenceCandidate, ExecutionPlan } from "@repo/types";

/**
 * Evidence Collection — retrieval stub only (no strategy, no verification).
 * Consumes Execution Plan task list; does not plan strategy.
 */
export function collectEvidence(executionPlan: ExecutionPlan): EvidenceCandidate[] {
  const ordered = executionPlan.sequence.map((id) => {
    const task = executionPlan.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Execution Plan missing task ${id}`);
    return task;
  });

  return ordered.map((task, index) => ({
    id: `ev-${index + 1}`,
    sourceUrl: `https://stub.example/${task.sourceKind}/${task.id}`,
    sourceLabel: `Stub ${task.sourceKind} source`,
    excerpt:
      index === 0
        ? "Water boils at 100°C (212°F) at 1 atmosphere (sea level)."
        : "At standard atmospheric pressure, the boiling point of pure water is 100 degrees Celsius.",
    claimedPublicationDate: "2020-01-15",
  }));
}
