# 🚀 Render Backend Deployment - Step by Step

## Prerequisites
- ✅ GitHub account with code pushed
- ✅ Render account (free at https://render.com)
- ✅ PostgreSQL connection string (we'll create this)

---

## STEP 1: Create PostgreSQL Database on Render

### 1.1 Go to Render Dashboard
```
https://dashboard.render.com
```

### 1.2 Create New Database
- Click **New +** button (top right)
- Select **PostgreSQL**

### 1.3 Configure Database
| Setting | Value |
|---------|-------|
| Name | `nexus-db` |
| PostgreSQL Version | 15 |
| Region | *Select your nearest region* |
| Datastore | Free (included in free tier) |

### 1.4 Click Create Database
- Wait 2-3 minutes for initialization
- ✅ Database created! Copy the **External Database URL**

Example format:
```
postgresql://nexus_xyz:pwd123@dpg-abc123.oregon-postgres.render.com:5432/nexus_db
```

---

## STEP 2: Deploy Backend Service on Render

### 2.1 Go to Render Dashboard
Click **New +** → **Web Service**

### 2.2 Connect GitHub Repository
- Select **GitHub** as source
- Search for `Nexus-2.0`
- Authorize Render to access GitHub
- Select the repository

### 2.3 Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `nexus-ai-backend` |
| **Environment** | `Python 3` |
| **Region** | Same as database |
| **Branch** | `master` |
| **Build Command** | `pip install -r backend/requirements.txt` |
| **Start Command** | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |

### 2.4 Scroll Down - Add Environment Variables

Click **Advanced** → **Add Environment Variable**

Add these variables:

```
DATABASE_URL = postgresql://nexus_xyz:pwd123@dpg-abc123.oregon-postgres.render.com:5432/nexus_db
SECRET_KEY = (generate with: python -c "import secrets; print(secrets.token_urlsafe(32))")
GEMINI_API_KEY = your-gemini-key-from-google
OPENAI_API_KEY = (optional)
AI_PROVIDER = gemini
```

### 2.5 Click Create Web Service
⏳ Render will start building... (takes 2-5 minutes)

Look for: **"Your service is live"** ✅

---

## STEP 3: Initialize Database Schema

### 3.1 Open Render Shell
In your Web Service dashboard:
- Click **Shell** tab (near Logs)

### 3.2 Run Database Schema
```bash
psql $DATABASE_URL < database/schema.sql
```

Or manually import using psql CLI locally:
```bash
psql "your-database-url" < database/schema.sql
```

### 3.3 Verify
You should see output like:
```
CREATE TABLE
CREATE TABLE
...
```

✅ Database initialized!

---

## STEP 4: Test Backend

### 4.1 Get Your Backend URL
From Render dashboard, you'll see:
```
Service Name: nexus-ai-backend
Live URL: https://nexus-ai-backend.onrender.com
```

### 4.2 Test API Health
Open in browser:
```
https://nexus-ai-backend.onrender.com/health
```

Should return:
```json
{
  "status": "healthy"
}
```

### 4.3 Test API Docs
Open in browser:
```
https://nexus-ai-backend.onrender.com/docs
```

You'll see Swagger UI with all endpoints!

---

## STEP 5: Configure Auto-Deploy

Render automatically deploys on GitHub push, but you can customize:

1. Go to Service Settings
2. Select **Deploys**
3. Choose:
   - ✅ Auto-deploy from branch: `master`
   - ✅ Deploy on merge

---

## TROUBLESHOOTING

### ❌ Service won't build
**Solution:**
1. Check **Logs** tab for error messages
2. Ensure `backend/requirements.txt` exists
3. Check Python syntax in backend code

### ❌ Build succeeds but service crashes
**Solution:**
1. Verify DATABASE_URL is correct
2. Run database schema: `psql $DATABASE_URL < database/schema.sql`
3. Check all environment variables are set

### ❌ Database connection fails
**Solution:**
1. Verify connection string from Render PostgreSQL
2. Test locally: `psql "your-connection-string"`
3. Ensure database/schema.sql has correct SQL

### ❌ CORS errors from frontend
**Solution:**
1. Update `backend/main.py` CORS origins
2. Add your Vercel domain to allowed origins
3. Redeploy backend (push to GitHub)

---

## ✅ Success Indicators

- [ ] Backend URL shows "Service is live"
- [ ] `/health` endpoint returns `{"status": "healthy"}`
- [ ] `/docs` shows Swagger API documentation
- [ ] Database schema initialized
- [ ] No errors in Logs tab

---

## 📞 Next Steps

1. ➡️ Deploy Frontend on Vercel (see VERCEL_DEPLOYMENT.md)
2. ➡️ Connect Frontend & Backend
3. ➡️ Test full application flow

🎉 Backend is now deployed on Render!
