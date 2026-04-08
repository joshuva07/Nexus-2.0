# NEXUS – Human Intelligence Operating System

> 🧠 AI Mentor + 🎮 Career Simulation + 📊 Career Intelligence Platform

A production-ready, hackathon-winning full-stack AI career platform built with React + FastAPI + PostgreSQL.

---

## 🚀 Quick Start

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env         # Fill in your keys
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### Database (PostgreSQL)

```bash
# Create DB
createdb nexus_db

# Run schema
psql -U postgres -d nexus_db -f database/schema.sql
```

---

## 📁 Project Structure

```
Nexus 2.0/
├── frontend/                    # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       │   ├── Layout/          # Navbar
│       │   ├── Cards/           # GlassCard
│       │   ├── Charts/          # SkillRadar, GrowthChart, CareerMatchBar
│       │   ├── Chatbot/         # ChatbotWidget (floating AI mentor)
│       │   └── UI/              # LoadingSkeleton, PageTransition
│       ├── pages/
│       │   ├── Landing.jsx      # Hero + features
│       │   ├── Dashboard.jsx    # Analytics + Career Intelligence Panel
│       │   ├── Career.jsx       # Career matching wizard
│       │   ├── Simulation.jsx   # Multi-step decision engine
│       │   └── Prediction.jsx   # Future prediction + roadmap
│       ├── store/useStore.js    # Zustand global state
│       ├── services/api.js      # Axios API client
│       └── data/                # Career datasets + scenarios
│
├── backend/                     # FastAPI
│   ├── routes/                  # auth, user, career, simulation, future, knowledge, chat
│   ├── services/ai_service.py   # Gemini / OpenAI abstraction
│   ├── models/models.py         # SQLAlchemy ORM (9 tables)
│   ├── ai/prompts.py            # 4 production AI system prompts
│   ├── utils/jwt_auth.py        # JWT + bcrypt
│   ├── config.py                # Pydantic settings
│   ├── database.py              # SQLAlchemy engine
│   └── main.py                  # FastAPI app entry
│
└── database/
    └── schema.sql               # Full PostgreSQL schema
```

---

## 🧩 Core Modules

| Module | Description |
|--------|-------------|
| **AI Career Chatbot** | Context-aware mentor with rule-based + Gemini/OpenAI responses |
| **Career Recommendation** | Skill-matching engine with score %, gaps, salary, courses |
| **Simulation Engine** | Multi-step branching scenarios for 4 domains |
| **Knowledge Gap Detector** | Compare user vs required skills → priority gaps |
| **Future Prediction Engine** | Rule-based scoring → readiness %, growth, risk |
| **Career Intelligence Panel** | Dynamic expandable cards with salary/demand/courses |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login → JWT token |
| GET | `/user/profile` | Get user profile + skills |
| PUT | `/user/profile` | Update profile + skills |
| POST | `/career/predict` | Career match analysis |
| POST | `/simulation/start` | Start a simulation session |
| POST | `/simulation/submit` | Submit results → score + AI feedback |
| POST | `/future/predict` | Career trajectory prediction |
| POST | `/knowledge/gaps` | Detect missing skills |
| POST | `/chat` | Send message to AI mentor |
| GET | `/chat/history` | Retrieve chat history |

---

## 🧠 AI Integration

### Providers Supported
- **Gemini 1.5 Flash** (default, free tier available)
- **OpenAI GPT-4o-mini**

### System Prompts
- `CHATBOT_SYSTEM_PROMPT` — Mentor persona, context-aware, career-focused
- `SCENARIO_GENERATOR_PROMPT` — Creates branching workplace simulations
- `FEEDBACK_ENGINE_PROMPT` — Analyzes simulation performance → coaching
- `CAREER_RECOMMENDATION_PROMPT` — Skill → career matching with explanations

### Configuration
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key   # https://aistudio.google.com/app/apikey
```

---

## 🎨 Design System

- **Theme**: Dark/Light toggle, persistent via Zustand
- **Colors**: Blue `#3b82f6` → Purple `#8b5cf6` gradient
- **Style**: Glassmorphism cards, glow shadows, smooth animations
- **Fonts**: Inter (body) + Outfit (headings)
- **Animations**: Framer Motion page transitions, micro-interactions

---

## ☁️ Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
# Set VITE_API_URL=https://your-backend.onrender.com
```

### Backend → Render
```yaml
# render.yaml included
Build: pip install -r requirements.txt
Start: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Database → Supabase / Neon
1. Create a PostgreSQL database on [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Copy the connection string → update `DATABASE_URL` in `.env`
3. Run `database/schema.sql` via the Supabase SQL editor

---

## 🔐 Security

- **JWT Authentication** — HS256, 24h expiry, HTTPBearer
- **bcrypt Password Hashing** — via passlib
- **Input Validation** — Pydantic v2 models on all endpoints
- **CORS** — Restricted to configured frontend origins

---

## 📊 Sample Data

The app ships with rich sample data requiring no backend:
- **10 Career profiles** with salary ranges, demand scores, job roles
- **4 Simulation domains** with multi-step branching scenarios
- **60+ skills** in the skill taxonomy
- **Demo user** (Alex Morgan) with pre-populated metrics

---

## 🏆 Hackathon Notes

**What makes NEXUS stand out:**
1. **Full AI mentorship pipeline** — not just a chatbot
2. **Real branching simulations** — feels like a career flight simulator
3. **Visual analytics** — radar charts, area charts, gauge rings
4. **Knowledge gap scoring** — actionable, prioritized
5. **Predictive engine** — quantified career trajectory
6. **World-class UI** — dark glassmorphism, Framer Motion throughout
