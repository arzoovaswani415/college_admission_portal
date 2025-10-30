const { generateResponse, getStatus } = require('../services/geminiChatbot');
const { getAggregatedPdfContext } = require('../services/pdfContext');

// Main chatbot endpoint
async function sendMessage(req, res) {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({
            error: 'Message required.',
            response: 'Please ask me something about TSEC admissions!'
        });
    }

    try {
        console.log(`📝 Received message: ${message}`);
        const pdfContext = await getAggregatedPdfContext();
        const responseText = await generateResponse(message.trim(), { context: pdfContext });
        res.json({
            response: responseText,
            success: true,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Chatbot error:', error);
        res.json({
            response: 'I\'m having trouble right now. Please try again shortly.',
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
        });
    }
}

// Health check with detailed status
function healthCheck(req, res) {
    const status = getStatus();
    res.json({
        status: 'ok',
        chatbot: status,
        timestamp: new Date().toISOString()
    });
}

// Get chatbot capabilities
function getCapabilities(req, res) {
    res.json({
        capabilities: [
            'TSEC Admission Information',
            'Course Details and Eligibility',
            'Fee Structure and Scholarships',
            'Placement Statistics',
            'Campus Life Information'
        ],
        features: [
            'Gemini 2.5 Flash responses (no RAG)',
            'Professional admission assistance'
        ],
        supportedTopics: [
            'Engineering programs',
            'Admission requirements',
            'Application deadlines',
            'Fee structure',
            'Scholarship opportunities',
            'Placement records',
            'Campus facilities'
        ]
    });
}

module.exports = { sendMessage, healthCheck, getCapabilities };

