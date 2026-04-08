# 🚀 Nexus 2.0 Deployment - Quick Reference

## 📍 Current Status

✅ **Code:** All files committed and pushed to GitHub
✅ **Configuration:** All deployment files ready
✅ **Repository:** https://github.com/joshuva07/Nexus-2.0

---

## 🎯 What You Need To Do

### STEP 1️⃣: Prepare Your API Keys (5 minutes)

Get these before starting:

#### A. Generate SECRET_KEY
```bash
# Run in PowerShell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Save the output - you'll need it!

#### B. Get GEMINI_API_KEY
1. Go to https://ai.google.dev
2. Click "Get API Key"
3. Create new project or select existing
4. Copy the API key
5. Save it

#### C. (Optional) Get OPENAI_API_KEY
Not required, but if you want to support OpenAI:
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Save it

---

### STEP 2️⃣: Deploy Backend on Render (20 minutes)

**Read:** `RENDER_DEPLOYMENT.md` for detailed steps

Quick summary:
1. Go to https://render.com
2. Sign in with GitHub
3. Create new PostgreSQL database
4. Create new Web Service
5. Set environment variables
6. Initialize database schema
7. Test at `https://nexus-ai-backend.onrender.com/health`

**Save these URLs:**
- Backend URL: `https://nexus-ai-backend.onrender.com`
- Database URL: `postgresql://...` (from Render)

---

### STEP 3️⃣: Deploy Frontend on Vercel (15 minutes)

**Read:** `VERCEL_DEPLOYMENT.md` for detailed steps

Quick summary:
1. Go to https://vercel.com
2. Sign in with GitHub
3. Create new project from Nexus-2.0 repo
4. Set VITE_API_URL to your backend URL
5. Deploy
6. Test at your Vercel URL

**Save this URL:**
- Frontend URL: `https://nexus-2-0.vercel.app` (or your custom domain)

---

### STEP 4️⃣: Test Everything (5 minutes)

1. **Backend Health:**
   ```
   Visit: https://nexus-ai-backend.onrender.com/health
   Should see: {"status": "healthy"}
   ```

2. **Frontend Loads:**
   ```
   Visit: https://nexus-2-0.vercel.app
   Should see: Landing page
   ```

3. **API Connection:**
   ```
   Open DevTools (F12)
   Click around
   Check Network tab → API calls go to backend
   ```

4. **Full Test Flow:**
   ```
   Try: Sign up → Create account
   Check: User saved in database
   Try: Login with credentials
   Check: Everything works
   ```

---

## 📚 Helpful Documents

Your repository includes:

| Document | Purpose |
|----------|---------|
| **DEPLOYMENT.md** | Overview of entire deployment |
| **RENDER_DEPLOYMENT.md** | Step-by-step Render backend guide |
| **VERCEL_DEPLOYMENT.md** | Step-by-step Vercel frontend guide |
| **DEPLOYMENT_CHECKLIST.md** | Detailed checklist with troubleshooting |
| **QUICK_START.md** | Quick command reference |
| **deploy.sh** | Optional bash script for backend |

---

## 🔑 Environment Variables You'll Need

### For Render Backend Service

```
DATABASE_URL = postgresql://...@....:5432/...
SECRET_KEY = (generated key from python)
GEMINI_API_KEY = (from ai.google.dev)
OPENAI_API_KEY = (optional, from openai.com)
AI_PROVIDER = gemini
```

### For Vercel Frontend

```
VITE_API_URL = https://nexus-ai-backend.onrender.com
```

---

## 🛠️ If Something Goes Wrong

### Backend Issues
1. Check Render Logs (Dashboard → Service → Logs)
2. Verify DATABASE_URL is correct
3. Ensure `psql $DATABASE_URL < database/schema.sql` was run
4. Check SECRET_KEY and API keys are set
5. See DEPLOYMENT_CHECKLIST.md for more solutions

### Frontend Issues
1. Check Vercel Logs (Dashboard → Project → Deployments)
2. Open DevTools (F12)
3. Check Console tab for JavaScript errors
4. Check Network tab for failed API requests
5. Verify VITE_API_URL in Vercel env variables

### CORS Issues (Frontend can't reach Backend)
1. Verify backend CORS allows your Vercel domain
2. Edit backend/main.py and add your domain
3. Push to GitHub
4. Render auto-deploys (2-5 minutes)
5. Test again

---

## 📊 Architecture After Deployment

```
Your Users
    ↓
[Vercel Frontend]  ← Static React app
    ↓ API Calls
[Render Backend]   ← FastAPI server
    ↓ Database Queries
[Render PostgreSQL] ← Data storage
```

All automatic! When you push to GitHub:
- Render rebuilds backend
- Vercel rebuilds frontend
- Changes live in 3-5 minutes

---

## ⏱️ Estimated Timeline

| Step | Time | What Happens |
|------|------|--------------|
| 1. Prepare Keys | 5 min | Generate keys |
| 2. Deploy Backend | 15 min | Render builds & deploys |
| 3. Initialize DB | 3 min | Load schema into database |
| 4. Deploy Frontend | 10 min | Vercel builds & deploys |
| 5. Test Everything | 5 min | Verify all works |
| **TOTAL** | **~40 min** | ✨ App is Live! ✨ |

---

## 🎉 After Deployment

### Your App is Now:
- ✅ Publicly accessible on the internet
- ✅ Running on production infrastructure
- ✅ Backed by a real database
- ✅ Auto-deploying on GitHub push
- ✅ Free to use (within limits)

### What's Included:
- Frontend: React + Vite + Tailwind
- Backend: FastAPI + PostgreSQL
- AI: Gemini integration
- Features: Auth, career matching, simulations, chat, predictions

### Next Steps:
1. Share your app URL with people
2. Test all features end-to-end
3. Monitor performance
4. Gather user feedback
5. Plan improvements

---

## 💡 Pro Tips

### Tip 1: Custom Domain
Add your own domain:
- Vercel: Settings → Domains
- Render: Service Settings → Custom Domain
- Update DNS records (varies by registrar)

### Tip 2: Monitoring
- Render Dashboard: Check logs regularly
- Vercel Analytics: Monitor performance
- Database: Check storage usage

### Tip 3: Scaling
When you outgrow free tier:
- Upgrade Vercel to Pro ($20/month)
- Upgrade Render to paid PostgreSQL
- Consider better server tier

### Tip 4: Security
- Change SECRET_KEY regularly
- Never commit .env to Git
- Use strong API keys
- Monitor logs for errors

---

## 📞 Quick Links

### Your Production URLs
- **Frontend:** https://nexus-2-0.vercel.app
- **Backend:** https://nexus-ai-backend.onrender.com
- **API Docs:** https://nexus-ai-backend.onrender.com/docs

### Account Dashboards
- **Render:** https://dashboard.render.com
- **Vercel:** https://vercel.com/dashboard
- **GitHub:** https://github.com/joshuva07/Nexus-2.0

### Documentation
- **Render Guide:** See RENDER_DEPLOYMENT.md
- **Vercel Guide:** See VERCEL_DEPLOYMENT.md
- **Full Checklist:** See DEPLOYMENT_CHECKLIST.md

---

## ✨ Summary

You have everything you need! Your GitHub repository includes:

1. ✅ All source code
2. ✅ Configuration files (render.yaml, vercel.json)
3. ✅ Detailed deployment guides
4. ✅ Troubleshooting tips
5. ✅ Environment variable examples

**Next Action:** Follow RENDER_DEPLOYMENT.md to get started!

---

**Good luck! 🚀 Contact me if you need help!**
