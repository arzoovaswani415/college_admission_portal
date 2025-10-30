const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Chatbot routes
router.post('/send', chatbotController.sendMessage);
router.get('/health', chatbotController.healthCheck);
router.get('/capabilities', chatbotController.getCapabilities);

module.exports = router;

