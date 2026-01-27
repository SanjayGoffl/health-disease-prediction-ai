# PLAN: Final Multi-LLM Optimization

**Goal:** Lock in the optimal model assignments: **Llama 3.1 8B Instant (Groq)** for Extraction, **Gemini 1.5** for Reasoning.

## 1. Updated Model Assignments

| Task | Model | Provider | Why |
|------|-------|----------|-----|
| **Daily Summarization** | `llama-3.1-8b-instant` | Groq | Cheap, Fast |
| **Metric Extraction** | `llama-3.1-8b-instant` | Groq | Structured JSON |
| **Trend Scoring** | `llama-3.1-8b-instant` | Groq | Pattern matching |
| **Deep Insights** | `gemini-1.5-flash` | Google | Long context |
| **AI Chat** | `gemini-1.5-flash` | Google | Conversation |

---

## 2. Refactoring Tasks

### Phase 1: Fix Dashboard Broken Imports 🚨
- [ ] **Urgent:** Restore `MetricCard`, `HealthGauge`, `TrendRadar` imports in `dashboard/page.tsx` (Accidentally deleted in previous step).

### Phase 2: Create Missing UI 🎨
- [ ] **Create:** `components/ui/textarea.tsx` (Required for Magic Input).

### Phase 3: Update Analysis Route ⚡
- [ ] **Modify:** `app/api/diary/analyze/route.ts`
  - Ensure `model: "llama-3.1-8b-instant"` is used.
  - Verify `response_format: { type: "json_object" }` compatibility.

### Phase 4: Gemini integration Update 🧠
- [ ] **Modify:** `app/api/chat/route.ts`
  - Ensure it stays on `gemini-1.5-flash`.

---

## 3. Implementation Order
1.  **Fix Dashboard Imports (Critical)** - The dashboard is currently broken.
2.  **Create Textarea UI**.
3.  **Verify Model Strings**.

---

## 4. Verification
- [ ] Dashboard text input works.
- [ ] Sliders move automatically.
- [ ] Chat responds intelligently.
