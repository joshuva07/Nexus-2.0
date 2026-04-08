# Nexus 2.0 - Deployment Guide

Complete guide to deploy the backend on Render and frontend on Vercel.

---

## 📋 Prerequisites

- Push all code to GitHub ✅ (Already done)
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- PostgreSQL database (Render provides free tier)

---

## 🚀 PHASE 1: Deploy Backend to Render

### Step 1: Add `render.yaml` to Root Project

Create a `render.yaml` file in the project root:

```yaml
services:
  - type: web
    name: nexus-ai-backend
    runtime: python
    buildCommand: "pip install -r backend/requirements.txt"
    startCommand: "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: DATABASE_URL
        scope: run
        value: ${DATABASE_URL}
      - key: SECRET_KEY
        scope: run
        value: ${SECRET_KEY}
      - key: GEMINI_API_KEY
        scope: run
        value: ${GEMINI_API_KEY}
      - key: OPENAI_API_KEY
        scope: run
        value: ${OPENAI_API_KEY}
      - key: AI_PROVIDER
        value: gemini
```

### Step 2: Create PostgreSQL Database on Render

1. Go to **Render Dashboard** → **New +** → **PostgreSQL**
2. Configure:
   - **Name:** `nexus-db`
   - **Database:** `nexus_db`
   - **User:** `nexus_user`
   - **Region:** Pick Your Closest
   - **PostgreSQL Version:** 15
3. Click **Create Database**
4. Copy the **External Database URL** (you'll need this)

### Step 3: Deploy Backend Service

1. Go to **Render Dashboard** → **New +** → **Web Service**
2. Connect your GitHub repo (`Nexus-2.0`)
3. Configure:
   - **Name:** `nexus-ai-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** Free (or Starter for production)

### Step 4: Add Environment Variables in Render

Go to your backend service **Settings** → **Environment** → Add variables:

```
DATABASE_URL=postgresql://nexus_user:<password>@<host>:<port>/nexus_db
SECRET_KEY=your-super-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key (if using)
AI_PROVIDER=gemini
```

### Step 5: Initialize Database Schema

1. After deployment, you need to run migrations
2. Go to Render service → **Shell** tab
3. Run:
   ```bash
   psql $DATABASE_URL < database/schema.sql
   ```

### Step 6: Update Backend Config for Production

Update `backend/config.py` to handle the DATABASE_URL from environment:

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database - use environment variable first
    DATABASE_URL: str = "postgresql://nexus_user:nexus_pass@localhost:5432/nexus_db"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # AI
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    AI_PROVIDER: str = "gemini"

    # Rate limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
```

✅ **Backend is now live at:** `https://nexus-ai-backend.onrender.com`

---

## 🌐 PHASE 2: Deploy Frontend to Vercel

### Step 1: Create `vercel.json` in Frontend Root

Create `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@nexus-api-url"
  }
}
```

### Step 2: Update Frontend API Configuration

Update `frontend/src/services/api.js` to use environment variable:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 3: Update Backend CORS

Update `backend/main.py` to accept your Vercel domain:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="NEXUS AI Backend",
    description="Human Intelligence Operating System — FastAPI Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://nexus-ai-frontend.vercel.app",  # Add your Vercel URL
        "https://nexus-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Deploy Frontend on Vercel

1. Go to **Vercel Dashboard** (vercel.com)
2. Click **New Project**
3. **Import Git Repository** → Select `Nexus-2.0`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 5: Add Vercel Environment Variables

In Vercel project settings → **Environment Variables** → Add:

```
VITE_API_URL=https://nexus-ai-backend.onrender.com
```

### Step 6: Deploy

Click **Deploy** and wait for deployment to complete.

✅ **Frontend is now live at:** `https://nexus-ai-frontend.vercel.app`

---

## 🔗 PHASE 3: Connect Frontend & Backend

### Update Backend Render Service with Vercel URL

1. Go to Render Backend Service Settings
2. Update `DATABASE_URL` and other variables:
   - Add `FRONTEND_URL=https://nexus-ai-frontend.vercel.app` (if needed)
   - Update CORS if necessary

### Test Connection

1. Visit `https://nexus-ai-frontend.vercel.app`
2. Open DevTools → **Network** tab
3. Try API call (login/register)
4. Check if requests go to `https://nexus-ai-backend.onrender.com`

---

## 📚 Additional Configuration

### Enable Auto-Deploy on GitHub Push

Both Render and Vercel automatically deploy when you push to GitHub.

### Custom Domain (Optional)

**For Render Backend:**
1. Render Dashboard → Service → Settings → Custom Domain
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS records

**For Vercel Frontend:**
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `app.yourdomain.com`)
3. Update DNS records

---

## ⚠️ IMPORTANT: Database Migration on Render

Before your app works, you must initialize the database:

```bash
# Using Render Shell or local psql:
psql "your-database-url" < database/schema.sql
```

---

## 🔑 Environment Variables Checklist

### Render Backend
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `SECRET_KEY` - JWT secret (change this!)
- ✅ `GEMINI_API_KEY` - Your Gemini API key
- ✅ `OPENAI_API_KEY` - Your OpenAI key (optional)
- ✅ `AI_PROVIDER` - Set to `gemini`

### Vercel Frontend
- ✅ `VITE_API_URL` - Points to `https://nexus-ai-backend.onrender.com`

---

## 🚨 Troubleshooting

### Backend won't start on Render
- Check logs: Render Dashboard → Service → Logs
- Verify `DATABASE_URL` is correct
- Ensure database schema is initialized

### Frontend can't reach backend
- Check `VITE_API_URL` in Vercel env variables
- Verify CORS origins in `backend/main.py`
- Check Network tab in DevTools for failed requests

### Database connection errors
- Verify Render PostgreSQL is running
- Check external database URL format
- Ensure whitelist IP (Render handles this)

---

## 📞 Support Links

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/
- Vite Deployment: https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server

---

**Deployment Status:** Ready to deploy! 🚀
