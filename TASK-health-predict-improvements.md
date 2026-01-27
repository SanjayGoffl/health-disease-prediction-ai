# TASK: Health Predict Improvements

## 1. Goal
Complete the missing pages and enhance the UI/UX of the Health Predict application to match the "Premium" design aesthetic.

## 2. Scope

### Phase 1: Missing Pages (High Priority)
- [x] **History Page (`/app/history/page.tsx`)**
    - Calendar view using `react-day-picker` or custom grid.
    - Monthly trend chart (Line chart via Recharts).
    - "Day Summary" bottom sheet/modal on click.
- [x] **Chat Page (`/app/chat/page.tsx`)**
    - Full-screen chat interface.
    - AI Avatar + user styling.
    - Suggested follow-up questions.
    - Integration with existing health context.
- [x] **Profile Page (`/app/profile/page.tsx`)**
    - "Digital Health Passport" layout.
    - User stats/badging.
    - Settings form (mock).

### Phase 2: UI/UX Polish
- [x] **Animations**: Add "breathing" animation to Health Gauge.
- [x] **Mobile**: Ensure bottom nav or hamburger menu works perfectly (already present, verify).
- [x] **Micro-interactions**: Hover effects on cards.

## 3. Implementation Details

### Tech Stack
- **Charts**: Recharts (keep consistent).
- **Icons**: Lucide React.
- **Styling**: Tailwind CSS + Shadcn UI components.
- **Animation**: Framer Motion.

## 4. Verification
- Manual verification of each page's code structure.
- Ensure no type errors.
- Verify improved aesthetics.
