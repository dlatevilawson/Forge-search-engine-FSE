import { HARDCODED_QUERY, runVerticalSlice } from "./run-vertical-slice.ts";

const result = runVerticalSlice();

console.log("=== Vertical Slice (stub) ===");
console.log(`Query: ${HARDCODED_QUERY}`);
console.log("");
console.log("Stages executed:");
for (const stage of result.stages) {
  console.log(`  ✓ ${stage}`);
}
console.log("");
console.log("Stub report:");
console.log(JSON.stringify(result.report, null, 2));
console.log("");
console.log(`Knowledge Storage stub id: ${result.storedId}`);
