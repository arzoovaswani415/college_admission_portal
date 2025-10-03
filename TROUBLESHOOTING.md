# Chatbot Troubleshooting Guide

## Common Issues and Solutions

### 1. Textarea Not Focusable/Clickable

**Problem**: Cannot click or type in the chatbot textarea.

**Solutions**:
- ✅ **Fixed**: Added `@ViewChild` reference and focus methods
- ✅ **Fixed**: Added click handlers to input area
- ✅ **Fixed**: Improved CSS styling for better interaction
- ✅ **Fixed**: Added proper form validation

**What was changed**:
- Added `ViewChild` reference to textarea
- Added `focusTextarea()` method
- Added click handlers to both textarea and input container
- Improved CSS with better focus states and cursor styling

### 2. "Invalid" Error Messages

**Problem**: Seeing "invalid" or error messages in the chatbot.

**Possible Causes**:
1. **Backend not running**: Python service or Node.js server not started
2. **Missing API key**: Google API key not configured
3. **Service not initialized**: Chatbot service not properly initialized
4. **Network issues**: CORS or connection problems

**Solutions**:

#### Check Backend Status
```bash
# Check if Node.js server is running
curl http://localhost:3000/api/health

# Check if Python service is running
curl http://localhost:5000/health
```

#### Configure API Key
1. Get Google API key from [Google AI Studio](https://console.cloud.google.com/)
2. Create `backend/.env` file:
```env
GOOGLE_API_KEY=your_actual_api_key_here
MONGODB_URI=mongodb://localhost:27017/veridia_admissions
PORT=3000
NODE_ENV=development
```

#### Start Services Properly
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 3. Module Configuration Issues

**Problem**: Angular module errors or component not loading.

**Solution**: ✅ **Fixed** - Removed standalone component from module declarations

The `ChatbotComponent` is now properly configured as a standalone component and should not appear in the module's `declarations` or `imports` arrays.

### 4. Service Communication Issues

**Problem**: Frontend cannot communicate with backend.

**Solutions**:
- Check CORS configuration in `server.js`
- Verify API endpoints are properly configured
- Check network connectivity
- Review browser console for errors

### 5. Python Service Issues

**Problem**: Python Flask service not starting or responding.

**Solutions**:
- Install Python dependencies: `pip install -r requirements.txt`
- Check Python version (3.8+ required)
- Verify PDF file exists in `backend/assets/COLLEGE-INFORMATION.pdf`
- Check Google API key configuration

### 6. Database Issues

**Problem**: MongoDB connection errors.

**Solutions**:
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env` file
- Verify database permissions

## Testing the Integration

### Manual Testing Steps

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Test API Endpoints**:
   ```bash
   # Health check
   curl http://localhost:3000/api/health
   
   # Chatbot status
   curl http://localhost:3000/api/chatbot/status
   
   # Initialize chatbot
   curl -X POST http://localhost:3000/api/chatbot/initialize
   ```

4. **Test Frontend**:
   - Visit `http://localhost:4200/chatbot`
   - Check if textarea is clickable and focusable
   - Try typing a message
   - Test sending a message

### Automated Testing

Run the test script:
```bash
chmod +x test-chatbot.sh
./test-chatbot.sh
```

## Debugging Tips

### Browser Console
Check browser console for errors:
- Open Developer Tools (F12)
- Go to Console tab
- Look for any red error messages

### Network Tab
Check network requests:
- Open Developer Tools (F12)
- Go to Network tab
- Try sending a message
- Check if API calls are being made

### Backend Logs
Check backend console for errors:
- Look for Python service startup messages
- Check for API key validation errors
- Monitor request/response logs

## Performance Optimization

### For Better Performance:
1. **Caching**: Vector store is cached for faster responses
2. **Memory Management**: Conversation memory is limited
3. **Error Handling**: Proper error messages and fallbacks
4. **Loading States**: Visual feedback during processing

## Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Input Validation**: All inputs are validated
3. **CORS Configuration**: Properly configured for production
4. **Error Messages**: Don't expose sensitive information

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
GOOGLE_API_KEY=your_production_api_key
MONGODB_URI=your_production_mongodb_uri
PORT=3000
```

### Security Headers
Add security headers in production:
- HTTPS enforcement
- CORS restrictions
- Rate limiting
- Input sanitization

## Support

If you continue to experience issues:

1. Check this troubleshooting guide
2. Review the main README.md
3. Check browser console for errors
4. Verify all services are running
5. Test API endpoints manually

## Quick Fixes

### Most Common Solutions:
1. **Restart all services** (backend and frontend)
2. **Check API key configuration**
3. **Verify MongoDB is running**
4. **Clear browser cache**
5. **Check network connectivity**

---

**Note**: This chatbot is designed for Veridia University. To adapt for other institutions, update the branding, knowledge base, and prompt templates accordingly.
