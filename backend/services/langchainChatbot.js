const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Note: You'll need to install these Python packages and call via child_process
// or use a Python microservice. For now, this is the Node.js structure.

let isInitialized = false;
let vectorStore = null;
let llm = null;
let memory = null;

async function initializeBot() {
    console.log('🚀 Initializing LangChain TSEC Chatbot...');

    try {
        // Check if PDF exists
        const pdfPath = path.join(__dirname, '../assets/COLLEGE-INFORMATION.pdf');
        if (!fs.existsSync(pdfPath)) {
            console.warn('⚠️ PDF not found, using fallback content');
            isInitialized = true;
            return;
        }

        // For now, we'll use a Python subprocess to handle LangChain
        // This is a placeholder - you'll need to implement the Python integration
        console.log('✅ LangChain chatbot initialized (Python integration needed)');
        isInitialized = true;
    } catch (error) {
        console.error('❌ Error initializing LangChain chatbot:', error.message);
        isInitialized = true;
    }
}

async function getChatbotResponse(message) {
    if (!isInitialized) {
        return 'Chatbot is initializing. Please try again shortly.';
    }

    try {
        // This will call the Python chatbot service
        const { spawn } = require('child_process');
        const pythonProcess = spawn('python', [
            path.join(__dirname, '../python_chatbot/simple_chat.py'),
            message
        ]);

        let response = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            response += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        return new Promise((resolve) => {
            pythonProcess.on('close', (code) => {
                if (code === 0 && response) {
                    resolve(response.trim());
                } else {
                    console.error('Python chatbot error:', error);
                    resolve('I apologize, but I encountered an error processing your request. Please try again.');
                }
            });
        });
    } catch (error) {
        console.error('❌ Chatbot error:', error.message);
        return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
}

function getInitializationStatus() {
    return {
        initialized: isInitialized,
        hasApiKey: !!process.env.GEMINI_API_KEY,
        hasVectorStore: !!vectorStore,
        hasLLM: !!llm,
        mode: 'LangChain + Gemini'
    };
}

module.exports = { initializeBot, getChatbotResponse, getInitializationStatus };
