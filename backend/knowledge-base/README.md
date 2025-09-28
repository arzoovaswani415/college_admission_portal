# Knowledge Base for RAG Chatbot

This directory contains the knowledge base files used by the RAG (Retrieval-Augmented Generation) chatbot system.

## File Structure

```
knowledge-base/
├── README.md                 # This file
├── COLLEGE_INFORMATION.pdf   # Main college information document
├── documents/                # Additional documents
│   ├── admission-requirements.pdf
│   ├── programs.pdf
│   ├── scholarships.pdf
│   └── policies.pdf
└── processed/                # Processed text files (auto-generated)
    ├── college_info.txt
    └── extracted_content.json
```

## Adding New Documents

1. **Place PDF files** in the `documents/` directory
2. **Update the knowledge base** by running the document processor
3. **Restart the backend** to load new content

## Document Processing

The chatbot controller automatically processes PDF documents and extracts relevant information for RAG queries. The system searches through:

- Document titles and metadata
- Extracted text content
- Categorized sections (admissions, programs, scholarships, etc.)

## Usage in Chatbot

When users ask questions, the chatbot:

1. Searches the knowledge base for relevant content
2. Retrieves matching documents/sections
3. Uses the context with Gemini AI to generate accurate responses
4. Provides source information when available

## File Formats Supported

- PDF documents (primary)
- Text files (.txt)
- JSON structured data
- Markdown files (.md)

## Security

- Documents are read-only once processed
- No user uploads allowed in this directory
- Content is validated before processing
