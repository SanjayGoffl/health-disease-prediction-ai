# HealthPredict - AI-Powered Health Twin

A premium Next.js application that predicts health risks using daily lifestyle data combined with an AI health consultant powered by Google Gemini.

## 🎨 Design Philosophy

**Sharp Medical-Tech Aesthetic**
- **Geometry**: 1-4px radii for clinical precision (avoiding generic rounded corners)
- **Palette**: Emerald/Teal primary (medical trust) with high-contrast slate
- **No Purple**: Deliberately avoiding AI design clichés
- **Hybrid Architecture**: Visual analytics + Interactive AI chat

## Features

### 📊 Visual Dashboard
- **Real-time Risk Gauge**: Circular health score visualization (0-100)
- **5 Interactive Metrics**:
  - Screen Time (hours)
  - Physical Activity (steps)
  - Stress Level (1-10 scale)
  - Sleep Duration (hours)
  - Water Intake (liters)
- **Health Radar Chart**: Multi-dimensional health overview

### 🤖 AI Health Consultant
- **Context-Aware Chat**: Gemini Flash analyzes your specific metrics
- **Proactive Insights**: Real-time advice based on dashboard data
- **Personalized Recommendations**: Actionable, empathetic guidance

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + Shadcn/UI
- **Charts**: Recharts
- **AI**: Google Gemini API (Flash Model - Free Tier)
- **State**: React Context API
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your key

### 3. Configure Environment
Edit `.env.local`:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

1. **Adjust Metrics**: Use sliders on the left to input your daily health data
2. **View Risk Score**: Watch the circular gauge update in real-time
3. **Ask the AI**: Type questions like:
   - "How's my health looking?"
   - "What should I improve?"
   - "Is my screen time too high?"
4. **Get Insights**: AI references your specific numbers and gives actionable advice

## Color System

### Light Mode
- Primary: `oklch(0.52 0.15 165)` - Emerald
- Secondary: `oklch(0.25 0.015 220)` - Slate
- Accent: `oklch(0.65 0.14 195)` - Cyan

### Health Status
- Excellent: Green `oklch(0.65 0.19 145)`
- Good: Yellow-Green `oklch(0.75 0.16 110)`
- Warning: Orange `oklch(0.72 0.18 75)`
- Danger: Red `oklch(0.58 0.22 25)`

## Architecture

```
app/
├── api/chat/route.ts       # Gemini integration
├── layout.tsx               # Root layout
├── page.tsx                 # Main hybrid layout
└── globals.css              # Design system

components/
├── dashboard-panel.tsx      # Metrics + Charts
└── chat-panel.tsx           # AI chat interface

lib/
└── health-context.tsx       # Shared state
```

## API Usage

The app uses **Gemini Flash** (free tier):
- **Rate Limit**: 15 requests/minute
- **Cost**: Free
- **Context Window**: Injects current health metrics into every prompt

## Accessibility

- ✅ Keyboard navigation
- ✅ Focus rings on interactive elements
- ✅ Semantic HTML
- ✅ `prefers-reduced-motion` support
- ✅ ARIA labels on form inputs

## Building for Production

```bash
npm run build
npm run start
```

## License

MIT

---

**Design Principle**: "Clinical precision meets conversational warmth."
