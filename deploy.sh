#!/bin/bash
# Deployment Script for Nexus 2.0 Backend on Render

echo "🚀 Nexus 2.0 Backend Deployment Script"
echo "======================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "   Please set it before running this script"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r backend/requirements.txt
echo "✅ Dependencies installed"
echo ""

# Run database migrations
echo "🗄️  Initializing database schema..."
psql $DATABASE_URL < database/schema.sql
echo "✅ Database schema initialized"
echo ""

# Start the server
echo "🌐 Starting FastAPI server..."
echo "   Backend will be available at: http://0.0.0.0:8000"
echo "   API Docs at: http://0.0.0.0:8000/docs"
echo ""

uvicorn backend.main:app --host 0.0.0.0 --reload
