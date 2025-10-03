const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Initialize chatbot
router.post('/initialize', chatbotController.initializeChatbot.bind(chatbotController));

// Chat endpoint
router.post('/chat', chatbotController.handleChat.bind(chatbotController));

// Get chatbot status
router.get('/status', chatbotController.getStatus.bind(chatbotController));

// Stop chatbot service
router.post('/stop', chatbotController.stopService.bind(chatbotController));

module.exports = router;
