# Quick Start Guide - HealthPredict

## App is Running! ✅
Your app is live at: **http://localhost:3000**

---

## 🚀 Get Started in 3 Steps

### Step 1: Get Your Free Gemini API Key (2 minutes)
1. Visit: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the key

### Step 2: Add the Key to Your App
Open `.env.local` and replace:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```
with your actual key:
```bash
GEMINI_API_KEY=AIzaSy...your_key_here
```

### Step 3: Refresh the App
Refresh your browser at http://localhost:3000 - AI chat is now active!

---

## 🎮 Try These Interactions

### Test 1: Adjust Health Metrics
1. Move the **Stress Level** slider to 8 or higher
2. Watch the risk score gauge change color to orange/red
3. See the radar chart update in real-time

### Test 2: Chat with AI
Ask these questions in the chat:
- "How's my health looking based on my current metrics?"
- "My stress is at 8 and sleep is 5 hours. What should I do?"
- "Is 10 hours of screen time dangerous?"

The AI will reference your **exact numbers** from the dashboard!

### Test 3: Mobile Responsive
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Switch to mobile view
4. See the layout stack vertically

---

## 📊 What You Built

### Premium Design
- **Sharp Medical-Tech**: 2px borders, not generic rounded corners
- **Emerald/Teal Palette**: Clinical trust colors (no purple!)
- **Real-time Gauge**: Health risk score 0-100

### Hybrid Architecture
- **Left Panel**: Interactive dashboard with 5 health sliders
- **Right Panel**: AI consultant chat powered by Gemini Flash

### Smart Features
- **Context Injection**: AI sees your exact metric values
- **Live Updates**: Move a slider, chart updates instantly
- **Accessible**: Keyboard navigation, focus rings, semantic HTML

---

## 🎨 Design Choices

| Element | Choice | Why? |
|---------|--------|------|
| **Border Radius** | 1-4px | Medical precision (avoiding generic 8px) |
| **Primary Color** | Emerald `oklch(0.52 0.15 165)` | Medical trust (not AI-cliché purple) |
| **Chart Library** | Recharts | Performance + Accessibility |
| **AI Model** | Gemini Flash | Free tier, fast, context-aware |
| **State** | React Context | Shared between dashboard & chat |

---

## 🔧 Troubleshooting

### AI Not Responding?
- Check `.env.local` has your real Gemini key
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### Port 3000 Busy?
```bash
# Kill the process on port 3000
npx kill-port 3000
npm run dev
```

### Chart Not Showing?
- Recharts needs a parent with defined height
- Check browser console for errors

---

## 📂 Project Structure

```
health-predict/
├── app/
│   ├── api/chat/route.ts       # Gemini AI endpoint
│   ├── page.tsx                 # Main hybrid layout
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Design system
├── components/
│   ├── dashboard-panel.tsx      # Metrics + Charts
│   ├── chat-panel.tsx           # AI chat interface
│   └── ui/                      # Shadcn components
├── lib/
│   └── health-context.tsx       # Shared state
└── .env.local                   # API keys (DON'T COMMIT!)
```

---

## 🎯 Next Steps

### Enhance the App
1. **Add History**: Store past metrics in LocalStorage or Supabase
2. **More Charts**: Add trend lines showing 7-day history
3. **Export Data**: Download health data as CSV
4. **Notifications**: "Your stress has been high for 3 days!"

### Deploy
```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
vercel --prod
```

---

**Status**: ✅ Fully Functional! Open http://localhost:3000 now!
