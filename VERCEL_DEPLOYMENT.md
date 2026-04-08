# Vercel Deployment Guide for EGA Website

## ✅ What I Fixed

The error **"Could not find a top-level 'app', 'application', or 'handler' in 'main.py'"** occurred because:

1. **Vercel detected `requirements.txt`** → It thought this was a Python project
2. **Missing `main.py`** → Vercel looked for a Python handler but found nothing
3. **No `vercel.json`** → Vercel didn't know how to build/serve the site

### Solution Implemented:

✔️ **Created `main.py`** – Flask app that serves your HTML file  
✔️ **Created `vercel.json`** – Configuration for static site serving  
✔️ **Updated `requirements.txt`** – Minimal dependencies (only Flask + Werkzeug)  
✔️ **Created `.gitignore`** – Prevents unnecessary files from uploading  

---

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository: `Richard-Mensah/egawebsite`
4. Click **"Deploy"**

Vercel will automatically:
- Detect the Python dependencies
- Run `main.py` as the handler
- Serve your HTML file at the root URL

### 3. Verify Your Site
Your website will be live at: `https://egawebsite.vercel.app` (or your custom domain)

---

## 📁 File Structure (After Fix)

```
egawebsite/
├── EGA_Website_index.html    ← Your main website
├── main.py                    ← Python handler for Vercel
├── vercel.json                ← Vercel configuration
├── requirements.txt           ← Python dependencies
├── .gitignore                 ← Git ignore rules
├── README.md
├── VENV_SETUP.md
└── ega.jpg
```

---

## 🔧 How It Works Now

1. **Vercel detects `main.py`** with a Flask `app` object ✓
2. **Flask serves `EGA_Website_index.html`** at the root route (`/`) ✓
3. **Static files are served** (images, CSS in the HTML) ✓
4. **No build step needed** – it's all static HTML/CSS/JS ✓

---

## 📝 Alternative: Rename to index.html (Optional)

For cleaner URLs, you could rename:
- `EGA_Website_index.html` → `index.html`

Then update `main.py` line 11:
```python
return send_file('index.html')  # Change from EGA_Website_index.html
```

---

## 🛠️ Local Testing Before Deploying

### Test locally with Flask:
```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Then visit: `http://localhost:3000`

If it works locally, it will work on Vercel! ✓

---

## ❓ Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| 404 errors | Make sure `EGA_Website_index.html` exists in the root |
| Build fails | Run `pip install -r requirements.txt` locally first |
| Slow load times | Enable Vercel's automatic image optimization |
| Custom domain issues | Update DNS settings in Vercel dashboard |

---

## 📚 Learn More

- [Vercel Python Docs](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Flask Deployment Guide](https://flask.palletsprojects.com/deployment/)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

**You're all set! 🎉 Your website should now deploy successfully on Vercel.**
