/**
 * Exercise orchestration retry against forced search failure modes.
 * Does not require network when SEARCH_FORCE_FAILURE is set.
 */
import { planExecution, planResearch, analyzeIntent } from "@repo/core";
import { retrieveTaskWithRetry } from "./run-vertical-slice.ts";
import type { RetrievalAttemptLog } from "./run-vertical-slice.ts";

const mode = process.env.SEARCH_FORCE_FAILURE;
if (!mode) {
  console.error(
    "Set SEARCH_FORCE_FAILURE=transient-error|no-results|hard-error",
  );
  process.exit(1);
}

const intent = analyzeIntent("What is the boiling point of water at sea level?");
const plan = planExecution(planResearch(intent));
const task = plan.tasks[0];
const log: RetrievalAttemptLog[] = [];

console.log(`=== Failure exercise: ${mode} ===`);
console.log(`Task ${task.id} maxAttempts=${task.maxAttempts}`);

const outcome = await retrieveTaskWithRetry(task, log);

console.log("Attempts:");
for (const entry of log) {
  console.log(
    `  ${entry.attempt}/${entry.maxAttempts}: ${entry.outcome}${entry.detail ? ` — ${entry.detail}` : ""}`,
  );
}
console.log(`Final outcome: ${outcome.status}`);
console.log(
  `Retry policy: transient retried=${mode === "transient-error" && log.length === task.maxAttempts}; no-results/hard-error not retried beyond first decision=${mode !== "transient-error" && log.length === 1}`,
);
