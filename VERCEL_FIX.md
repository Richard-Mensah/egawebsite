# 🚀 Vercel Deployment Guide - Fix for 500 Error

This guide explains how to fix the `500: INTERNAL_SERVER_ERROR` and deploy successfully to Vercel.

---

## ❌ What Was Causing the Error

1. **Incorrect `vercel.json` configuration** — Was set up for static site, not Python backend
2. **Missing serverless function structure** — Backend wasn't in `/api` folder
3. **Database configuration** — SQLite path wasn't serverless-friendly
4. **CORS headers** — Missing proper headers for API requests

---

## ✅ What's Been Fixed

### 1. **New Structure**
```
egawebsite/
├── api/
│   └── index.py          ← Serverless Flask app
├── vercel.json           ← Updated config
├── requirements.txt      ← Updated dependencies
├── .vercelignore         ← Deploy rules
└── *.html, *.css, *.js   ← Static files
```

### 2. **Updated Files**

- ✅ `api/index.py` — New serverless Flask handler
- ✅ `vercel.json` — Proper Python serverless config
- ✅ `requirements.txt` — All dependencies listed
- ✅ `.vercelignore` — Exclude unnecessary files
- ✅ `main.py` — Still works for local development

---

## 🚀 Deploy to Vercel

### Step 1: Set Environment Variables

In **Vercel Project Settings** → **Environment Variables**, add:

```
ADMIN_PASSWORD=your-strong-password-here
SECRET_KEY=your-secret-key-here
FLASK_ENV=production
```

**⚠️ IMPORTANT:** Change these to secure values!

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Fix Vercel deployment - add serverless API"
git push origin main
```

### Step 3: Deploy

Vercel will auto-deploy when you push to main. If not:

```bash
vercel --prod
```

### Step 4: Test

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-domain.vercel.app/api/health

# Submit contact form
curl -X POST https://your-domain.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Hello"
  }'

# Get admin dashboard
curl "https://your-domain.vercel.app/api/admin/dashboard?password=your-admin-password"
```

---

## 🔍 Troubleshooting

### Still Getting 500 Error?

1. **Check Vercel Logs:**
   ```bash
   vercel logs --follow
   ```

2. **Check Function Logs:**
   - Go to Vercel Dashboard → Project → Functions
   - Click the function and view error logs

3. **Common Issues:**

   **Missing Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   **Database Path Error:**
   - Already fixed in `api/index.py` to use `/tmp`
   - No action needed

   **Import Errors:**
   - All imports verified
   - Run locally to test: `python main.py`

   **CORS Errors:**
   - Already configured in `api/index.py`
   - No action needed

### Local Testing Before Deploy

Always test locally first:

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
python main.py

# Test endpoints
curl http://localhost:3000/api/health
```

---

## 📊 Vercel Limitations & Solutions

| Issue | Solution |
|-------|----------|
| SQLite storage ephemeral | Using `/tmp` (new database each invoke) |
| Large deployments | Our setup is lightweight - no issue |
| Cold starts | Flask is lightweight - acceptable |
| Database persistence | Consider: MongoDB Atlas, Firebase, PostgreSQL |

---

## 🔄 For Production (Recommended)

For persistent database, use a cloud service:

### Option 1: MongoDB Atlas + Mongoose (Recommended)

```python
from pymongo import MongoClient

MONGO_URI = os.environ.get('MONGODB_URI')
client = MongoClient(MONGO_URI)
db = client.ega_mentorship
```

### Option 2: PostgreSQL (Supabase / Railway)

```python
DATABASE_URL = os.environ.get('DATABASE_URL')
# Use PostgreSQL instead of SQLite
```

### Option 3: Firebase (Google)

```python
import firebase_admin
from firebase_admin import firestore
```

---

## 📝 Files to Review

Before deploying, check:

1. ✅ `api/index.py` — Main Flask app (serverless)
2. ✅ `vercel.json` — Routing configuration
3. ✅ `requirements.txt` — All dependencies
4. ✅ `analytics.js` — Uses `/api/` endpoints
5. ✅ `contact.html` — Submits to `/api/contact`

---

## 🎯 Next Steps

1. **Set environment variables in Vercel**
2. **Push to GitHub**
3. **Wait 2-3 minutes for deployment**
4. **Test all endpoints**
5. **Monitor logs for errors**

---

## 📞 If Errors Persist

1. **Check Vercel Function Logs:**
   - Vercel Dashboard → Deployments → Function Logs

2. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Build Logs

3. **Redeploy:**
   ```bash
   vercel --prod --force
   ```

4. **Verify Environment Variables:**
   - Settings → Environment Variables

---

## ✨ Expected Result

After deployment:

- ✅ Website loads at `https://your-domain.vercel.app`
- ✅ All pages work (HTML routing)
- ✅ Contact form submits successfully
- ✅ Analytics tracking works
- ✅ Admin dashboard accessible with password
- ✅ No 500 errors

---

## 💡 Pro Tips

1. **Monitor your deployments:**
   ```bash
   vercel list
   ```

2. **View live logs:**
   ```bash
   vercel logs --follow
   ```

3. **Roll back if needed:**
   ```bash
   vercel rollback
   ```

4. **Test before production:**
   - Always test locally first
   - Use staging environment
   - Monitor logs after deployment

---

**Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Ready for Production
