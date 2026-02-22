#!/usr/bin/env bash

# ============================================================================
# HEARTFELT INTERNATIONAL MINISTRIES
# RUN FROM LOGIN TO DASHBOARD - STEP BY STEP
# ============================================================================

echo "🙏 Welcome to Heartfelt Ministry Management System"
echo ""
echo "This script will help you set up and run the project"
echo "=================================================="
echo ""

# Step 1: Check Node.js
echo "📋 Step 1: Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version) found"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 3: Install additional packages
echo "📦 Step 3: Installing additional packages..."
npm install qrcode react-leaflet leaflet lucide-react csv-parse
echo "✅ Additional packages installed"
echo ""

# Step 4: Check .env.local
echo "🔧 Step 4: Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo ""
    echo "📝 Create .env.local with these contents:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here"
    echo "NEXT_PUBLIC_APP_URL=http://localhost:3000"
    echo ""
    echo "Then run this script again."
    exit 1
fi
echo "✅ .env.local found"
echo ""

# Step 5: Start development server
echo "🚀 Step 5: Starting development server..."
echo ""
echo "=========================================="
echo "✅ Server starting..."
echo "=========================================="
echo ""
echo "📝 INSTRUCTIONS:"
echo ""
echo "1. Open browser: http://localhost:3000"
echo ""
echo "2. You'll see the LOGIN PAGE"
echo ""
echo "3. Login with:"
echo "   Email: admin@heartfelt.zw"
echo "   Password: (your Supabase password)"
echo ""
echo "4. After login:"
echo "   - Auto-redirects to /dashboard"
echo "   - You'll see KPI cards with stats"
echo "   - Click menu items to manage data"
echo ""
echo "5. To exit:"
echo "   - Press Ctrl+C in this terminal"
echo ""
echo "=========================================="
echo ""

# Start the dev server
npm run dev
