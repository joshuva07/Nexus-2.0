# 🌐 Vercel Frontend Deployment - Step by Step

## Prerequisites
- ✅ GitHub account with code pushed
- ✅ Vercel account (free at https://vercel.com)
- ✅ Backend already deployed on Render (URL: https://nexus-ai-backend.onrender.com)

---

## STEP 1: Sign Up / Log In to Vercel

### 1.1 Go to Vercel
```
https://vercel.com
```

### 1.2 Sign In
- Click **Sign In**
- Choose **Continue with GitHub**
- Authorize Vercel to access GitHub

---

## STEP 2: Import Project to Vercel

### 2.1 Click "New Project"
In your Vercel Dashboard, click **Add New...** → **Project**

### 2.2 Select Repository
- Search for `Nexus-2.0`
- Click **Import**

### 2.3 Configure Project

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `./frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Environment Variables** | (Set in next step) |

---

## STEP 3: Add Environment Variables

### 3.1 Click "Environment Variables"

Before clicking Deploy, add:

```
VITE_API_URL = https://nexus-ai-backend.onrender.com
```

**Alternative:** If using custom domain:
```
VITE_API_URL = https://api.yourdomain.com
```

### 3.2 Make sure "Production" is selected
- ✅ Production
- Development (optional)

---

## STEP 4: Deploy

### 4.1 Click "Deploy"
⏳ Vercel will start building... (takes 1-3 minutes)

You'll see:
```
Packages installed
Build completed
Deployment complete!
```

### 4.2 Get Your Frontend URL
Vercel will show:
```
Production: https://nexus-2-0.vercel.app
```

(Your URL will be different based on project name)

---

## STEP 5: Verify Deployment

### 5.1 Visit Your Frontend
Open your Vercel URL in browser:
```
https://nexus-2-0.vercel.app
```

You should see the Nexus landing page!

### 5.2 Check API Connection
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try login or any action
4. Check if requests go to `https://nexus-ai-backend.onrender.com`

Expected headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### 5.3 Check Console for Errors
Look for:
- ❌ CORS errors → update backend CORS
- ❌ 404 errors → verify API URL
- ❌ Network errors → check backend is running

---

## STEP 6: Update Backend CORS (If Needed)

If frontend can't reach backend:

### 6.1 Edit `backend/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://nexus-2-0.vercel.app",  # Your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 6.2 Push Changes
```bash
git add backend/main.py
git commit -m "Update CORS for Vercel frontend"
git push
```

### 6.3 Render Redeploys Automatically
⏳ Wait 2-3 minutes for auto-deploy

---

## STEP 7: Configure Custom Domain (Optional)

### 7.1 Add Your Domain
In Vercel Dashboard → Settings → Domains

```
app.yourdomain.com
```

### 7.2 Update DNS Records
Follow Vercel's DNS instructions for your registrar

Common registrars:
- GoDaddy
- Namecheap
- Route53
- Cloudflare

### 7.3 Verify Custom Domain
Wait 5-10 minutes for DNS propagation
```
https://app.yourdomain.com
```

---

## STEP 8: Configure Auto-Deploy

Vercel automatically deploys on every push!

To customize:
1. Vercel Dashboard → Settings → Git
2. ✅ **Deploy on Push** (automatic)
3. Choose branch: `master` or `main`

---

## STEP 9: Set Analytics (Optional)

In Vercel Dashboard:
1. Go to **Analytics**
2. Enable to monitor:
   - Page load times
   - Web Vitals
   - User traffic
   - Error tracking

---

## TROUBLESHOOTING

### ❌ Build fails
**Solution:**
```bash
# Test locally first
cd frontend
npm run build

# Check for errors in output
# Common issue: Missing dependencies
npm install

# Push working build
git push
```

### ❌ Frontend loads but blank page
**Solution:**
1. Check browser console (F12)
2. Look for JavaScript errors
3. Verify `VITE_API_URL` is set
4. Check network requests in Network tab

### ❌ Can't reach backend API
**Solution:**
1. Verify `VITE_API_URL` in Vercel env variables
2. Check backend CORS includes your Vercel URL
3. Test API health: `https://nexus-ai-backend.onrender.com/health`
4. Check browser console for CORS errors

### ❌ Login/Register not working
**Solution:**
1. Verify backend is running
2. Check response status in Network tab
3. Ensure database is initialized
4. Look for 500 errors in backend logs

### ❌ Deployment stuck/slow
**Solution:**
1. Check Vercel build logs
2. Verify no large files being uploaded
3. Check GitHub connectivity
4. Try redeploying

---

## ✅ Success Indicators

- [ ] Vercel shows "Deployment Complete"
- [ ] Frontend URL loads without errors
- [ ] Landing page displays correctly
- [ ] Console shows no JavaScript errors
- [ ] Network requests go to backend
- [ ] Can navigate between pages
- [ ] Can interact with API

---

## 📞 Next Steps

1. ➡️ Test Login Flow
   - Go to /login
   - Try creating account
   - Verify data saved in database

2. ➡️ Test Career Features
   - Try career matching
   - Check predictions load
   - Verify simulations work

3. ➡️ Chat Features
   - Open chatbot widget
   - Ask career questions
   - Check Gemini API responses

4. ➡️ Monitor Performance
   - Check Vercel Analytics
   - Check Render logs
   - Monitor database performance

---

## 🎉 Frontend Successfully Deployed!

Your application is now live on:
- **Frontend:** https://nexus-2-0.vercel.app (your URL)
- **Backend:** https://nexus-ai-backend.onrender.com
- **Database:** Render PostgreSQL

🚀 Share your app with others!
