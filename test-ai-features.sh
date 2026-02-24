#!/bin/bash

echo "🤖 Testing JanSankalp AI Features..."
echo "=================================="

# Test 1: AI Suggestions
echo "📝 Test 1: AI Suggestions API"
curl -X POST http://localhost:3000/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -d '{"description": "Big pothole on main road causing accidents"}' \
  -w "\nStatus: %{http_code}\n" \
  2>/dev/null || echo "❌ AI Suggestions Test Failed"

echo ""

# Test 2: AI Chat
echo "💬 Test 2: AI Chat API"
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a helpful assistant for Indian citizens."},
      {"role": "user", "content": "How do I file a complaint about road damage?"}
    ]
  }' \
  -w "\nStatus: %{http_code}\n" \
  2>/dev/null || echo "❌ AI Chat Test Failed"

echo ""

# Test 3: AI Engine Direct (if available)
echo "🔧 Test 3: AI Engine Direct"
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test message",
    "history": []
  }' \
  -w "\nStatus: %{http_code}\n" \
  2>/dev/null || echo "❌ AI Engine Direct Test Failed (Server may not be running)"

echo ""

# Test 4: Classification
echo "🏷️ Test 4: AI Classification"
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Garbage pile up causing health issues in the neighborhood"
  }' \
  -w "\nStatus: %{http_code}\n" \
  2>/dev/null || echo "❌ AI Classification Test Failed"

echo ""
echo "✅ AI Testing Complete!"
echo ""
echo "📋 Manual Testing Checklist:"
echo "1. Open http://localhost:3000 and login"
echo "2. Try the AI chatbot (bottom-right corner)"
echo "3. Type in Hindi: 'मैं एक शिकायत कैसे दर्ज करूं?'"
echo "4. Type in English: 'How do I file a complaint?'"
echo "5. Go to complaint form and type description to see AI suggestions"
echo "6. Check if suggestions auto-populate category and priority"
