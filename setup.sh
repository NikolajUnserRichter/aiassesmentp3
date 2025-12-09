#!/bin/bash

# P3 AI Risk Assessment Tool - Setup Script
# This script helps with initial setup of the backend

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   P3 AI Risk Assessment Tool - Setup                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✓ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✓ npm $(npm -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is installed."
    echo "   You can continue, but you'll need to set up the database manually."
else
    echo "✓ PostgreSQL client detected"
fi

echo ""
echo "Step 1: Installing Node.js dependencies..."
npm install

echo ""
echo "Step 2: Setting up environment variables..."

if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and configure your settings:"
    echo "   - Database credentials"
    echo "   - Azure AD application details"
    echo ""
    read -p "Press Enter to continue after configuring .env..."
else
    echo "✓ .env file already exists"
fi

echo ""
echo "Step 3: Database setup..."
echo ""
echo "Please ensure your PostgreSQL database is created."
echo "You can create it manually with:"
echo ""
echo "  psql -U postgres -c \"CREATE DATABASE p3_ai_assessment;\""
echo ""
read -p "Press Enter when your database is ready..."

echo ""
echo "Running database migrations..."
npm run migrate

if [ $? -eq 0 ]; then
    echo "✓ Database migrations completed successfully"
else
    echo "❌ Database migrations failed. Please check your database configuration."
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Setup Complete! 🎉                                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend server:"
echo "   npm start"
echo ""
echo "2. In a separate terminal, serve the frontend:"
echo "   python3 -m http.server 8080"
echo ""
echo "3. Open your browser and navigate to:"
echo "   http://localhost:8080"
echo ""
echo "For more information, see BACKEND_SETUP.md"
echo ""
