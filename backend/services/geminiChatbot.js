const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

function ensureClient() {
    if (!genAI) {
        const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing GOOGLE_API_KEY (or GEMINI_API_KEY)");
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    if (!model) {
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
}

async function generateResponse(userMessage, options = {}) {
    ensureClient();
    const systemPreamble =
        "You are the Thadomal University AI Assistant. Provide concise, helpful, and accurate answers about admissions, programs, fees, scholarships, and campus. If unsure, say you don't know. Prefer quoting from provided document context for dates, fees, or specific figures.";

    const context = options.context && options.context.trim().length > 0
        ? `\n\nDocument context (authoritative; quote directly for dates/amounts):\n${options.context}\n\n`
        : "\n";

    const prompt = `${systemPreamble}${context}User: ${userMessage}\nAssistant:`;

    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const text = result?.response?.text?.() || "Sorry, I couldn't generate a response.";
    return text.trim();
}

function getStatus() {
    return {
        initialized: !!model,
        hasApiKey: !!(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY),
        mode: "Gemini 2.5 Flash",
    };
}

module.exports = { generateResponse, getStatus };


