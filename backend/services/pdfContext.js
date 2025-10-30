const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

let cachedContext = null;
let lastLoadedAt = null;

function getPdfDirectory() {
    return path.join(__dirname, '../knowledge-base/documents');
}

function listPdfFiles() {
    const dir = getPdfDirectory();
    try {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir)
            .filter(f => f.toLowerCase().endsWith('.pdf'))
            .map(f => path.join(dir, f));
    } catch (e) {
        console.warn('⚠️ Unable to read knowledge base directory:', e.message);
        return [];
    }
}

async function loadPdfText(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await pdfParse(dataBuffer);
        return (result.text || '').trim();
    } catch (e) {
        console.warn(`⚠️ Failed to parse PDF: ${filePath}`, e.message);
        return '';
    }
}

async function buildAggregatedContext() {
    const files = listPdfFiles();
    if (files.length === 0) return '';

    const pieces = [];
    for (const f of files) {
        const text = await loadPdfText(f);
        if (text) {
            pieces.push(`=== Document: ${path.basename(f)} ===\n${text}`);
        }
    }

    const combined = pieces.join('\n\n');
    // Keep prompt length in check (simple truncation safeguard)
    const MAX_CHARS = 200000; // ~200k chars
    return combined.length > MAX_CHARS ? combined.slice(0, MAX_CHARS) : combined;
}

async function getAggregatedPdfContext({ forceReload = false } = {}) {
    if (!forceReload && cachedContext) return cachedContext;
    cachedContext = await buildAggregatedContext();
    lastLoadedAt = new Date();
    return cachedContext;
}

function getPdfContextStatus() {
    const files = listPdfFiles();
    return {
        pdfDirectory: getPdfDirectory(),
        pdfCount: files.length,
        lastLoadedAt,
        hasContext: !!cachedContext && cachedContext.length > 0
    };
}

module.exports = { getAggregatedPdfContext, getPdfContextStatus };


