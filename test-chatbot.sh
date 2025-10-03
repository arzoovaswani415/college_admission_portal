#!/bin/bash

echo "🎓 Testing Veridia University Chatbot Integration"
echo "================================================"

# Check if backend is running
echo "📡 Checking backend server..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server is not running"
    echo "Please start the backend server first:"
    echo "cd backend && npm run dev"
    exit 1
fi

# Check if frontend is running
echo "📡 Checking frontend server..."
if curl -s http://localhost:4200 > /dev/null; then
    echo "✅ Frontend server is running"
else
    echo "❌ Frontend server is not running"
    echo "Please start the frontend server first:"
    echo "cd frontend && npm start"
    exit 1
fi

# Test chatbot status endpoint
echo "🤖 Testing chatbot status..."
STATUS_RESPONSE=$(curl -s http://localhost:3000/api/chatbot/status)
echo "Status response: $STATUS_RESPONSE"

# Test chatbot initialization
echo "🚀 Testing chatbot initialization..."
INIT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/chatbot/initialize)
echo "Init response: $INIT_RESPONSE"

echo ""
echo "🎉 Test completed!"
echo ""
echo "📋 Next steps:"
echo "1. Visit http://localhost:4200/chatbot"
echo "2. Make sure you have a Google API key in backend/.env"
echo "3. Ensure MongoDB is running"
echo "4. Try asking questions like:"
echo "   - 'What are the admission requirements?'"
echo "   - 'How much does the MBA program cost?'"
echo "   - 'What is the application deadline?'"
