import type { EvidenceCandidate, ResearchDelegation } from "@repo/types";

/**
 * Evidence Collection — retrieval stub only (no strategy, no verification).
 */
export function collectEvidence(delegation: ResearchDelegation): EvidenceCandidate[] {
  return delegation.tasks.map((task, index) => ({
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
