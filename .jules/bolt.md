# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for critical learnings before starting.

## 2024-05-22 - API Caching and Preconnect
**Learning:** Large modules from CDNs (like `aistudiocdn.com`) can benefit significantly from `preconnect`. Also, expensive AI API calls (Gemini) should be cached locally to save cost and latency.
**Action:** Implemented localStorage caching with SHA-256 keys for Gemini API calls and added preconnect for the AI CDN.
