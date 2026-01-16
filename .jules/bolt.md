# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for critical learnings before starting.

## 2026-01-16 - CDN Resource Optimization
**Learning:** Unversioned CDN URLs (e.g., `cdn.jsdelivr.net/npm/chart.js` or `cdn.tailwindcss.com`) often incur a 302 Redirect penalty and have shorter cache lifetimes (e.g., 7 days vs 1 year for versioned).
**Action:** Always pin CDN resources to specific versions (e.g., `@4.5.1`) to avoid redirects and maximize browser caching. Use `preconnect` to reduce latency for these origins.
