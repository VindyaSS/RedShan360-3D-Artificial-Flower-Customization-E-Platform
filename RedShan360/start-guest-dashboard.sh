#!/bin/bash
# 🌸 RedShan360 Quick Start Script

echo "🌸 RedShan360 Guest User Dashboard - Quick Start"
echo "================================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Start dev server
echo ""
echo "🚀 Starting development server..."
echo "   → Open http://localhost:5173"
echo ""
echo "📱 Press Ctrl+C to stop"
echo ""

npm run dev
