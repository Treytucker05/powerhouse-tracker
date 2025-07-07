#!/bin/bash

# PowerHouse Tracker Setup Script
# This script sets up the development environment from the correct directory

echo "🏋️ PowerHouse Tracker - Development Setup"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the tracker-ui directory"
    echo "📁 Please navigate to: tracker-ui-good/tracker-ui/"
    echo "💡 Example: cd tracker-ui-good/tracker-ui && ./setup.sh"
    exit 1
fi

echo "✅ Correct directory detected"
echo "📦 Installing dependencies..."

# Install dependencies
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
    echo ""
    echo "🚀 Available commands:"
    echo "  npm run dev        # Start development server"
    echo "  npm run build      # Build for production" 
    echo "  npm run test       # Run tests"
    echo "  npm run lint       # Lint code"
    echo "  npm run test:e2e   # Run E2E tests"
    echo ""
    echo "🌐 To start development:"
    echo "  npm run dev"
    echo ""
    echo "📖 See README.md for more information"
else
    echo "❌ Failed to install dependencies"
    echo "💡 Try: npm cache clean --force && npm install --legacy-peer-deps"
    exit 1
fi
