# Nexus 2.0 - Quick Start Commands

## 🌐 Frontend Deployment URLs

### Vercel
- **Production:** https://nexus-ai-frontend.vercel.app (or your custom domain)
- **Auto-Deploy:** Triggered on every push to main/master branch

### Local Development
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔧 Backend Deployment URLs

### Render
- **Production:** https://nexus-ai-backend.onrender.com
- **API Docs:** https://nexus-ai-backend.onrender.com/docs
- **Auto-Deploy:** Triggered on every push to GitHub

### Local Development
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
```

---

## 🗄️ Database Setup

### Render PostgreSQL
1. Created via Render Dashboard
2. External URL format: `postgresql://user:password@host:port/dbname`
3. Initialize schema with: `psql $DATABASE_URL < database/schema.sql`

### Local PostgreSQL
```bash
createdb nexus_db
psql -U postgres -d nexus_db -f database/schema.sql
```

---

## 🔄 Connecting Frontend & Backend

Frontend makes API calls to:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// In production: https://nexus-ai-backend.onrender.com
```

---

## ✅ Deployment Checklist

### Before Deploying to Render:
- [ ] Database initialized with schema
- [ ] All environment variables set
- [ ] Backend tests pass locally
- [ ] Code pushed to GitHub

### Before Deploying to Vercel:
- [ ] VITE_API_URL set correctly
- [ ] Frontend builds without errors (`npm run build`)
- [ ] API calls configured properly
- [ ] Code pushed to GitHub

### After Deployment:
- [ ] Backend health check: `GET /health`
- [ ] Frontend loads: Check browser console
- [ ] API connection: Try login/register
- [ ] Database working: Verify data persist

---

## 🚨 Common Issues & Solutions

### Backend showing 500 errors
```bash
# Check Render logs
# Verify DATABASE_URL, SECRET_KEY, and API keys are set
# Ensure database schema is initialized
```

### Frontend can't reach backend
```javascript
// Check browser Network tab
// Verify VITE_API_URL in Vercel env variables
// Ensure CORS is configured in backend/main.py
```

### Database connection failed
```bash
# Verify connection string format
# Check Render PostgreSQL is running
# Test locally: psql "your-connection-string"
```

---

## 📞 Learn More

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- FastAPI: https://fastapi.tiangolo.com
- Vite: https://vitejs.dev
