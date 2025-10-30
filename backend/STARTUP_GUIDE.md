# 🚀 Quick Startup Guide

## Issues Fixed:

1. **Missing .env file** - Added fallback environment setup
2. **Missing chatbot routes** - Added chatbot routes to server.js
3. **Complex dependencies** - Created simple fallback chatbot
4. **Route not found errors** - Fixed route registration

## How to Start:

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Server

```bash
npm run dev
```

### 3. Test the Chatbot

Visit these URLs to verify everything works:

- **Server Health**: http://localhost:3000/api/health
- **Chatbot Health**: http://localhost:3000/api/chatbot/health
- **Chatbot Capabilities**: http://localhost:3000/api/chatbot/capabilities

### 4. Test Chat Endpoint

Use a tool like Postman or curl:

```bash
curl -X POST http://localhost:3000/api/chatbot/send \
  -H "Content-Type: application/json" \
  -d '{"message": "What programs do you offer?"}'
```

## Expected Response Format:

```json
{
  "response": "Verdia University offers comprehensive undergraduate and graduate programs...",
  "success": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Troubleshooting:

### If you see "Route not found":

- Make sure chatbot routes are properly registered in server.js
- Check that the server started successfully

### If you see "Chatbot error":

- Check the server console for detailed error messages
- Verify that the knowledge base JSON file exists

### If responses are generic:

- The chatbot is using keyword-based matching
- Add your Gemini API key to enable advanced features

## Current Mode:

- **Simple Keyword-based Chatbot** (No external dependencies)
- **Fallback responses** for unknown questions
- **JSON-based knowledge base** from processed files

## To Enable Advanced Features:

1. Create a `.env` file with `GEMINI_API_KEY=your-key`
2. Install LangChain dependencies: `npm install @langchain/core @langchain/community`
3. Switch back to `advancedChatbot.js` in the controller

The chatbot should now work without any "communication errors"!
