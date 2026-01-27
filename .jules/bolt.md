# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for critical learnings before starting.

## 2026-01-27 - Client-Side API Caching
**Learning:** This app uses index.html as the main entry point with CDN dependencies. API calls to Gemini are triggered by user interaction and were unoptimized.
**Action:** Implemented localStorage caching for static prompts to eliminate redundant API calls. This pattern is effective for educational/static content apps.
