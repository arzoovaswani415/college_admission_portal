const ChatbotService = require('../services/chatbotService');

const chatbotService = new ChatbotService();

class ChatbotController {
  async initializeChatbot(req, res) {
    try {
      // Check if Google API key is available
      if (!process.env.GOOGLE_API_KEY) {
        return res.status(500).json({
          success: false,
          message: 'Google API key not configured'
        });
      }

      res.json({
        success: true,
        message: 'Chatbot initialized successfully'
      });

    } catch (error) {
      console.error('Error initializing chatbot:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize chatbot',
        error: error.message
      });
    }
  }

  async handleChat(req, res) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      if (!process.env.GOOGLE_API_KEY) {
        return res.status(500).json({
          success: false,
          message: 'Google API key not configured'
        });
      }

      const response = await chatbotService.generateResponse(message);

      res.json({
        success: true,
        data: {
          response: response,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error handling chat:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process chat message',
        error: error.message
      });
    }
  }

  async getStatus(req, res) {
    try {
      const status = chatbotService.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get chatbot status',
        error: error.message
      });
    }
  }

  async stopService(req, res) {
    try {
      chatbotService.clearHistory();
      res.json({
        success: true,
        message: 'Chatbot service stopped'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to stop chatbot service',
        error: error.message
      });
    }
  }
}

module.exports = new ChatbotController();