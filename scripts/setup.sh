#!/bin/bash

# JanSankalp AI Setup Script
# Stabilizes environment and installs dependencies

echo "🚀 Starting JanSankalp AI Setup..."

# 1. Install Dependencies
echo "📦 Installing npm dependencies..."
npm install

# 2. Prisma Client Generation
echo "💎 Generating Prisma Client..."
npx prisma generate

# 3. Environment File
if [ ! -f .env ]; then
    echo "📄 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your specific credentials."
else
    echo "✅ .env file already exists."
fi

echo "✨ Setup complete! Use './scripts/dev.sh' to start the development server."
