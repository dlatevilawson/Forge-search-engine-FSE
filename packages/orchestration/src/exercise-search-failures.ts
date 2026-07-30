/**
 * Exercise orchestration against forced search outcome types.
 * Does not require network when SEARCH_FORCE_FAILURE is set.
 */
import { analyzeIntent, planExecution, planResearch } from "@repo/core";
import {
  retrieveTaskWithRetry,
  runVerticalSlice,
  type RetrievalAttemptLog,
} from "./run-vertical-slice.ts";

const mode = process.env.SEARCH_FORCE_FAILURE;
if (!mode) {
  console.error(
    "Set SEARCH_FORCE_FAILURE=no-usable-results|transient-error|hard-error",
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
const isTransient = mode === "transient-error";
console.log(
  `Retry policy: transient retried=${isTransient && log.length === task.maxAttempts}; no-usable-results/hard-error single-shot=${!isTransient && log.length === 1}`,
);

if (mode === "no-usable-results" || mode === "no-results") {
  console.log("");
  console.log("=== Vertical slice under no-usable-results (must not throw) ===");
  const slice = await runVerticalSlice();
  console.log(`collectionOutcome=${slice.collectionOutcome}`);
  console.log(`stages=${slice.stages.length}`);
  console.log(`searchResults=${slice.searchResults.length}`);
  console.log("slice completed without throw");
}
