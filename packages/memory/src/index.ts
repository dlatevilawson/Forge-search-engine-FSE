import type { ResearchReport, StoredKnowledgeRecord } from "@repo/types";

/** In-memory stub store — not real persistence (OPEN-3 untouched). */
const store: StoredKnowledgeRecord[] = [];

/**
 * Knowledge Storage stub. No workspace scope passed — single-session path
 * deliberately avoids packages/workspace to observe OPEN-3 friction (or lack of it).
 */
export function storeKnowledge(report: ResearchReport): StoredKnowledgeRecord {
  const record: StoredKnowledgeRecord = {
    id: `mem-${store.length + 1}`,
    storedAt: new Date().toISOString(),
    report,
  };
  store.push(record);
  return record;
}

export function listStoredKnowledge(): readonly StoredKnowledgeRecord[] {
  return store;
}
