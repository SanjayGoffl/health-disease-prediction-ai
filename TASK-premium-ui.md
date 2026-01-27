# TASK: Premium UI/UX Overhaul & AI Integration

## 1. Project Goal
Transform the current "Student Project" MVP into a **Premium, Apple-like Health SaaS**. 
Key aesthetics: calm, science-first, deep emerald green theme, no sidebars, floating navbar, heavy use of modals/sheets.

## 2. Design System Specification (User-Defined)

### Core Colors
| Role | Color | Hex | Tailwind Name (Proposed) |
|------|-------|-----|--------------------------|
| **Primary** | Deep Emerald Green | `#009A56` | `bg-emerald-600` / `--color-primary` |
| **Accent** | Mint | `#D1F5E0` | `bg-emerald-100` / `--color-accent` |
| **Background** | Off-White | `#F8F9FA` | `bg-slate-50` / `--color-background` |
| **Surface** | White | `#FFFFFF` | `bg-white` / `--color-surface` |
| **Text** | Dark Slate | `#0F172A` | `text-slate-900` / `--color-text-main` |
| **Muted** | Slate Gray | `#64748B` | `text-slate-500` / `--color-text-muted` |

### Typography
- **Font Family:** Inter (Google Fonts) or Plus Jakarta Sans.
- **Weights:** Light (300), Regular (400), Medium (500), SemiBold (600).

### Structural Patterns
- **Navigation:** Floating Top Navbar (Glassmorphism). Mobile: Hamburger.
- **Layout:** Centered max-width containers (`max-w-6xl`) with large white-space.
- **Interaction:** 
    - Hover: `transform: translateY(-2px)` + `shadow-lg`
    - Modals: For editing/input.
    - Bottom Sheets: For details on mobile/desktop.

---

## 3. Implementation Plan

### Phase 1: Foundation (Design System)
- [ ] **Config:** Update `tailwind.config.ts` (or CSS vars) with the Emerald Palette.
- [ ] **Fonts:** Configure `next/font` with Inter.
- [ ] **Global CSS:** Add standard `base` layer (reset), custom scrollbar, and animations (`fade-in`, `slide-up`).

### Phase 2: Navigation & Layout
- [ ] **Navbar Component:** Floating, blurred background (`backdrop-blur-md`).
    - Links: Logo, Dashboard, History, AI Chat, Profile (Avatar).
- [ ] **Root Layout:** Apply Navbar globally (except Auth pages if separate).

### Phase 3: Page - Landing (Home)
- [ ] **Hero:** "Your Lifestyle. Your Patterns. Your Health Twin." + CTA.
- [ ] **Showcase:** 3 Interactive Panels (Metrics, AI, Calendar) using glass cards.
- [ ] **Trust:** Icons row (Private, Encrypted).

### Phase 4: Page - Dashboard (The "Premium" View)
- [ ] **Grid Layout:** 
    - Top: Health Score Gauge (Breathing animation).
    - Middle Left: Daily Metric Cards (Slider replacements).
    - Middle Right: Quick Chat Input ("How are you feeling?").
    - Bottom: Radar Chart (Trend Overview).
- [ ] **Components:** Refactor existing `DashboardPanel` into smaller specialized components (`MetricCard`, `ScoreGauge`, `HealthRadar`).

### Phase 5: Page - History & Chat
- [ ] **Calendar Page:** Full-width calendar view with dot indicators.
    - Interaction: Click -> Open Bottom Sheet with day summary.
- [ ] **AI Chat Page:** 
    - Implementation: Vercel AI SDK (`useChat`).
    - Context: Hidden system prompt injected on init.
    - UI: Clean chat bubble interface, no sidebar history (or minimal).

### Phase 6: Profile & Settings
- [ ] **Profile Page:** Avatar, "Digital Health Passport" style.
- [ ] **Settings Modal:** Edit preferences, common symptoms.

---

## 4. Verification Checklist
- [ ] **Aesthetics:** No "default blue". Deep emerald is dominant.
- [ ] **Responsive:** No horizontal scroll on mobile. Navbar collapses correctly.
- [ ] **Performance:** Lighthouse score > 90.
- [ ] **Privacy:** No PII logged to console.

---

## 5. Technical Context
- **Framework:** Next.js 15+ (App Router).
- **Styling:** Tailwind CSS + Lucide Icons (SVG only).
- **Charts:** Recharts (Radar, Line).
- **AI:** Google Generative AI + Vercel AI SDK.

