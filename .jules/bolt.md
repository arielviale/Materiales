# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for critical learnings before starting.

## 2024-05-22 - CDN Latency & Caching
**Learning:** Runtime CDN compilation (Tailwind Play) and unpinned CDN versions cause significant initial load latency due to redirects and compilation. API calls to Gemini are expensive and static for the same prompt, making them ideal for client-side caching.
**Action:** Pin CDN versions and use `localStorage` to cache deterministic API responses to eliminate redundant network requests.
