# [PLAN] Integrated AI System for Lifestyle-Based Health Analysis

## Goal
Transform the current "Health Predict" prototype into a connected application with User Authentication and Cloud Storage. We will replace the current local-storage based system with Firebase Auth & Firestore, and implement a multi-step onboarding wizard to collect user profile data as per the "Integrated AI System" vision.

## User Review Required
> [!IMPORTANT]
> **Data Privacy**: We are moving from LocalStorage (100% private on device) to Firebase Cloud. Ensure this aligns with your privacy goals.
> **PDF/PPT References**: I cannot assume the contents of the binary files in `docs/`. I have based the data model on standard health app requirements and your prompt. Please review the **Schema** section carefully.

## UI Preservation Strategy (CRITICAL)
> [!IMPORTANT]
> **DO NOT CHANGE THE EXISTING UI DESIGN.**
> - **Landing Page**: Must remain visually identical. Only change the "Start" button URL.
> - **Dashboard**: Must remain visually identical. Only replace hardcoded data with Firestore data.
> - **New Pages**: Must strictly follow the existing `globals.css`, Tailwind config, and Framer Motion patterns.
> - **Components**: Reuse existing `ui/` components (Buttons, Cards, Inputs) without modifying their styles.

## Architecture
- **Auth**: Firebase Authentication (Google + Email/Password).
- **Database**: Firebase Firestore (NoSQL).
- **State Management**: React Context (updated to sync with Firestore).
- **UI**: Existing Tailwind + Framer Motion aesthetic.

## Proposed Changes

### 1. Configuration & Setup
#### [NEW] `lib/firebase.ts`
- Initialize Firebase App.
- Export `auth` and `db` instances.
- **Action**: You must provide Firebase Config Keys in `.env.local`.

### 2. Authentication Flow
#### [NEW] `app/(auth)/login/page.tsx` & `app/(auth)/signup/page.tsx`
- Clean, modern sign-in forms.
- "Continue with Google" button.
- Redirect to `/onboarding` for new users, `/dashboard` for returning.

#### [NEW] `components/auth-provider.tsx`
- Wrap app to handle user session state.
- Protect routes: `/dashboard`, `/profile`, `/chat`.

### 3. Onboarding Wizard (The "Step-by-Step" Process)
#### [NEW] `app/onboarding/page.tsx`
- A multi-step form with smooth `framer-motion` transitions.
- **Step 1: Identity**: Name, Date of Birth, Gender.
- **Step 2: Body Metrics**: Height (cm/ft), Current Weight (kg/lbs).
- **Step 3: Health Profile**:
    - "Do you have any existing conditions?" (Multi-select: Diabetes, Hypertension, None, etc.)
    - "Any dietary restrictions?" (Vegan, Keto, Gluten-free, etc.)
- **Step 4: Goals**:
    - Primary Goal (Lose Weight, Maintain, Build Muscle, Improve Energy).
    - Activity Level (Sedentary, Active, Athlete).

### 4. Database Schema (Firestore)
**Collection: `users`**
- Document ID: `uid`
- Fields:
    - `profile`: { dob, gender, height, weight, conditions[], dietary_restrictions[], goals }
    - `createdAt`: timestamp
    - `settings`: { theme, notifications }

**Collection: `users/{uid}/daily_logs`**
- Document ID: `YYYY-MM-DD`
- Fields:
    - `sleep`: number
    - `water`: number
    - `steps`: number
    - `stress`: number (1-10)
    - `mood`: string
    - `aiAnalysis`: string (cached daily analysis)
    - `nutrition`: { calories: number, protein: number, carbs: number, fat: number, meals: [] } (Future Proofing)
    - `activity`: { workouts: [], active_minutes: number, calories_burned: number } (Future Proofing)

### 6. AI Analysis & Recommendations (Core Functionality)
#### [NEW] `lib/ai-engine.ts`
- **Daily Health Score (0-100)**: logic to calculate score based on Sleep, Water, Steps, Stress, and Mood.
- **Lifestyle Analysis**: Generate text insights (e.g., "High stress is affecting your sleep score today.").
- **Preventive Guidance**: Rule-based or AI-generated tips based on profile (e.g., "Since you have hypertension, try to lower salt intake today.").

#### [MODIFY] `app/chat/page.tsx` (AI Assistance)
- Connect the AI Chat to the `HealthContext`.
- System Prompt: "You are a health assistant. The user is [Age] [Gender] with conditions [Conditions]. Their simplified health score today is [Score]."

### 7. Integration
#### [MODIFY] `lib/health-context.tsx`
- Remove `localStorage` dependency for authenticated users.
- Add `useEffect` to subscribe to Firestore `users/{uid}/daily_logs` listeners.
- Update `saveDailyLog` to write to Firestore.

#### [MODIFY] `app/page.tsx` (Landing)
- Update "Start Your Journey" to point to `/signup` instead of `/dashboard`.

## Verification Plan

### Automated Tests
- None currently exist. We will rely on manual verification for this UI/Integration phase.

### Manual Verification
1.  **Auth Flow**:
    -   Sign up with a new email -> Redirects to `/onboarding`.
    -   Complete Onboarding -> Redirects to `/dashboard`.
    -   Check Firestore Console: Verify `users/{uid}` document is created with correct fields.
2.  **Dashboard Sync**:
    -   Log a value (e.g., Water) in Dashboard.
    -   Refresh page -> Value should persist (fetch from Firestore).
    -   Check Firestore Console: Verify `daily_logs/{date}` document is updated.
3.  **Route Protection**:
    -   Try to access `/dashboard` while logged out -> Redirects to `/login`.
