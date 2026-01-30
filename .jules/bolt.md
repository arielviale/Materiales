# Bolt's Journal

## 2024-05-22 - Initial Setup
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for critical learnings before starting.

## 2024-05-22 - Client-Side API Caching
**Learning:** For client-side apps using Google GenAI SDK, caching responses in `localStorage` significantly improves performance (0ms latency on revisit). When verifying with Playwright, the network interceptor must mock the full API JSON structure `{ candidates: [{ content: { parts: [{ text: "..." }] } }] }` even if the client code only accesses `.text`, as the SDK likely parses the full response.
**Action:** Always implement `try/catch` around `localStorage` operations and use robust network mocking in verification scripts.
