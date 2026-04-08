# 🚀 EGA Mentorship Backend Setup Guide

This guide explains how to set up, run, and deploy the backend for the EGA Mentorship website.

---

## 📋 Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Running Locally](#running-locally)
4. [API Documentation](#api-documentation)
5. [Database](#database)
6. [Deployment](#deployment)
7. [Environment Variables](#environment-variables)

---

## 🔧 Installation

### Prerequisites

- **Python 3.7+** — [Download](https://www.python.org/downloads/)
- **pip** — Python package manager (comes with Python)
- **Git** — [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/egawebsite.git
cd egawebsite
```

### Step 2: Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ⚙️ Configuration

### Create `.env` File

Create a `.env` file in the project root:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=true
SECRET_KEY=your-secret-key-here-change-in-production

# Admin Configuration
ADMIN_PASSWORD=change-this-admin-password

# Database Configuration (optional)
DATABASE_PATH=ega_data.db

# Port
PORT=3000
```

**Security Note:** Change `SECRET_KEY` and `ADMIN_PASSWORD` in production!

---

## 🏃 Running Locally

### Start the Backend Server

```bash
# Ensure virtual environment is activated
python main.py
```

**Expected Output:**
```
🚀 Starting EGA Mentorship Backend Server on port 3000
📊 Admin Dashboard: http://localhost:3000/admin?password=your-admin-password
```

### Test the Server

Open in your browser:
- **Frontend:** http://localhost:3000/home.html
- **Health Check:** http://localhost:3000/api/health
- **Admin Dashboard:** http://localhost:3000/admin?password=your-admin-password

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. **Contact Form Submission**

**POST** `/api/contact`

Submit a contact form message.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Interested in Mentorship",
  "message": "Hello, I would like to..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Message received! We will get back to you soon.",
  "submission_id": 1
}
```

**Error Response (400):**
```json
{
  "error": "Missing required fields"
}
```

---

#### 2. **Get Contact Submission**

**GET** `/api/contact/<submission_id>`

Retrieve a specific contact submission.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Interested in Mentorship",
  "message": "Hello, I would like to...",
  "submitted_at": "2026-04-08T10:30:00",
  "status": "new"
}
```

---

#### 3. **Track Analytics Event**

**POST** `/api/analytics/track`

Send analytics data to the server.

**Request:**
```json
{
  "session_id": "session_1234567890_abc123",
  "page": "Home",
  "event_type": "page_view",
  "event_data": {
    "scroll_depth": "100%"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true
}
```

---

#### 4. **Get Analytics Summary**

**GET** `/api/analytics/summary?password=<admin-password>`

Get analytics summary data.

**Response:**
```json
{
  "total_views": 150,
  "unique_sessions": 45,
  "total_events": 320,
  "page_views": {
    "Home": 85,
    "About": 35,
    "Services": 20,
    "Contact": 10
  }
}
```

---

#### 5. **Get All Contact Submissions**

**GET** `/api/admin/submissions?password=<admin-password>`

Retrieve all contact form submissions.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Interested in Mentorship",
    "message": "Hello...",
    "submitted_at": "2026-04-08T10:30:00",
    "status": "new"
  }
]
```

---

#### 6. **Update Submission Status**

**PUT** `/api/admin/submissions/<submission_id>/status?password=<admin-password>`

Update the status of a contact submission.

**Request:**
```json
{
  "status": "replied"
}
```

**Response:**
```json
{
  "id": 1,
  "status": "replied",
  ...
}
```

**Status Options:** `new`, `replied`, `archived`

---

#### 7. **Admin Dashboard Data**

**GET** `/api/admin/dashboard?password=<admin-password>`

Get admin dashboard summary data.

**Response:**
```json
{
  "total_submissions": 42,
  "new_submissions": 5,
  "total_events": 1250,
  "recent_submissions": [
    { "id": 42, "name": "Jane Smith", ... }
  ]
}
```

---

#### 8. **Health Check**

**GET** `/api/health`

Check if the server is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-08T10:30:00",
  "database": "connected"
}
```

---

## 💾 Database

### Database Structure

The application uses SQLite by default with two main tables:

#### `contact_submission`
```
id (Integer, Primary Key)
name (String, 120 chars)
email (String, 120 chars)
subject (String, 200 chars)
message (Text)
user_agent (String, 500 chars)
ip_address (String, 50 chars)
submitted_at (DateTime)
status (String, 20 chars) - new/replied/archived
```

#### `analytics_log`
```
id (Integer, Primary Key)
session_id (String, 100 chars)
page (String, 100 chars)
event_type (String, 50 chars)
event_data (JSON)
user_agent (String, 500 chars)
ip_address (String, 50 chars)
timestamp (DateTime)
```

### Database File Location

```
egawebsite/
└── ega_data.db    # SQLite database file
```

### Backing Up the Database

```bash
# Copy the database file to a backup location
cp ega_data.db ega_data_backup_$(date +%Y%m%d_%H%M%S).db
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add backend"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set framework to "Other"

3. **Configure Environment Variables:**
   In Vercel project settings, add:
   ```
   SECRET_KEY=your-production-secret-key
   ADMIN_PASSWORD=strong-admin-password
   FLASK_ENV=production
   ```

4. **Deploy:**
   Vercel will automatically deploy when you push to main.

### Deploy to Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku App:**
   ```bash
   heroku create egamentorship-api
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set SECRET_KEY=your-prod-secret-key
   heroku config:set ADMIN_PASSWORD=strong-password
   heroku config:set FLASK_ENV=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)

2. **Connect GitHub Repository**

3. **Set Environment Variables**

4. **Deploy**

Railway will auto-detect Python and Flask.

---

## 🔐 Environment Variables

### Development
```env
FLASK_ENV=development
FLASK_DEBUG=true
SECRET_KEY=dev-key-not-secure
ADMIN_PASSWORD=admin123
PORT=3000
```

### Production
```env
FLASK_ENV=production
FLASK_DEBUG=false
SECRET_KEY=<use-strong-random-key>
ADMIN_PASSWORD=<use-strong-password>
PORT=<provided-by-hosting>
```

### Generate Strong Secret Key

**Python:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

**Bash:**
```bash
openssl rand -base64 32
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Database Lock Error

```bash
# Delete corrupted database and restart
rm ega_data.db
python main.py
```

### ImportError: No module named 'flask'

```bash
# Install dependencies again
pip install -r requirements.txt
```

### CORS Error

The backend already has CORS enabled. If you still get CORS errors:

1. Check that the frontend and backend URLs match
2. Ensure Flask-CORS is installed: `pip install Flask-CORS`

---

## 📊 Monitoring

### View Recent Submissions

```bash
# To check submissions in database, use the admin API:
curl "http://localhost:3000/api/admin/submissions?password=admin123"
```

### View Analytics

```bash
curl "http://localhost:3000/api/analytics/summary?password=admin123"
```

### Check Server Health

```bash
curl http://localhost:3000/api/health
```

---

## 🔄 Next Steps

1. **Email Integration** — Add Flask-Mail for email notifications
2. **User Authentication** — Implement Flask-Login for user accounts
3. **Admin Panel** — Build a web-based admin dashboard
4. **API Documentation** — Generate with Swagger/OpenAPI
5. **Testing** — Write unit tests with pytest
6. **Caching** — Add Redis for performance
7. **Analytics Charts** — Integrate Chart.js for visualizations

---

## 📚 Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
- [Vercel Python Deployment](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python)

---

## ❓ Need Help?

- Review logs in your hosting dashboard
- Check the Flask debug output
- Test endpoints with Postman or Insomnia
- Review error messages in the console

**Contact:** hello@egamentorship.org

---

**Last Updated:** April 2026  
**Backend Version:** 1.0
