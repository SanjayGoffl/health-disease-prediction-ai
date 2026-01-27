# PLAN: AI-Powered Daily Diary Pivot

**Goal:** Pivot from "Slider Dashboard" to "Natural Language Diary" where AI extracts metrics from text.

## 1. System Architecture Update

### Data Flow
1. **Input:** User types "Journal Entry" (Free text).
2. **Analysis:** `/api/diary/analyze` receives text -> Calls Gemini Flash with Schema.
3. **Storage:** Structured JSON (metrics + summary) saves to DB (Mock/Local for now).
4. **Feedback:** UI updates with extracted tags + Summary Card.

### The "Daily Entry" Schema
```typescript
interface DailyEntry {
  date: string;          // YYYY-MM-DD
  raw_text: string;      // User's journal
  ai_summary: string;    // "Low energy day..."
  metrics: {
    sleep: number;       // 0-12
    stress: number;      // 1-10
    hydration: number;   // 0-5 (Liters estimated)
    mood: string;        // "tired", "happy", "anxious"
  };
  risk_level: 'low' | 'moderate' | 'high';
  tags: string[];        // ["dehydration", "exam_stress"]
}
```

---

## 2. Task Breakdown

### Phase 1: API - The Intelligence Layer 🧠
- [ ] **Create Extraction Route:** `app/api/diary/analyze/route.ts`
  - Use Vercel AI SDK `generateObject` or `streamObject` (if available) or strict JSON prompt.
  - Define System Prompt for robust extraction.
- [ ] **Define Types:** Create `types/diary.ts`.

### Phase 2: UI - The "Diary" Dashboard 📓
- [ ] **Revamp `dashboard/page.tsx`:**
  - Remove Sliders Grid.
  - **Add:** "How was your day?" Text Area (Big, welcoming).
  - **Add:** "Submit" Button with loading state.
  - **Add:** `DailySummaryCard` (appears after submission).
  - **Add:** `ExtractedMetricsGrid` (Read-only visualisation of what AI found).
- [ ] **Interactive Verification:**
  - Allow user to click "Edit" on extracted metrics if AI was wrong.

### Phase 3: Storage (State Management) via Context 💾
- [ ] **DiaryContext:** Since we don't have a DB yet, use a React Context + LocalStorage to persist the "last 7 days" of entries so the **Chat** and **History** pages actually work with this new data.
- [ ] **Update Chart/History:** Link `history/page.tsx` to read from `DiaryContext` instead of random mock data.

---

## 3. Implementation Steps
1. Create API Route for Analysis.
2. Build Context/Store for Diary Entries.
3. Rebuild Dashboard UI.
4. Update Chat to read from Diary Context.

---

## 4. Verification
- [ ] Type "I slept 4 hours and feel like trash" -> System should show **Sleep: 4**, **Mood: Trash/Low**, **Risk: High**.
- [ ] Verify History page reflects these new entries.
