# 🎯 Nexus 2.0 - Complete Deployment Checklist

## Overview
This document guides you through deploying Nexus 2.0:
- **Backend** → Render (Free tier)
- **Frontend** → Vercel (Free tier)
- **Database** → Render PostgreSQL (Free tier)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ Code Repository
- [x] Code pushed to GitHub
- [x] All files committed
- [x] Repository: https://github.com/joshuva07/Nexus-2.0

### ✅ Configuration Files Ready
- [x] `render.yaml` - Render configuration
- [x] `frontend/vercel.json` - Vercel configuration
- [x] `backend/main.py` - Updated CORS settings
- [x] Deployment guides included

### ✅ API Keys Prepared
Before deployment, get:

| API | Source | Priority |
|-----|--------|----------|
| **GEMINI_API_KEY** | https://ai.google.dev | ⭐⭐⭐ Required |
| **OPENAI_API_KEY** | https://platform.openai.com/api-keys | Optional |
| **SECRET_KEY** | Generate locally | ⭐⭐⭐ Required |

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🚀 DEPLOYMENT WORKFLOW

### PHASE 1: Backend Deployment (Render) - 15-20 minutes

#### Step 1: Create PostgreSQL Database
**Time: 5 minutes**

```
Render Dashboard → New + → PostgreSQL
├── Name: nexus-db
├── Version: 15
├── Region: Your closest region
└── Click: Create Database
```

✅ Copy the **External Database URL**

#### Step 2: Deploy Web Service
**Time: 5 minutes**

```
Render Dashboard → New + → Web Service
├── GitHub: Select Nexus-2.0 repo
├── Name: nexus-ai-backend
├── Runtime: Python 3
├── Build: pip install -r backend/requirements.txt
├── Start: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
└── Click: Create Web Service
```

#### Step 3: Add Environment Variables
**Time: 2 minutes**

In Render Service Settings → Environment:

```
DATABASE_URL = <from PostgreSQL database>
SECRET_KEY = <generated key>
GEMINI_API_KEY = <your API key>
OPENAI_API_KEY = <optional>
AI_PROVIDER = gemini
```

#### Step 4: Initialize Database
**Time: 3 minutes**

Option A - Using Render Shell:
```bash
Shell → psql $DATABASE_URL < database/schema.sql
```

Option B - Using local psql:
```bash
psql "your-database-url" < database/schema.sql
```

#### Step 5: Verify Backend
```
✅ Visit: https://nexus-ai-backend.onrender.com/health
✅ Expected: {"status": "healthy"}
✅ API Docs: https://nexus-ai-backend.onrender.com/docs
```

**STATUS:** ✨ Backend Live! ✨

---

### PHASE 2: Frontend Deployment (Vercel) - 10-15 minutes

#### Step 1: Import Project
**Time: 3 minutes**

```
Vercel Dashboard → Add New... → Project
├── Select: Nexus-2.0 repository
├── Framework: Vite
├── Root: ./frontend
├── Build Command: npm run build
├── Output: dist
└── Click: Continue
```

#### Step 2: Add Environment Variable
**Time: 1 minute**

Before deploying:
```
VITE_API_URL = https://nexus-ai-backend.onrender.com
```

#### Step 3: Deploy
**Time: 2-5 minutes**

```
Click: Deploy
⏳ Building...
✅ Deployment Complete!
```

Get your URL: `https://nexus-2-0.vercel.app` (your actual domain)

#### Step 4: Verify Frontend
```
✅ Visit: https://nexus-2-0.vercel.app
✅ Check: Landing page loads
✅ Open DevTools (F12) → No CORS errors
✅ Network tab: API calls reach backend
```

**STATUS:** ✨ Frontend Live! ✨

---

### PHASE 3: Full Integration Test - 5 minutes

#### Test 1: API Health Check
```
GET https://nexus-ai-backend.onrender.com/health
Response: {"status": "healthy"}
```

#### Test 2: Frontend Loads
```
Browser: https://nexus-2-0.vercel.app
Visual: Landing page displays
Console: No JavaScript errors
```

#### Test 3: API Connection
```
1. Open DevTools (F12)
2. Network tab
3. Click "Get Started" or any action
4. Watch for API requests
5. Verify requests go to backend (not localhost)
```

#### Test 4: User Flow
```
1. Go to Login page
2. Try creating an account
3. Frontend sends to backend
4. Backend saves to Render PostgreSQL
5. User account appears in database
```

---

## 📊 DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────┐
│         User's Browser                          │
│  (https://nexus-2-0.vercel.app)                 │
└────────────┬────────────────────────────────────┘
             │ HTTP Requests
             ↓
┌─────────────────────────────────────────────────┐
│  Vercel (Frontend)                              │
│  - React + Vite                                 │
│  - Static assets + JavaScript                   │
│  - Auto-deploys on GitHub push                  │
└────────────┬────────────────────────────────────┘
             │ API Calls (/api/*, /user/*, etc)
             ↓
┌─────────────────────────────────────────────────┐
│  Render (Backend)                               │
│  - FastAPI application                          │
│  - https://nexus-ai-backend.onrender.com        │
│  - Auto-deploys on GitHub push                  │
└────────────┬────────────────────────────────────┘
             │ SQL Queries
             ↓
┌─────────────────────────────────────────────────┐
│  Render PostgreSQL Database                     │
│  - nexus_db database                            │
│  - Users, careers, chat history, etc            │
│  - Free tier: 256MB storage                      │
└─────────────────────────────────────────────────┘
```

---

## 🔗 IMPORTANT CONNECTIONS

### Frontend knows Backend at:
```javascript
// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL 
              || 'http://localhost:8000'
// Production: https://nexus-ai-backend.onrender.com
```

### Backend allows Frontend via CORS:
```python
# backend/main.py
allow_origins=[
    "https://nexus-2-0.vercel.app",  # Your Vercel URL
    "https://nexus-ai-backend.onrender.com",
]
```

### Database Connection:
```
postgresql://user:pwd@host:5432/nexus_db
Managed by Render - no setup needed beyond schema
```

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue 1: Backend won't start on Render
```
Symptom: Error 500 when visiting https://nexus-ai-backend.onrender.com
Solution:
1. Check Render Logs tab
2. Verify DATABASE_URL is correct
3. Ensure database schema initialized
4. Check SECRET_KEY and API keys are set
```

### Issue 2: Frontend can't reach backend
```
Symptom: CORS error in browser console
Solution:
1. Verify VITE_API_URL in Vercel env variables
2. Add your Vercel domain to backend CORS
3. Redeploy backend (push to GitHub)
4. Check Network tab for actual error
```

### Issue 3: Database connection failed
```
Symptom: "Connection refused" error in backend logs
Solution:
1. Verify DATABASE_URL format
2. Test: psql "your-url" to verify connection
3. Ensure schema.sql was run
4. Check Render PostgreSQL is running
```

### Issue 4: Blank page on frontend
```
Symptom: Page loads but shows nothing
Solution:
1. Open DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests
4. Verify build completed successfully
5. Hard refresh browser (Ctrl+Shift+R)
```

---

## 📊 MONITORING & MAINTENANCE

### Check Backend Health
```bash
# Daily
curl https://nexus-ai-backend.onrender.com/health

# Monitor
- Render Dashboard → Logs
- Check for 500 errors
- Monitor CPU and memory usage
```

### Monitor Frontend
```bash
# Vercel Analytics
- Check page load times
- Monitor Web Vitals
- Review error logs
```

### Database Maintenance
```bash
# Render PostgreSQL Dashboard
- Check storage usage (256MB limit)
- Monitor connections
- Review slow queries
```

---

## 🔄 AUTO-DEPLOY & UPDATES

### How Updates Work

1. **You make changes** locally
   ```bash
   git add .
   git commit -m "Fix: ..."
   git push
   ```

2. **GitHub receives push** ✅

3. **Render detects change** → Auto-build backend
   - Installs dependencies
   - Runs tests (if configured)
   - Deploys to production
   - ~2-5 minutes

4. **Vercel detects change** → Auto-build frontend
   - Rebuilds React app
   - Optimizes assets
   - Deploys to CDN
   - ~1-3 minutes

5. **Live!** 🚀

---

## 📱 USEFUL LINKS

### Your Production URLs
```
Frontend:  https://nexus-2-0.vercel.app
Backend:   https://nexus-ai-backend.onrender.com
API Docs:  https://nexus-ai-backend.onrender.com/docs
```

### Dashboard Links
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repo: https://github.com/joshuva07/Nexus-2.0

### Documentation
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- FastAPI: https://fastapi.tiangolo.com
- Vite: https://vitejs.dev

### API Keys
- Google Gemini: https://ai.google.dev
- OpenAI: https://platform.openai.com/api-keys

---

## ✅ FINAL CHECKLIST

Before considering deployment complete:

- [ ] Render database created and URL copied
- [ ] Backend deployed on Render
- [ ] Environment variables set in Render
- [ ] Database schema initialized
- [ ] Backend health check passes
- [ ] Frontend deployed on Vercel
- [ ] VITE_API_URL set in Vercel
- [ ] Frontend loads without errors
- [ ] API calls reach backend
- [ ] User can create account and login
- [ ] Data persists in database
- [ ] All pages accessible
- [ ] No console errors
- [ ] No network errors
- [ ] Auto-deploy working for both services

---

## 🎉 SUCCESS!

Your Nexus 2.0 application is now:
- **Publicly accessible** at https://nexus-2-0.vercel.app
- **Backed by production database** on Render PostgreSQL
- **Running on reliable infrastructure** (Render + Vercel)
- **Automatically updating** on every GitHub push
- **Free to use** (within free tier limits)

### Next Steps
1. Share your app with others
2. Test all features thoroughly
3. Monitor performance
4. Gather user feedback
5. Plan scalability for growth

---

## 📞 SUPPORT

Having issues? Check:

1. **Render Logs** (for backend errors)
   - Dashboard → Service → Logs tab

2. **Vercel Logs** (for frontend errors)
   - Dashboard → Project → Deployments tab

3. **Browser DevTools** (F12)
   - Console tab for JavaScript errors
   - Network tab for API calls

4. **GitHub Issues** (if needed)
   - Document the problem
   - Include error messages and screenshots

---

**Deployment Date:** April 8, 2026
**Status:** ✨ **READY FOR PRODUCTION** ✨
