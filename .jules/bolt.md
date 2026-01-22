# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for critical learnings before starting.

## 2024-05-22 - CDN-based API Caching
**Learning:** In single-file CDN-based apps using GenAI, repeated identical prompts cause unnecessary latency and API usage.
**Action:** Implement client-side `localStorage` caching with a simple hash of the prompt to drastically reduce response times for common queries.
