# 🧭 Health Twin - User Flow & Feature Guide

This document outlines the complete user journey, interactive capabilities, and value generation for every page in the Health Twin application.

---

## 1. Landing Page (Public Home)
**URL:** `/`

### 👤 User Flow
- **Entry:** User arrives here first.
- **Action:** Read the value proposition ("Your Health Twin").
- **Navigation:** Click "Start Your Journey" to enter the app.

### ✨ What You Can Do
- View the **"Live Demo v1.0"** indicator.
- Hover over the **3 Glass Cards** (Metrics, AI, History) to see premium interactive animations.
- Read the **Trust Indicators** (Private, Encrypted, No Ads).

### 🎁 What You Get
- **Concept Understanding:** A clear mental model that this is a "Digital Twin" app, not just a tracker.
- **Trust:** Assurance that data is private before entering.

---

## 2. Main Dashboard (Command Center)
**URL:** `/dashboard`

### 👤 User Flow
- **Entry:** Arrive here after clicking "Start".
- **Action:** Input daily stats via tactile cards.
- **Visual Feedback:** Watch the central **Health Gauge** animate instantly.

### ✨ What You Can Do
- **Input Data (Sliders):**
  - **Sleep:** 3h - 12h (Quality rest)
  - **Water:** 0.5L - 5L (Hydration)
  - **Steps:** 0 - 20k (Activity)
  - **Stress:** 1 - 10 (Mental Load)
  - **Screen Time:** 0 - 16h (Digital Detox)
- **Calculated Metric:** See the "Health Score" (0-100) update in real-time as you move sliders.
- **Viz:** View the **Trend Radar** chart showing your balance across 5 axes.
- **Quick Action:** Click "Ask AI Consultant" to jump to deep analysis.

### 🎁 What You Get (Input -> Output)
- **Input:** Your raw daily numbers (e.g., "5 hours sleep, 8 stress").
- **Output (Algorithm):** 
  - **A Single Health Score:** (e.g., "62/100").
  - **Visual Balance:** The Radar Chart reveals *skewed* lifestyles (e.g., "High Activity but High Stress" = unbalanced shape).
  - **Immediate Feedback:** "Small changes can boost this score."

---

## 3. History Page (Pattern Recognition)
**URL:** `/history`

### 👤 User Flow
- **Entry:** Click "History" in the top navbar.
- **Action:** Browse the monthly calendar grid.

### ✨ What You Can Do
- **View Grid:** See the last 30 days as a heat map.
- **Interpret Dots:**
  - 🟢 **Green (Glowing):** Excellent day (Score > 80).
  - 🟡 **Amber:** Good/Average day.
  - 🔴 **Red:** Warning day (High stress/Low sleep).
- **Hover:** Hover over any day to see the exact score for that date.
- **Interaction:** Click a day to drill down (future V2: opens detailed day sheet).

### 🎁 What You Get
- **Pattern Insight:** Instantly spot burnout cycles (e.g., "I always crash on Thursdays").
- **Consistency Check:** Visual proof of your habit streaks.

---

## 4. AI Chat (The "Soul")
**URL:** `/chat`

### 👤 User Flow
- **Entry:** Click "AI Chat" in nav or "Ask AI" on Dashboard.
- **Action:** Talk to your "Health Twin".

### ✨ What You Can Do
- **Type Anything:** "Why am I so tired today?", "I drank 3L water but have a headache."
- **Context Awareness:** The AI *already knows* your stats from the Dashboard (e.g., it knows you had 5.5h sleep) because of the hidden system prompt.
- **Receive Guidance:** Get calm, non-medical, habit-based advice.

### 🎁 What You Get (Input -> Output)
- **Input:** Natural language questions + (Hidden) Dashboard Stats.
- **Output (AI):** 
  - **Correlation:** "You're tired because your sleep was 5.5h AND your stress was 8/10 yesterday."
  - **Actionable Advice:** "Try a 10-minute non-sleep deep rest (NSDR) session now."
  - **Tone:** A supportive friend, not a robotic doctor.

---

## 5. Profile Page (Settings)
**URL:** `/profile`

### 👤 User Flow
- **Entry:** Click the "User Generic Avatar" or Name in the navbar.
- **Action:** Manage account details.

### ✨ What You Can Do
- **View Digital Passport:** See your Member ID and Member-since date.
- **Toggle Preferences:** 
  - Enable/Disable "Daily Reminders".
  - Enable/Disable "Health Alerts".
- **Logout:** Sign out of the session.

### 🎁 What You Get
- **Control:** Full ownership of your notification settings.
- **Identity:** A sense of belonging to a "Health Club" (via the Passport UI).

---

## 🔄 The "Health Twin" Loop (Summary)
1. **Dashboard:** You feed the Twin data (Sliders).
2. **Algorithm:** The Twin gives you a Score (Gauge).
3. **Chat:** You ask the Twin "Why?" (AI Analysis).
4. **History:** You see the Twin's memory (Calendar).
