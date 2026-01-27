# PLAN: Multi-LLM System (Gemini + Groq)

**Goal:** Implement a dual-LLM architecture where **Groq** (Fast/Cheap) handles daily extraction and **Gemini** (Smart/Deep) handles reasoning and chat.

## 1. System Architecture

### The "Extract-Think" Pipeline
1.  **Ingestion (Client):** User submits journal text.
2.  **Extraction (Groq):** `/api/diary/analyze` calls `groq-sdk` (Llama 3.1 8B).
    *   **Task:** Detect numbers (sleep=5) and tags (mood=tired).
    *   **Output:** Strict JSON.
3.  **Storage:** Save extracted JSON to `DiaryContext`.
4.  **Reasoning (Gemini):** `/api/chat/route.ts` calls `GoogleGenerativeAI`.
    *   **Task:** Read last 7 days of Groq-extracted JSON.
    *   **Output:** Deep insights ("Your stress correlates with low sleep").

### API Key Requirements
*   `GOOGLE_GENERATIVE_AI_API_KEY` (Already present)
*   `GROQ_API_KEY` (User provided: `gsk_...`)

---

## 2. Task Breakdown

### Phase 1: Groq Integration (The "Worker") ⚡
- [ ] **Install SDK:** `npm install groq-sdk`
- [ ] **Configure:** Update `.env.local` with `GROQ_API_KEY`.
- [ ] **Create Utility:** `lib/groq.ts` for standardized calls.
- [ ] **Implement Extraction:** Update `app/api/diary/analyze/route.ts` to use Groq instead of Gemini Flash.

### Phase 2: Gemini Integration (The "Thinker") 🧠
- [ ] **Update Chat Logic:** Ensure `app/api/chat/route.ts` specifically uses `google-generative-ai` (Gemini Pro/Flash 1.5).
- [ ] **Context Injection:** Feed Groq's JSON output into Gemini's system prompt.

### Phase 3: Dashboard Update 📊
- [ ] **Refactor Page:** Replace pure sliders with a hybrid approach (Text Box + Auto-filled Sliders).
- [ ] **Feedback Loop:** User types -> Groq extracts -> Sliders auto-move -> User confirms -> Gemini analyzes.

---

## 3. Implementation Steps
1.  Enable Groq in project.
2.  Build the "Text-to-JSON" pipeline using Llama 3 on Groq.
3.  Connect the "JSON-to-Insight" pipeline using Gemini.

---

## 4. Verification
- [ ] **Speed Test:** Extraction should take <1s with Groq.
- [ ] **Accuracy:** "I slept 5h" -> JSON `{ sleep: 5 }`.
- [ ] **Reasoning:** Chat asks "Why am I tired?" -> mentions the 5h sleep.
