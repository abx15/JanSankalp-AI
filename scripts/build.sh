#!/bin/bash

# JanSankalp AI Build Script
# Prepares the project for production

echo "🏗️ Building JanSankalp AI..."

# Ensure Prisma client is up to date
npx prisma generate

# Build Next.js application
npm run build

echo "✅ Build complete!"
