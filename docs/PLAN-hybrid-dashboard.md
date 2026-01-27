# PLAN: Multi-LLM Add-On (Hybrid Dashboard)

**Goal:** Add "Daily Diary" features *alongside* the existing Sliders, powered by Groq + Gemini. No replacements, only enhancements.

## 1. Hybrid Architecture

### The "Add-On" Logic
*   **Existing:** Manual Sliders (User drags manually).
*   **New:** "Magic Input" Box (User types -> Groq extracts -> Sliders move automatically).
*   **Result:** Users can choose: Type, Drag, or Both.

### Data Flow
1.  **Input:** User types in new "Magic Input".
2.  **Extraction (Groq):** Returns JSON metrics.
3.  **UI Action:** *Updates the state* of the existing sliders.
    *   (e.g., Text "I slept 5h" -> Updates Sleep Slider to 5).
4.  **Submission:** Submits exactly as before (filling the same Daily Entry schema).

---

## 2. Task Breakdown

### Phase 1: Groq Integration (The "Worker") ⚡
- [ ] **Install SDK:** `npm install groq-sdk`
- [ ] **Configure:** Expect `GROQ_API_KEY` in `.env.local`.
- [ ] **API Route:** `api/diary/analyze` (Groq Llama 3) -> Returns JSON.

### Phase 2: Hybrid Dashboard UI 🎛️
- [ ] **Add Component:** `MagicInputCard` (Textarea + "Analyze" Button).
- [ ] **Place It:** Above the existing Sliders Grid.
- [ ] **Connect Logic:**
    *   On "Analyze" success -> `setSleep(extracted.sleep)`, `setStress(extracted.stress)`, etc.
    *   Show "✨ Values updated from text" toast.

### Phase 3: Enhanced Storage & Insight 🧠
- [ ] **Update Store:** Capture the `raw_text` alongside the metrics.
- [ ] **Gemini Chat:** Ensure Chat knows about the text context if available.

---

## 3. Implementation Steps
1.  Setup Groq SDK.
2.  Create `MagicInputCard`.
3.  Inject it into `dashboard/page.tsx`.
4.  Wire up the simple `Text -> JSON -> State` logic.

---

## 4. Verification
- [ ] **Slider Test:** Dragging sliders still works 100%.
- [ ] **Magic Test:** Typing "High stress" moves Stress slider to 8/10.
- [ ] **No Regression:** Nothing removed.
