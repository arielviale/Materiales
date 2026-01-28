# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for critical learnings before starting.

## 2024-05-22 - API Response Caching
**Learning:** Caching expensive API calls (like GenAI) in `localStorage` provides instant feedback on subsequent requests and saves quota.
**Action:** Always consider `localStorage` or `sessionStorage` for idempotent API calls where freshness isn't critical (or can be versioned).
