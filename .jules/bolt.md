# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for critical learnings before starting.

## 2026-01-15 - CDN Module Dependencies & Missing Assets
**Learning:** The application relies on CDN-hosted ES modules directly in `index.html`. Performance optimizations must account for these external dependencies via `preconnect` and version pinning. Additionally, LCP preloads for missing assets (like `images/header-bg.jpg`) can silently fail and waste bandwidth.
**Action:** Verify existence of preloaded assets and consider localizing critical modules if CDN reliability is a concern.
