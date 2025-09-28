# Verdia University AI Chatbot Setup

This document provides instructions for setting up the AI chatbot with Gemini API integration and RAG capabilities.

## Features Implemented

- ✅ **Gemini API Integration**: Uses Google's Gemini Pro model for AI responses
- ✅ **RAG (Retrieval-Augmented Generation)**: Searches knowledge base for relevant context
- ✅ **Authentication System**: Login/Signup functionality with JWT tokens
- ✅ **Simplified UI**: Clean, modern chat interface with Material Design
- ✅ **Real-time Chat**: Live messaging with typing indicators
- ✅ **Chat History**: Persistent conversation storage
- ✅ **Knowledge Base**: Pre-loaded with university information

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install @google/generative-ai
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/college_admission

# Server
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env` file

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

## Frontend Setup

### 1. Install Dependencies (if needed)

```bash
cd frontend
npm install
```

### 2. Start Frontend Development Server

```bash
cd frontend
ng serve
```

## Usage

### 1. Access the Application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

### 2. Authentication

1. Navigate to `/auth` or click "Login / Sign Up" on the chatbot page
2. Create a new account or login with existing credentials
3. After authentication, you'll be redirected to the chatbot

### 3. Using the Chatbot

1. Once authenticated, you can start chatting with the AI assistant
2. The chatbot has knowledge about:
   - Admission requirements and procedures
   - Program information (Computer Science, Business Administration)
   - Scholarship opportunities
   - Application deadlines
   - General university information

### 4. API Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)

#### Chatbot

- `POST /api/chatbot/send` - Send message to chatbot
- `GET /api/chatbot/history/:sessionId` - Get chat history
- `DELETE /api/chatbot/history/:sessionId` - Clear chat history
- `GET /api/chatbot/health` - Health check

## Knowledge Base

The chatbot includes a pre-loaded knowledge base with information about:

- **Admission Requirements**: GPA, transcripts, SAT/ACT scores, application process
- **Application Deadlines**: Fall, Spring, Summer semester deadlines
- **Programs**: Computer Science and Business Administration details
- **Scholarships**: Merit-based and need-based financial aid
- **General Information**: University policies and procedures

## RAG Implementation

The system uses a simple but effective RAG approach:

1. **Query Processing**: User questions are processed and keywords extracted
2. **Knowledge Search**: Relevant documents are retrieved from the knowledge base
3. **Context Building**: Retrieved information is formatted as context
4. **AI Generation**: Gemini API generates responses using the context
5. **Response Delivery**: AI responses are returned to the user

## Customization

### Adding Knowledge Base Content

Edit the `initializeKnowledgeBase()` method in `backend/controllers/chatbotController.js` to add more university information.

### Modifying AI Behavior

Update the `systemPrompt` in `backend/controllers/chatbotController.js` to change how the AI assistant behaves.

### UI Customization

Modify the CSS files in `frontend/src/app/components/chatbot-placeholder/` to customize the appearance.

## Troubleshooting

### Common Issues

1. **Gemini API Key Error**: Ensure your API key is correctly set in the `.env` file
2. **Database Connection**: Make sure MongoDB is running and accessible
3. **CORS Issues**: Check that the backend CORS settings include your frontend URL
4. **Authentication Errors**: Verify JWT secret is set and consistent

### Health Checks

- Backend: `GET http://localhost:3000/api/health`
- Chatbot: `GET http://localhost:3000/api/chatbot/health`

## Security Notes

- Change the JWT secret in production
- Use environment variables for all sensitive data
- Implement rate limiting for production use
- Consider adding input validation and sanitization
- Use HTTPS in production

## Next Steps

Potential enhancements:

- Vector embeddings for better semantic search
- File upload capability for document analysis
- Multi-language support
- Admin panel for knowledge base management
- Analytics and conversation insights
- Integration with existing university systems
