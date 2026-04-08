# EGA Mentorship Website - Virtual Environment Setup Guide

## About the `.venv` Directory

The `.venv` folder is a **Python virtual environment** - it's not a single "file" but a directory created by Python. It isolates your project dependencies.

## Setup Instructions

### 1. Create the Virtual Environment
Run this command in your project folder:
```bash
python -m venv .venv
```

### 2. Activate the Virtual Environment

**On Windows (PowerShell):**
```bash
.venv\Scripts\Activate.ps1
```

**On Windows (Command Prompt):**
```bash
.venv\Scripts\activate.bat
```

**On macOS/Linux:**
```bash
source .venv/bin/activate
```

You'll see `(.venv)` appear in your terminal when active.

### 3. Install Dependencies
With the virtual environment active, run:
```bash
pip install -r requirements.txt
```

### 4. Deactivate When Done
```bash
deactivate
```

## What's in requirements.txt?

The `requirements.txt` file includes:
- **Flask** - Lightweight web server for local development
- **black** - Code formatter
- **flake8** - Code linter
- **pylint** - Code quality analyzer
- **python-dotenv** - Environment variable management

## Project Notes

This is a **static HTML/CSS/JavaScript website** - it doesn't require a backend to run. You can:
- Open `EGA_Website_index.html` directly in a browser, OR
- Use Flask to serve it locally with: `python app.py` (requires a simple Flask app)

## .gitignore Reminder

Make sure your `.gitignore` includes:
```
.venv/
__pycache__/
*.pyc
.env
```

This prevents uploading the virtual environment to GitHub.
