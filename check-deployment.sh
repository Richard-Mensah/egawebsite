#!/bin/bash
# EGA Mentorship - Vercel Deployment Checklist
# Run this to verify everything is ready for deployment

echo "🔍 EGA Mentorship Vercel Deployment Checklist"
echo "============================================="
echo ""

# Check if files exist
echo "✓ Checking required files..."
files=(
    "api/index.py"
    "vercel.json"
    "requirements.txt"
    ".vercelignore"
    "home.html"
    "about.html"
    "contact.html"
    "analytics.html"
    "styles.css"
    "scripts.js"
    "analytics.js"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - MISSING"
        all_exist=false
    fi
done

echo ""
echo "✓ Checking requirements.txt dependencies..."
required_packages=(
    "Flask"
    "Flask-SQLAlchemy"
    "Flask-CORS"
    "SQLAlchemy"
)

for package in "${required_packages[@]}"; do
    if grep -q "$package" requirements.txt; then
        echo "  ✅ $package"
    else
        echo "  ❌ $package - MISSING"
    fi
done

echo ""
echo "✓ Checking vercel.json configuration..."
if grep -q "api/index.py" vercel.json; then
    echo "  ✅ Serverless function configured"
else
    echo "  ❌ Serverless function not configured"
fi

if grep -q "ADMIN_PASSWORD" vercel.json; then
    echo "  ✅ Environment variables configured"
else
    echo "  ❌ Environment variables not configured"
fi

echo ""
echo "✓ Checking .gitignore for venv..."
if grep -q "venv" .gitignore; then
    echo "  ✅ venv ignored"
else
    echo "  ⚠️  venv might not be ignored - consider adding to .gitignore"
fi

echo ""
echo "✓ Checking api/index.py structure..."
if grep -q "def index()" api/index.py || grep -q "app = Flask" api/index.py; then
    echo "  ✅ Flask app defined"
else
    echo "  ❌ Flask app not found"
fi

if grep -q "@app.route('/api/contact'" api/index.py; then
    echo "  ✅ Contact endpoint defined"
else
    echo "  ❌ Contact endpoint missing"
fi

echo ""
echo "============================================="
echo ""

if [ "$all_exist" = true ]; then
    echo "✅ All files present and configured!"
    echo ""
    echo "Next steps:"
    echo "1. Set environment variables in Vercel:"
    echo "   - ADMIN_PASSWORD (required)"
    echo "   - SECRET_KEY (required)"
    echo "2. Commit and push to GitHub"
    echo "3. Vercel will auto-deploy"
    echo "4. Check Vercel logs if errors occur"
else
    echo "❌ Some files are missing!"
    echo "Please ensure all required files are in place."
fi

echo ""
echo "Deploy command:"
echo "  vercel --prod"
echo ""
