import { HARDCODED_QUERY, runVerticalSlice } from "./run-vertical-slice.ts";

const result = await runVerticalSlice();

console.log("=== Vertical Slice (web retrieval) ===");
console.log(`Query: ${HARDCODED_QUERY}`);
console.log(`Collection outcome: ${result.collectionOutcome}`);
console.log("");
console.log("Stages executed:");
for (const stage of result.stages) {
  console.log(`  ✓ ${stage}`);
}
console.log("");
console.log("Retrieval log:");
for (const entry of result.retrievalLog) {
  console.log(
    `  - ${entry.taskId} attempt ${entry.attempt}/${entry.maxAttempts}: ${entry.outcome}${entry.detail ? ` — ${entry.detail}` : ""}`,
  );
}
console.log("");
console.log(`Real SearchResults (${result.searchResults.length}):`);
for (const hit of result.searchResults) {
  console.log(`  • ${hit.title}`);
  console.log(`    ${hit.url}`);
  console.log(
    `    publishedDate: ${hit.publishedDate === null ? "null" : hit.publishedDate}`,
  );
}
console.log("");
console.log("Report (verification+ downstream still stubbed):");
console.log(JSON.stringify(result.report, null, 2));
console.log("");
console.log(`Knowledge Storage stub id: ${result.storedId}`);
