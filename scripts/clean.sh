#!/bin/bash

# JanSankalp AI Cleanup Script
# Removes build artifacts and cached files

echo "🧹 Cleaning up..."

rm -rf .next
rm -rf out
rm -rf *.tsbuildinfo

echo "✨ Cleanup complete!"
