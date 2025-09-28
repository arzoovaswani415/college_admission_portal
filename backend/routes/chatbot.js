const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Initialize knowledge base on startup
chatbotController.initializeKnowledgeBase().catch(console.error);

// Chatbot routes
router.post('/send', chatbotController.sendMessage);
router.get('/history/:sessionId', chatbotController.getChatHistory);
router.delete('/history/:sessionId', chatbotController.clearChatHistory);
router.get('/health', chatbotController.healthCheck);
router.post('/reset-knowledge', chatbotController.resetKnowledgeBase);
router.get('/test-knowledge', chatbotController.testKnowledgeBase);

module.exports = router;
