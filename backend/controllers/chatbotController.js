const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatMessage = require('../models/ChatMessage');
const KnowledgeBase = require('../models/KnowledgeBase');
const DocumentProcessor = require('../utils/documentProcessor');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class ChatbotController {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.documentProcessor = new DocumentProcessor();
        this.systemPrompt = `You are Verdia University's AI assistant. You help students with information about admissions, programs, scholarships, and campus life.

Use the provided context from our knowledge base to answer questions accurately. Be helpful, friendly, and provide specific information when available.

If you don't know something specific, suggest they contact admissions@verdia.edu for more details.`;

        // Bind methods to preserve 'this' context
        this.sendMessage = this.sendMessage.bind(this);
        this.getChatHistory = this.getChatHistory.bind(this);
        this.clearChatHistory = this.clearChatHistory.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
        this.searchKnowledgeBase = this.searchKnowledgeBase.bind(this);
        this.resetKnowledgeBase = this.resetKnowledgeBase.bind(this);
        this.testKnowledgeBase = this.testKnowledgeBase.bind(this);
    }

    // Initialize knowledge base with document data
    async initializeKnowledgeBase() {
        try {
            const existingCount = await KnowledgeBase.countDocuments();
            console.log('Current knowledge base documents:', existingCount);

            // Always ensure we have comprehensive data
            if (existingCount < 20) { // If we don't have enough comprehensive data
                console.log('Loading comprehensive knowledge base data...');
                await this.initializeSampleData();
                return;
            }

            if (existingCount > 0) {
                console.log('Knowledge base already initialized with', existingCount, 'documents');
                return;
            }

            // Load processed documents
            const documents = this.documentProcessor.loadKnowledgeBase();

            // Convert documents to knowledge base format
            const knowledgeBaseData = [];

            documents.forEach(doc => {
                // Split large documents into smaller chunks
                const chunks = this.splitDocumentIntoChunks(doc.content, 500);

                chunks.forEach((chunk, index) => {
                    knowledgeBaseData.push({
                        title: `${doc.title} - Part ${index + 1}`,
                        content: chunk,
                        category: doc.category,
                        tags: doc.tags,
                        isActive: true
                    });
                });
            });

            if (knowledgeBaseData.length > 0) {
                await KnowledgeBase.insertMany(knowledgeBaseData);
                console.log(`Knowledge base initialized with ${knowledgeBaseData.length} document chunks`);
            } else {
                // Fallback to sample data if no documents found
                await this.initializeSampleData();
            }
        } catch (error) {
            console.error('Error initializing knowledge base:', error);
            // Fallback to sample data
            await this.initializeSampleData();
        }
    }

    async initializeSampleData() {
        const sampleData = [
            // ADMISSION INFORMATION
            {
                title: "Admission Requirements",
                content: "Verdia University requires a high school diploma or equivalent, minimum GPA of 2.5 (3.0 for competitive programs), completed application form, official transcripts, SAT/ACT scores (optional but recommended), personal statement (500-750 words), two letters of recommendation, and application fee of $50.",
                category: "admission",
                tags: ["requirements", "gpa", "transcripts", "sat", "act", "application", "personal statement", "recommendations"],
                isActive: true
            },
            {
                title: "Application Deadlines",
                content: "Fall Semester: Early Action (March 1st), Regular Decision (May 1st), Late Applications (June 1st). Spring Semester: Early Action (October 1st), Regular Decision (December 1st), Late Applications (January 1st). Summer Semester: Applications due March 1st.",
                category: "deadlines",
                tags: ["fall", "spring", "summer", "early action", "regular decision", "deadlines"],
                isActive: true
            },
            {
                title: "Application Process",
                content: "Complete online application, submit official transcripts, provide SAT/ACT scores (optional), write personal statement, obtain two letters of recommendation, pay $50 application fee, and submit all materials by the deadline.",
                category: "admission",
                tags: ["application", "process", "steps", "materials", "fee"],
                isActive: true
            },

            // ACADEMIC PROGRAMS (Real Frontend Data)
            {
                title: "Bachelor of Science in Computer Science",
                content: "4-year program providing students with a solid foundation in computer science theory and practice. Students learn programming languages, algorithms, data structures, software engineering, and cutting-edge technologies like artificial intelligence, machine learning, and cybersecurity. Duration: 4 Years. Seats: 200. Tuition: $35,000. Eligibility: High school diploma or equivalent, minimum GPA of 3.0, SAT score of 1200+ or ACT score of 26+, strong background in mathematics, English proficiency (TOEFL 80+ or IELTS 6.0+). Career outcomes: Software Developer, Data Scientist, Cybersecurity Analyst, Systems Architect, AI/ML Engineer, DevOps Engineer, Mobile App Developer, Tech Entrepreneur. Application deadline: February 1, 2025.",
                category: "programs",
                tags: ["computer science", "bachelor", "programming", "algorithms", "ai", "ml", "cybersecurity", "software engineering"],
                isActive: true
            },
            {
                title: "Master of Business Administration (MBA)",
                content: "2-year program designed to develop future business leaders with comprehensive understanding of modern business practices, strategic thinking, and leadership skills. Combines theoretical knowledge with practical applications through case studies, internships, and real-world projects. Duration: 2 Years. Seats: 150. Tuition: $45,000. Eligibility: Bachelor's degree from accredited institution, minimum GPA of 3.0, GMAT score of 600+ or GRE equivalent, 2+ years professional work experience, English proficiency (TOEFL 90+ or IELTS 6.5+). Career outcomes: Business Consultant, Operations Manager, Marketing Director, Financial Analyst, Entrepreneur/Startup Founder, Project Manager, Business Development Manager, Corporate Executive. Application deadline: March 15, 2025.",
                category: "programs",
                tags: ["mba", "master", "business", "leadership", "management", "strategy", "gmat", "work experience"],
                isActive: true
            },
            {
                title: "Bachelor of Engineering",
                content: "4-year comprehensive Engineering program offering specializations in Civil, Mechanical, Electrical, and Computer Engineering. Students gain hands-on experience through laboratory work, design projects, and industry internships, preparing them for successful engineering careers. Duration: 4 Years. Seats: 300. Tuition: $38,000. Eligibility: High school diploma with strong science and math background, minimum GPA of 3.2, SAT score of 1250+ or ACT score of 27+, Physics and Chemistry coursework, English proficiency (TOEFL 85+ or IELTS 6.5+). Career outcomes: Civil Engineer, Mechanical Engineer, Electrical Engineer, Software Engineer, Project Manager, Research Engineer, Consulting Engineer, Engineering Manager. Application deadline: January 15, 2025.",
                category: "programs",
                tags: ["engineering", "bachelor", "civil", "mechanical", "electrical", "computer", "laboratory", "design projects"],
                isActive: true
            },
            {
                title: "Program Features",
                content: "All programs feature small class sizes (average 25 students), experienced faculty, modern facilities, hands-on learning, industry partnerships, internship opportunities, and career placement services.",
                category: "programs",
                tags: ["class size", "faculty", "facilities", "internships", "career services"],
                isActive: true
            },

            // SCHOLARSHIPS AND FINANCIAL AID (Real Frontend Data)
            {
                title: "Presidential Excellence Scholarship",
                content: "Our most prestigious merit-based scholarship awarded to exceptional students who demonstrate outstanding academic achievement, leadership potential, and community involvement. Amount: Full tuition + $5,000 annual stipend. Eligibility: Top 5% of graduating class, SAT score of 1500+ or ACT score of 34+, demonstrated leadership experience, community service involvement, strong letters of recommendation. Application deadline: December 1, 2024. Renewable: Yes.",
                category: "scholarships",
                tags: ["presidential", "excellence", "merit-based", "full tuition", "leadership", "community service", "renewable"],
                isActive: true
            },
            {
                title: "Verdia Access Grant",
                content: "Need-based financial assistance designed to make quality education accessible to students from diverse economic backgrounds. Amount: Up to $15,000 annually. Eligibility: Demonstrated financial need, family income below $60,000 annually, academic potential (GPA 2.5+), U.S. citizen or eligible non-citizen, completed FAFSA application. Application deadline: March 1, 2025. Renewable: Yes.",
                category: "scholarships",
                tags: ["access grant", "need-based", "financial need", "fafsa", "low income", "renewable"],
                isActive: true
            },
            {
                title: "Verdia Athletic Scholarship",
                content: "Athletic scholarships for student-athletes who excel in their sport while maintaining academic standards. Amount: Partial to full tuition. Eligibility: Exceptional athletic ability, academic eligibility (GPA 2.5+), NCAA/NAIA eligibility, coach recommendation, athletic achievements. Application deadline: Varies by sport. Renewable: Yes.",
                category: "scholarships",
                tags: ["athletic", "sports", "ncaa", "naia", "coach recommendation", "renewable"],
                isActive: true
            },
            {
                title: "Global Diversity Scholarship",
                content: "Scholarships specifically designed for international students to promote cultural diversity on campus. Amount: Up to $20,000 annually. Eligibility: International student status, strong academic record, English proficiency, cultural diversity contribution, financial need consideration. Application deadline: February 15, 2025. Renewable: Yes.",
                category: "scholarships",
                tags: ["global diversity", "international", "cultural diversity", "english proficiency", "renewable"],
                isActive: true
            },

            // TUITION AND COSTS
            {
                title: "Tuition and Fees 2024-2025",
                content: "In-state tuition: $12,000/year. Out-of-state tuition: $24,000/year. Room and board: $8,000/year. Books and supplies: $1,500/year. Technology fee: $500/year. Total estimated cost: $22,000-$34,000/year depending on residency.",
                category: "tuition",
                tags: ["tuition", "fees", "room", "board", "books", "cost", "in-state", "out-of-state"],
                isActive: true
            },

            // CAMPUS LIFE
            {
                title: "Campus Overview",
                content: "200-acre main campus with 15,000 undergraduate and 5,000 graduate students. Student-to-faculty ratio: 18:1. 200+ student organizations. NCAA Division II athletics. On-campus housing for 6,000 students. Safe, residential neighborhood 15 minutes from downtown.",
                category: "campus",
                tags: ["campus", "students", "faculty", "organizations", "athletics", "housing", "location"],
                isActive: true
            },
            {
                title: "Campus Facilities",
                content: "Modern library with 500,000+ volumes, state-of-the-art laboratories, recreation center with fitness facilities, student union with dining options, technology-enabled classrooms, and research centers and institutes.",
                category: "campus",
                tags: ["library", "laboratories", "recreation", "dining", "classrooms", "research"],
                isActive: true
            },
            {
                title: "Student Life",
                content: "200+ student organizations including academic clubs, cultural groups, sports teams, and special interest organizations. Active student government, Greek life, and community service opportunities.",
                category: "campus",
                tags: ["organizations", "clubs", "sports", "government", "greek", "community service"],
                isActive: true
            },

            // UNIVERSITY INFORMATION
            {
                title: "University Mission",
                content: "To educate the leaders of tomorrow and to nurture a spirit of inquiry, creativity, and lifelong learning. Founded on principles of innovation and excellence, committed to fostering a diverse and inclusive environment.",
                category: "university",
                tags: ["mission", "leaders", "learning", "innovation", "excellence", "diversity", "inclusion"],
                isActive: true
            },
            {
                title: "University Vision",
                content: "To be a world-class institution recognized for its academic excellence, research, and contribution to society. Values: Integrity, Diversity, Collaboration, and Innovation.",
                category: "university",
                tags: ["vision", "world-class", "excellence", "research", "society", "values", "integrity"],
                isActive: true
            },
            {
                title: "Alumni Success",
                content: "Notable alumni include Dr. Evelyn Reed (Lead Researcher, BioTech Innovations), Marcus Chen (Founder & CEO, TechStart Solutions), and Priya Sharma (Award-Winning Journalist). Alumni are making significant impacts in their fields.",
                category: "university",
                tags: ["alumni", "success", "careers", "achievements", "notable"],
                isActive: true
            },

            // CONTACT INFORMATION
            {
                title: "Contact Information",
                content: "Admissions Office: (555) 123-4567. Email: admissions@verdia.edu. Website: www.verdia.edu. Office hours: Monday-Friday, 8:00 AM - 5:00 PM. Campus tours: Available Monday-Saturday. Location: Campus City, State.",
                category: "contact",
                tags: ["contact", "phone", "email", "website", "hours", "tours", "location"],
                isActive: true
            },

            // GENERAL INFORMATION
            {
                title: "Why Choose Verdia University",
                content: "Small class sizes, experienced faculty, modern facilities, hands-on learning, industry partnerships, internship opportunities, career placement services, diverse student body, and strong alumni network.",
                category: "general",
                tags: ["why choose", "benefits", "advantages", "features", "network"],
                isActive: true
            }
        ];

        await KnowledgeBase.insertMany(sampleData);
        console.log('Knowledge base initialized with comprehensive website data');
    }

    // Reset knowledge base (for development/testing)
    async resetKnowledgeBase(req, res) {
        try {
            await KnowledgeBase.deleteMany({});
            console.log('Knowledge base cleared');
            await this.initializeSampleData();
            console.log('Knowledge base re-initialized with fresh data');

            res.json({
                success: true,
                message: 'Knowledge base reset successfully'
            });
        } catch (error) {
            console.error('Error resetting knowledge base:', error);
            res.status(500).json({
                success: false,
                message: 'Error resetting knowledge base',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    // Test knowledge base
    async testKnowledgeBase(req, res) {
        try {
            const totalDocs = await KnowledgeBase.countDocuments();
            const sampleDocs = await KnowledgeBase.find({}).limit(5);
            const scholarshipDocs = await KnowledgeBase.find({ category: 'scholarships' });

            res.json({
                success: true,
                totalDocuments: totalDocs,
                sampleDocuments: sampleDocs.map(doc => ({
                    title: doc.title,
                    category: doc.category,
                    tags: doc.tags
                })),
                scholarshipCount: scholarshipDocs.length,
                scholarshipTitles: scholarshipDocs.map(doc => doc.title)
            });
        } catch (error) {
            console.error('Error testing knowledge base:', error);
            res.status(500).json({
                success: false,
                message: 'Error testing knowledge base',
                error: error.message
            });
        }
    }

    splitDocumentIntoChunks(text, maxLength) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const chunks = [];
        let currentChunk = '';

        sentences.forEach(sentence => {
            if (currentChunk.length + sentence.length <= maxLength) {
                currentChunk += sentence.trim() + '. ';
            } else {
                if (currentChunk.trim()) {
                    chunks.push(currentChunk.trim());
                }
                currentChunk = sentence.trim() + '. ';
            }
        });

        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    generateFallbackResponse(message, context) {
        const lowerMessage = message.toLowerCase();

        // Enhanced keyword-based responses when Gemini is not available
        if (lowerMessage.includes('admission') || lowerMessage.includes('apply')) {
            return context.length > 0
                ? `Based on our records: ${context[0].content.substring(0, 200)}... Please contact admissions@verdia.edu for detailed information.`
                : 'For admission requirements, you need a high school diploma, minimum 2.5 GPA, completed application, personal statement, and two letters of recommendation. Contact admissions@verdia.edu for details.';
        }

        if (lowerMessage.includes('deadline') || lowerMessage.includes('when')) {
            return 'Application deadlines: Fall semester (Early Action: March 1st, Regular: May 1st), Spring semester (Early Action: October 1st, Regular: December 1st), Summer semester (March 1st).';
        }

        if (lowerMessage.includes('program') || lowerMessage.includes('course') || lowerMessage.includes('major')) {
            return context.length > 0
                ? `We offer: ${context[0].content.substring(0, 150)}... Visit our programs page for more details.`
                : 'We offer Computer Science (Software Engineering, Data Science, Cybersecurity, AI/ML), Business Administration (Finance, Marketing, Management, International Business), and Engineering (Civil, Mechanical, Electrical) programs.';
        }

        if (lowerMessage.includes('scholarship') || lowerMessage.includes('financial') || lowerMessage.includes('aid')) {
            return 'We offer Presidential Scholarship (full tuition), Dean\'s Scholarship ($10,000/year), Achievement Scholarship ($5,000/year), athletic scholarships, and need-based financial aid. Complete FAFSA by March 1st for priority consideration.';
        }

        if (lowerMessage.includes('tuition') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
            return 'Tuition: $12,000/year (in-state), $24,000/year (out-of-state). Room and board: $8,000/year. Books and supplies: $1,500/year. Technology fee: $500/year.';
        }

        if (lowerMessage.includes('campus') || lowerMessage.includes('facilities') || lowerMessage.includes('life')) {
            return 'Our 200-acre campus features modern library, state-of-the-art laboratories, recreation center, student union, and 200+ student organizations. Student-to-faculty ratio: 18:1.';
        }

        if (lowerMessage.includes('university') || lowerMessage.includes('mission') || lowerMessage.includes('vision')) {
            return 'Verdia University\'s mission is to educate the leaders of tomorrow through innovation and excellence. We foster a diverse, inclusive environment with values of integrity, diversity, collaboration, and innovation.';
        }

        if (lowerMessage.includes('alumni') || lowerMessage.includes('graduates') || lowerMessage.includes('success')) {
            return 'Our notable alumni include Dr. Evelyn Reed (BioTech Researcher), Marcus Chen (TechStart CEO), and Priya Sharma (Award-Winning Journalist). Alumni are making significant impacts in their fields.';
        }

        if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
            return 'Contact us: Admissions Office (555) 123-4567, admissions@verdia.edu, www.verdia.edu. Office hours: Monday-Friday, 8:00 AM - 5:00 PM. Campus tours available Monday-Saturday.';
        }

        if (lowerMessage.includes('housing') || lowerMessage.includes('dorm') || lowerMessage.includes('residence')) {
            return 'On-campus housing available for 6,000 students. Safe, residential neighborhood 15 minutes from downtown. Various housing options including traditional dorms and apartment-style living.';
        }

        if (lowerMessage.includes('athletics') || lowerMessage.includes('sports') || lowerMessage.includes('team')) {
            return 'NCAA Division II athletics with scholarships available. Sports include basketball, soccer, track and field, swimming, and more. Contact athletic department for details.';
        }

        // Default response
        return 'Thank you for your question. I can help with admissions, programs, scholarships, campus life, and general university information. For specific details, contact admissions@verdia.edu or visit our website.';
    }

    // Generate contextual response based on knowledge base
    generateContextualResponse(message, context) {
        const lowerMessage = message ? message.toLowerCase() : '';

        // If we have specific context, use it to generate a detailed response
        if (context && context.length > 0) {
            const primaryContext = context[0];
            let response = `Based on our information about ${primaryContext.title ? primaryContext.title.toLowerCase() : 'this topic'}: `;

            // Add the most relevant content
            response += primaryContext.content || 'No additional information available.';

            // If there are multiple relevant contexts, mention them
            if (context.length > 1) {
                response += `\n\nAdditionally, we also have information about ${context.slice(1).map(ctx => ctx.title || 'other topics').join(', ')}. `;
            }

            // Add contact information for more details
            response += `\n\nFor more specific information or to discuss your individual situation, please contact admissions@verdia.edu or call (555) 123-4567.`;

            return response;
        }

        // Fallback to regular response
        return this.generateFallbackResponse(message, context);
    }


    // Enhanced text similarity search (improved RAG implementation)
    async searchKnowledgeBase(query) {
        try {
            const searchTerms = query ? query.toLowerCase().split(' ').filter(term => term.length > 2) : [];
            console.log('Searching for:', searchTerms);

            // Search by tags, title, and content with better scoring
            const results = await KnowledgeBase.find({
                isActive: true,
                $or: [
                    { tags: { $in: searchTerms } },
                    { title: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            }).limit(5);

            // Sort results by relevance (more matches = higher score)
            const scoredResults = results.map(doc => {
                let score = 0;
                const titleLower = doc.title ? doc.title.toLowerCase() : '';
                const contentLower = doc.content ? doc.content.toLowerCase() : '';
                const categoryLower = doc.category ? doc.category.toLowerCase() : '';

                // Score based on title matches
                searchTerms.forEach(term => {
                    if (titleLower.includes(term)) score += 3;
                    if (contentLower.includes(term)) score += 2;
                    if (doc.tags && doc.tags.includes(term)) score += 2;
                    if (categoryLower.includes(term)) score += 1;
                });

                return { ...doc, score };
            }).sort((a, b) => b.score - a.score);

            console.log('Found', scoredResults.length, 'relevant documents');
            return scoredResults.slice(0, 3).map(doc => ({
                title: doc.title,
                content: doc.content,
                category: doc.category,
                score: doc.score
            }));
        } catch (error) {
            console.error('Error searching knowledge base:', error);
            return [];
        }
    }


    // Send message to chatbot
    async sendMessage(req, res) {
        try {
            const { message, sessionId, userId } = req.body;
            console.log('Received message:', message);

            if (!message || !sessionId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Message, sessionId, and userId are required'
                });
            }

            // Search knowledge base for relevant context (RAG)
            const relevantContext = await this.searchKnowledgeBase(message);
            console.log('Relevant context found:', relevantContext.length, 'documents');

            // Build context string from knowledge base
            let contextString = '';
            if (relevantContext.length > 0) {
                contextString = '\n\nRelevant Information from Knowledge Base:\n';
                relevantContext.forEach(ctx => {
                    contextString += `- ${ctx.title}: ${ctx.content}\n`;
                });
            }

            // Generate response using Gemini API with RAG context
            let response;
            const fullPrompt = `${this.systemPrompt}${contextString}\n\nUser Question: ${message}`;

            try {
                console.log('Calling Gemini API with RAG context...');
                const result = await this.model.generateContent(fullPrompt);
                response = result.response.text();
                console.log('✅ Gemini response generated with RAG');
            } catch (geminiError) {
                console.error('Gemini API error:', geminiError.message);
                // Fallback to basic response
                response = this.generateFallbackResponse(message, relevantContext);
                console.log('Using fallback response');
            }

            // Ensure response is never empty
            if (!response || response.trim() === '') {
                response = 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact admissions@verdia.edu for assistance.';
            }

            // Save chat message
            const chatMessage = new ChatMessage({
                sessionId,
                userId,
                message,
                response,
                messageType: 'user',
                context: { relevantContext }
            });

            await chatMessage.save();

            // Save assistant response
            const assistantMessage = new ChatMessage({
                sessionId,
                userId,
                message: 'Assistant Response',
                response: response,
                messageType: 'assistant',
                context: { relevantContext }
            });

            await assistantMessage.save();

            res.json({
                success: true,
                response,
                context: relevantContext
            });

        } catch (error) {
            console.error('Error in sendMessage:', error);
            res.status(500).json({
                success: false,
                message: 'Error processing message',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    // Get chat history
    async getChatHistory(req, res) {
        try {
            const { sessionId } = req.params;
            const { limit = 50 } = req.query;

            const messages = await ChatMessage.find({ sessionId })
                .sort({ timestamp: 1 })
                .limit(parseInt(limit));

            res.json({
                success: true,
                messages
            });
        } catch (error) {
            console.error('Error getting chat history:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving chat history',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    // Clear chat history
    async clearChatHistory(req, res) {
        try {
            const { sessionId } = req.params;

            await ChatMessage.deleteMany({ sessionId });

            res.json({
                success: true,
                message: 'Chat history cleared successfully'
            });
        } catch (error) {
            console.error('Error clearing chat history:', error);
            res.status(500).json({
                success: false,
                message: 'Error clearing chat history',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    // Health check
    async healthCheck(req, res) {
        try {
            // Test knowledge base
            const totalDocs = await KnowledgeBase.countDocuments();

            res.json({
                success: true,
                message: 'Chatbot service is running',
                knowledgeBaseStatus: 'connected',
                documentsAvailable: totalDocs,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Chatbot health check failed:', error);
            res.status(500).json({
                success: false,
                message: 'Chatbot service error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable'
            });
        }
    }
}

module.exports = new ChatbotController();
