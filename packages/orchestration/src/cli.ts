import { HARDCODED_QUERY, runVerticalSlice } from "./run-vertical-slice.ts";

const result = await runVerticalSlice();

console.log("=== Vertical Slice (web retrieval) ===");
console.log(`Query: ${HARDCODED_QUERY}`);
console.log(`Collection outcome: ${result.collectionOutcome}`);
console.log(
  `Verification outcome: ${result.verificationOutcome}${result.verificationDetail ? ` — ${result.verificationDetail}` : ""}`,
);
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
console.log(`Real EvidenceAttributes (${result.evidenceAttributes.length}):`);
for (const attr of result.evidenceAttributes) {
  console.log(`  • ${attr.sourceUrl}`);
  console.log(
    `    credibility=${attr.sourceCredibility} claimSupport=${attr.claimSupport} consistency=${attr.factualConsistency}`,
  );
  console.log(`    credibilityRationale: ${attr.credibilityRationale}`);
  console.log(`    consistencyRationale: ${attr.consistencyRationale}`);
}
console.log("");
console.log("Report:");
console.log(JSON.stringify(result.report, null, 2));
console.log("");
console.log(`Knowledge Storage stub id: ${result.storedId}`);
