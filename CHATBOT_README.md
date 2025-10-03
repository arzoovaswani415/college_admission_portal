# Veridia University Chatbot Integration

This document describes the RAG-based chatbot integration for the Veridia University admission portal.

## Overview

The chatbot system uses Retrieval-Augmented Generation (RAG) to provide intelligent responses about university admissions, programs, and campus life. It combines LangChain, Google's Gemini AI, and FAISS vector database to deliver accurate and contextual information.

## Architecture

```
Frontend (Angular) → Backend (Node.js) → Python Service (Flask) → Google Gemini AI
```

### Components

1. **Frontend**: Angular chatbot component with modern UI
2. **Backend**: Node.js API server with chatbot routes
3. **Python Service**: Flask-based RAG service with LangChain
4. **Vector Database**: FAISS for document embeddings
5. **AI Model**: Google Gemini 2.0 Flash for text generation

## Features

- 🤖 **Intelligent Responses**: Context-aware answers based on university documents
- 💬 **Conversation Memory**: Maintains chat history across sessions
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful chat interface with typing indicators
- 🔄 **Real-time Communication**: Instant responses with loading states
- 📚 **Document-based Knowledge**: Answers based on college information PDF

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB
- Google API Key (for Gemini AI)

### Installation

1. **Run the setup script**:
   ```bash
   chmod +x setup-chatbot.sh
   ./setup-chatbot.sh
   ```

2. **Configure environment variables**:
   - Update `backend/.env` with your Google API key
   - Ensure MongoDB is running

3. **Start the services**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

### Manual Installation

If the setup script doesn't work, follow these steps:

1. **Install Python dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Install Node.js dependencies**:
   ```bash
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

## API Endpoints

### Backend Endpoints (Node.js)

- `POST /api/chatbot/initialize` - Initialize the chatbot service
- `POST /api/chatbot/chat` - Send message to chatbot
- `GET /api/chatbot/status` - Get chatbot status
- `POST /api/chatbot/stop` - Stop chatbot service

### Python Service Endpoints (Flask)

- `GET /health` - Health check
- `POST /chat` - Process chat messages
- `POST /initialize` - Initialize RAG chain

## Usage

1. **Navigate to the chatbot**: Visit `http://localhost:4200/chatbot`
2. **Wait for initialization**: The chatbot will automatically initialize
3. **Start chatting**: Ask questions about:
   - Course information and eligibility
   - Fee structure and scholarships
   - Important dates and deadlines
   - Campus life and facilities
   - Placement statistics

## Example Queries

- "What are the admission requirements for Computer Science?"
- "How much does the MBA program cost?"
- "What is the application deadline?"
- "Tell me about campus housing options"
- "What companies recruit from Veridia University?"

## Configuration

### Environment Variables

```env
# Google AI Configuration
GOOGLE_API_KEY=your_google_api_key_here

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/veridia_admissions

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Customization

1. **Update Knowledge Base**: Replace `backend/assets/COLLEGE-INFORMATION.pdf` with your university's information
2. **Modify Prompts**: Edit the prompt template in `chatbot_service.py`
3. **Styling**: Customize the chatbot UI in `chatbot.component.css`
4. **Branding**: Update university name and colors throughout the components

## Troubleshooting

### Common Issues

1. **Python Service Not Starting**:
   - Check if Python dependencies are installed
   - Verify Google API key is set correctly
   - Ensure PDF file exists in assets folder

2. **Frontend Not Loading**:
   - Check if Angular dependencies are installed
   - Verify backend server is running
   - Check browser console for errors

3. **Chatbot Not Responding**:
   - Check Python service health endpoint
   - Verify Google API key has proper permissions
   - Check backend logs for errors

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## File Structure

```
college_admission_portal/
├── backend/
│   ├── assets/
│   │   └── COLLEGE-INFORMATION.pdf
│   ├── controllers/
│   │   └── chatbotController.js
│   ├── routes/
│   │   └── chatbot.js
│   ├── chatbot_service.py
│   ├── requirements.txt
│   └── package.json
├── frontend/
│   ├── src/app/
│   │   ├── components/chatbot/
│   │   │   ├── chatbot.component.ts
│   │   │   ├── chatbot.component.html
│   │   │   └── chatbot.component.css
│   │   └── services/
│   │       └── chatbot.service.ts
│   └── package.json
└── setup-chatbot.sh
```

## Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Input Validation**: All user inputs are validated before processing
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **CORS Configuration**: Properly configure CORS for production deployment

## Performance Optimization

1. **Vector Store Caching**: FAISS vector store is cached for faster responses
2. **Memory Management**: Conversation memory is limited to prevent memory leaks
3. **Response Streaming**: Consider implementing streaming responses for better UX

## Future Enhancements

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] File upload for document queries
- [ ] Integration with university database
- [ ] Analytics and usage tracking
- [ ] Mobile app integration

## Support

For technical support or questions about the chatbot integration, please contact the development team or refer to the project documentation.

---

**Note**: This chatbot is designed specifically for Veridia University. To adapt it for other institutions, update the branding, knowledge base, and prompt templates accordingly.
