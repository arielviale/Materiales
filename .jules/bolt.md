# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for critical learnings before starting.

## 2024-05-22 - Caching Strategy
**Learning:** When caching based on user prompts, rely on the content of the prompt (e.g. via hashing) rather than external IDs/keys if possible. This ensures cache invalidation is automatic if the prompt text changes in the codebase.
**Action:** Prefer content-addressable caching for static inputs.
