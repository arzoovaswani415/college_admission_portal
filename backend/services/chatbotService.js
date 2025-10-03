const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

class ChatbotService {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.conversationHistory = [];
    this.knowledgeBase = null;
    this.initializeAsync();
  }

  async initializeAsync() {
    await this.initKnowledgeBase();
  }

  async initKnowledgeBase() {
    try {
      // Try to load PDF first (college.pdf), fallback to text file
      const pdfPath = path.join(__dirname, '..', 'assets', 'college.pdf');
      const txtPath = path.join(__dirname, '..', 'assets', 'COLLEGE-INFORMATION.txt');
      
      if (fs.existsSync(pdfPath)) {
        console.log('Loading PDF knowledge base: college.pdf');
        await this.loadPDFKnowledge(pdfPath);
      } else if (fs.existsSync(txtPath)) {
        console.log('Loading text knowledge base: COLLEGE-INFORMATION.txt');
        this.loadTextKnowledge(txtPath);
      } else {
        console.log('No knowledge base files found, using default responses');
        this.knowledgeBase = [];
      }
      
      console.log(`Loaded ${this.knowledgeBase ? this.knowledgeBase.length : 0} knowledge chunks`);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      this.knowledgeBase = [];
    }
  }

  async loadPDFKnowledge(pdfPath) {
    try {
      console.log('Loading PDF knowledge base:', pdfPath);
      const dataBuffer = fs.readFileSync(pdfPath);
      
      // Parse PDF using pdf-parse
      const data = await pdf(dataBuffer);
      const content = data.text;
      
      if (content && content.trim().length > 0) {
        // Split PDF content into chunks for better search
        this.knowledgeBase = this.chunkText(content, 1000);
        console.log(`Successfully loaded PDF with ${content.length} characters`);
        console.log(`Created ${this.knowledgeBase.length} knowledge chunks from PDF`);
      } else {
        console.log('PDF parsing returned no text content');
        this.knowledgeBase = [];
      }
    } catch (error) {
      console.error('Error reading/parsing PDF file:', error);
      this.knowledgeBase = [];
    }
  }

  loadTextKnowledge(txtPath) {
    try {
      const content = fs.readFileSync(txtPath, 'utf8');
      // Split content into chunks for better search
      this.knowledgeBase = this.chunkText(content, 1000);
      console.log(`Successfully loaded text file with ${content.length} characters`);
    } catch (error) {
      console.error('Error reading text file:', error);
      this.knowledgeBase = [];
    }
  }

  chunkText(text, chunkSize) {
    const chunks = [];
    const sentences = text.split(/[.!?]+/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize) {
        if (currentChunk.trim()) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '.';
      }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks;
  }

  async generateResponse(userMessage) {
    try {
      // Add user message to history
      this.conversationHistory.push({ role: 'user', content: userMessage });

      // Find relevant knowledge
      const relevantKnowledge = this.findRelevantKnowledge(userMessage);
      console.log('Relevant knowledge found:', relevantKnowledge.length, 'chunks');
      console.log('Knowledge base size:', this.knowledgeBase ? this.knowledgeBase.length : 0);

      // Generate response using local knowledge
      const response = this.generateLocalResponse(userMessage, relevantKnowledge);

      // Add assistant response to history
      this.conversationHistory.push({ role: 'assistant', content: response });

      return response;

    } catch (error) {
      console.error('Error generating response:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  generateLocalResponse(userMessage, relevantKnowledge) {
    const message = userMessage.toLowerCase();
    
    // First, try to provide a specific, focused answer based on the question type
    const specificResponse = this.generateSpecificResponse(userMessage, message, relevantKnowledge);
    if (specificResponse) {
      return specificResponse;
    }
    
    // If we have relevant knowledge from the text file, use it with better filtering
    if (relevantKnowledge && relevantKnowledge.length > 0 && !relevantKnowledge.includes('No university information available.')) {
      console.log('Using knowledge base for response');
      return this.createFocusedResponseFromKnowledge(userMessage, relevantKnowledge);
    }
    
    // Check for specific questions and provide direct answers
    if (message.includes('mba') && (message.includes('cost') || message.includes('fee') || message.includes('price'))) {
      return `### MBA Program Costs at Veridia University

**Master of Business Administration (MBA)**
- **Duration**: 2 years
- **Tuition Fee**: $20,000 per year
- **Total Program Cost**: $40,000

**Additional Information:**
- **Eligibility**: Bachelor's degree with minimum 60% marks and 2 years work experience
- **Placement Rate**: 96%
- **Average Starting Salary**: $90,000

Would you like more information about scholarships, payment plans, or other programs?`;
    }

    if (message.includes('computer science') && (message.includes('cost') || message.includes('fee') || message.includes('price'))) {
      return `### Computer Science Program Costs at Veridia University

**Bachelor of Science in Computer Science**
- **Duration**: 4 years
- **Eligibility**: High school diploma with minimum 60% marks in Mathematics and Science
- **Tuition Fee**: $15,000 per year
- **Total Program Cost**: $60,000
- **Placement Rate**: 95%
- **Average Starting Salary**: $65,000

**Additional Information:**
- Strong focus on software development and programming
- Modern computer labs and equipment
- Internship opportunities with top tech companies

Need more details about admission requirements or scholarships?`;
    }

    if (message.includes('deadline') || message.includes('application date')) {
      return `### Important Admission Dates at Veridia University

**Application Deadlines:**
- **Application Deadline**: March 15th, 2025
- **Early Decision Deadline**: December 1st, 2024
- **Decision Notification**: April 15th, 2025
- **Enrollment Deadline**: May 1st, 2025

**Academic Calendar:**
- **Orientation Week**: August 25-29, 2025
- **Classes Begin**: September 2nd, 2025

**Application Fee**: $75 (non-refundable)

I recommend applying early for the best chances of admission and scholarship consideration!`;
    }

    if (message.includes('requirement') || message.includes('eligibility')) {
      return `### Admission Requirements at Veridia University

**General Requirements:**
- Completed application form
- Official transcripts from all previous institutions
- Statement of purpose (500-1000 words)
- Two letters of recommendation
- English proficiency test scores (TOEFL/IELTS for international students)
- Application fee: $75

**Undergraduate Programs:**
- High school diploma with minimum marks ranging from 50-65% depending on program
- Mathematics and Science required for Computer Science and Engineering programs

**Graduate Programs:**
- Bachelor's degree with minimum 60-70% marks depending on program
- Some programs require work experience (like MBA)

Would you like specific requirements for any particular program?`;
    }

    // General response using relevant knowledge
    if (relevantKnowledge.length > 0) {
      const knowledge = relevantKnowledge.join('\n\n');
      return `### Information About Veridia University

Based on your question about "${userMessage}", here's what I found:

${knowledge}

Would you like more specific details about any aspect of our admission process or programs?
`;
    }

    return this.getFallbackResponse(userMessage);
  }

  generateSpecificResponse(userMessage, message, relevantKnowledge) {
    // Check for eligibility criteria questions
    if (message.includes('eligibility') || message.includes('criteria') || message.includes('requirement')) {
      return this.getEligibilityResponse(userMessage, relevantKnowledge);
    }
    
    // Check for fee/cost questions
    if (message.includes('cost') || message.includes('fee') || message.includes('price') || message.includes('tuition')) {
      return this.getCostResponse(userMessage, relevantKnowledge);
    }
    
    // Check for deadline questions
    if (message.includes('deadline') || message.includes('date') || message.includes('when')) {
      return this.getDeadlineResponse(userMessage, relevantKnowledge);
    }
    
    // Check for program questions
    if (message.includes('program') || message.includes('course') || message.includes('degree')) {
      return this.getProgramResponse(userMessage, relevantKnowledge);
    }
    
    // Check for scholarship questions
    if (message.includes('scholarship') || message.includes('financial aid') || message.includes('funding')) {
      return this.getScholarshipResponse(userMessage, relevantKnowledge);
    }
    
    return null; // No specific response found
  }

  getEligibilityResponse(userMessage, relevantKnowledge) {
    const eligibilityInfo = this.extractEligibilityInfo(relevantKnowledge);
    
    if (eligibilityInfo.length > 0) {
      // Clean up and format the eligibility information
      const cleanedInfo = this.cleanEligibilityInfo(eligibilityInfo);
      return `### Eligibility Criteria

${cleanedInfo}

Need more specific details about any program's requirements?`;
    }
    
    return `### Eligibility Criteria

**General Requirements:**
- Completed application form
- Official transcripts from all previous institutions
- Statement of purpose (500-1000 words)
- Two letters of recommendation
- English proficiency test scores (TOEFL/IELTS for international students)
- Application fee: $75

**Undergraduate Programs:**
- High school diploma with minimum marks ranging from 50-65% depending on program
- Mathematics and Science required for Computer Science and Engineering programs

**Graduate Programs:**
- Bachelor's degree with minimum 60-70% marks depending on program
- Some programs require work experience (like MBA)

Would you like specific requirements for any particular program?`;
  }

  cleanEligibilityInfo(eligibilityInfo) {
    // Clean up the extracted eligibility information
    const cleaned = eligibilityInfo.map(info => {
      // Remove redundant text and format better
      let cleaned = info
        .replace(/Eligibility:\s*/g, '')
        .replace(/Common Requirements:\s*/g, '**Common Requirements:**\n')
        .replace(/Minimum Marks/g, '**Minimum Marks:**')
        .replace(/Documentation Requirements/g, '**Documentation Requirements:**')
        .replace(/NRI Quota:/g, '**NRI Quota:**')
        .replace(/Scholarship-Specific Eligibility/g, '**Scholarship-Specific Eligibility:**')
        .replace(/InitiativeFrequencyEligibility/g, '**Initiative Frequency Eligibility:**')
        .replace(/(\d+%)\s*aggregate/g, '$1 aggregate')
        .replace(/(\d+%)\s*for\s*SC\/ST/g, '$1 for SC/ST');
      
      // Format as bullet points where appropriate
      if (cleaned.includes('10th & 12th Marksheets')) {
        cleaned = cleaned.replace(/10th & 12th Marksheets/g, '- 10th & 12th Marksheets');
      }
      if (cleaned.includes('12th PCM Marks')) {
        cleaned = cleaned.replace(/12th PCM Marks \(Minimum 75%\)/g, '- 12th PCM Marks (Minimum 75%)');
      }
      if (cleaned.includes('Valid GRE score')) {
        cleaned = cleaned.replace(/Valid GRE score \(300\+ minimum\)/g, '- Valid GRE score (300+ minimum)');
      }
      
      return cleaned;
    });
    
    return cleaned.join('\n\n');
  }

  getCostResponse(userMessage, relevantKnowledge) {
    const costInfo = this.extractCostInfo(relevantKnowledge);
    
    if (costInfo.length > 0) {
      return `### Program Costs

${costInfo.join('\n\n')}

Need information about payment plans or scholarships?`;
    }
    
    return `### Program Costs

**Undergraduate Programs:**
- Computer Science: $15,000/year
- Business Administration: $12,000/year
- Mechanical Engineering: $16,000/year
- Psychology: $10,000/year

**Graduate Programs:**
- Data Science: $18,000/year
- MBA: $20,000/year

Need specific details about any program's costs?`;
  }

  getDeadlineResponse(userMessage, relevantKnowledge) {
    return `### Important Dates

**Application Deadlines:**
- Application Deadline: March 15th, 2025
- Early Decision Deadline: December 1st, 2024
- Decision Notification: April 15th, 2025
- Enrollment Deadline: May 1st, 2025

**Academic Calendar:**
- Orientation Week: August 25-29, 2025
- Classes Begin: September 2nd, 2025

**Application Fee**: $75 (non-refundable)

I recommend applying early for the best chances of admission and scholarship consideration!`;
  }

  getProgramResponse(userMessage, relevantKnowledge) {
    const programInfo = this.extractProgramInfo(relevantKnowledge);
    
    if (programInfo.length > 0) {
      return `### Academic Programs

${programInfo.join('\n\n')}

Would you like more details about any specific program?`;
    }
    
    return `### Academic Programs

**Undergraduate Programs:**
- Computer Science (4 years)
- Business Administration (4 years)
- Mechanical Engineering (4 years)
- Psychology (4 years)

**Graduate Programs:**
- Data Science (2 years)
- MBA (2 years)

Need specific information about any program?`;
  }

  getScholarshipResponse(userMessage, relevantKnowledge) {
    return `### Scholarships & Financial Aid

**Available Scholarships:**
- Merit-based scholarships (up to 50% tuition)
- Need-based financial aid
- Department-specific scholarships
- International student scholarships

**Application Process:**
- Submit scholarship application with admission application
- Provide financial documentation if applying for need-based aid
- Maintain minimum GPA requirements

**Contact Financial Aid Office:**
- Phone: (555) 123-4568
- Email: financialaid@veridia.edu

Need help with the scholarship application process?`;
  }

  extractEligibilityInfo(knowledge) {
    const eligibilityInfo = [];
    
    knowledge.forEach(chunk => {
      if (chunk.toLowerCase().includes('eligibility') || chunk.toLowerCase().includes('requirement')) {
        // Extract only the relevant eligibility information
        const lines = chunk.split('\n');
        const relevantLines = lines.filter(line => 
          line.toLowerCase().includes('eligibility') || 
          line.toLowerCase().includes('requirement') ||
          line.toLowerCase().includes('minimum') ||
          line.toLowerCase().includes('marks') ||
          line.toLowerCase().includes('diploma') ||
          line.toLowerCase().includes('degree')
        );
        
        if (relevantLines.length > 0) {
          eligibilityInfo.push(relevantLines.join('\n'));
        }
      }
    });
    
    return eligibilityInfo;
  }

  extractCostInfo(knowledge) {
    const costInfo = [];
    
    knowledge.forEach(chunk => {
      if (chunk.toLowerCase().includes('fee') || chunk.toLowerCase().includes('cost') || chunk.toLowerCase().includes('tuition')) {
        // Extract only the relevant cost information
        const lines = chunk.split('\n');
        const relevantLines = lines.filter(line => 
          line.toLowerCase().includes('fee') || 
          line.toLowerCase().includes('cost') ||
          line.toLowerCase().includes('tuition') ||
          line.toLowerCase().includes('$') ||
          line.toLowerCase().includes('price')
        );
        
        if (relevantLines.length > 0) {
          costInfo.push(relevantLines.join('\n'));
        }
      }
    });
    
    return costInfo;
  }

  extractProgramInfo(knowledge) {
    const programInfo = [];
    
    knowledge.forEach(chunk => {
      if (chunk.toLowerCase().includes('program') || chunk.toLowerCase().includes('course') || chunk.toLowerCase().includes('degree')) {
        // Extract only the relevant program information
        const lines = chunk.split('\n');
        const relevantLines = lines.filter(line => 
          line.toLowerCase().includes('program') || 
          line.toLowerCase().includes('course') ||
          line.toLowerCase().includes('degree') ||
          line.toLowerCase().includes('bachelor') ||
          line.toLowerCase().includes('master') ||
          line.toLowerCase().includes('duration')
        );
        
        if (relevantLines.length > 0) {
          programInfo.push(relevantLines.join('\n'));
        }
      }
    });
    
    return programInfo;
  }

  createFocusedResponseFromKnowledge(userMessage, relevantKnowledge) {
    // Filter and extract only the most relevant information
    const filteredKnowledge = this.filterRelevantContent(userMessage, relevantKnowledge);
    
    if (filteredKnowledge.length === 0) {
      return this.getFallbackResponse(userMessage);
    }
    
    return `### Answer to Your Question

${filteredKnowledge.join('\n\n')}

Is there anything specific you'd like to know more about?`;
  }

  filterRelevantContent(userMessage, knowledge) {
    const message = userMessage.toLowerCase();
    const filtered = [];
    
    knowledge.forEach(chunk => {
      // Check if the chunk is relevant to the specific question
      const chunkLower = chunk.toLowerCase();
      let relevanceScore = 0;
      
      // Check for direct keyword matches
      const keywords = message.split(' ').filter(word => word.length > 3);
      keywords.forEach(keyword => {
        if (chunkLower.includes(keyword)) {
          relevanceScore += 2;
        }
      });
      
      // Check for related terms
      const relatedTerms = this.getRelatedTerms(message);
      relatedTerms.forEach(term => {
        if (chunkLower.includes(term)) {
          relevanceScore += 1;
        }
      });
      
      // Only include chunks with high relevance
      if (relevanceScore >= 2) {
        // Further filter the chunk to only include relevant sentences
        const sentences = chunk.split(/[.!?]+/);
        const relevantSentences = sentences.filter(sentence => {
          const sentenceLower = sentence.toLowerCase();
          return keywords.some(keyword => sentenceLower.includes(keyword)) ||
                 relatedTerms.some(term => sentenceLower.includes(term));
        });
        
        if (relevantSentences.length > 0) {
          filtered.push(relevantSentences.join('. ').trim());
        }
      }
    });
    
    return filtered.slice(0, 2); // Limit to top 2 most relevant chunks
  }

  getRelatedTerms(message) {
    const messageLower = message.toLowerCase();
    const relatedTerms = [];
    
    if (messageLower.includes('eligibility') || messageLower.includes('criteria')) {
      relatedTerms.push('requirement', 'minimum', 'marks', 'diploma', 'degree');
    }
    
    if (messageLower.includes('cost') || messageLower.includes('fee')) {
      relatedTerms.push('tuition', 'price', '$', 'payment');
    }
    
    if (messageLower.includes('program') || messageLower.includes('course')) {
      relatedTerms.push('degree', 'bachelor', 'master', 'duration');
    }
    
    if (messageLower.includes('deadline') || messageLower.includes('date')) {
      relatedTerms.push('application', 'deadline', 'date', 'time');
    }
    
    return relatedTerms;
  }

  createResponseFromKnowledge(userMessage, relevantKnowledge) {
    const knowledgeText = relevantKnowledge.join('\n\n');
    
    return `### Information About Veridia University

Based on your question about "${userMessage}", here's what I found:

${knowledgeText}

Would you like more specific details about any aspect of our admission process or programs?`;
  }

  getFallbackResponse(userMessage) {
    return `### Veridia University Admissions Information

Thank you for your question: "${userMessage}"

I can help you with information about:
- **Program Costs and Fees**
- **Admission Requirements** 
- **Application Deadlines**
- **Scholarships and Financial Aid**
- **Academic Programs**

Please feel free to ask me about any of these topics, or visit our admissions office at:
- Phone: (555) 123-4567
- Email: admissions@veridia.edu
- Office Hours: Monday-Friday, 9:00 AM - 5:00 PM

How else can I assist you today?`;
  }

  findRelevantKnowledge(query) {
    if (!this.knowledgeBase || this.knowledgeBase.length === 0) {
      console.log('No knowledge base available');
      return ['No university information available.'];
    }

    console.log(`Searching through ${this.knowledgeBase.length} knowledge chunks`);
    
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    console.log('Query words:', queryWords);
    
    const scoredChunks = this.knowledgeBase.map((chunk, index) => {
      const chunkLower = chunk.toLowerCase();
      let score = 0;
      
      // Exact word matches (higher score)
      queryWords.forEach(word => {
        if (chunkLower.includes(word)) {
          score += 2;
        }
      });
      
      // Partial matches (lower score)
      queryWords.forEach(word => {
        if (chunkLower.includes(word.substring(0, Math.max(3, word.length - 1)))) {
          score += 1;
        }
      });
      
      // Bonus for chunks containing key terms
      const keyTerms = ['program', 'course', 'degree', 'admission', 'requirement', 'fee', 'cost', 'tuition', 'scholarship', 'deadline'];
      keyTerms.forEach(term => {
        if (chunkLower.includes(term)) {
          score += 0.5;
        }
      });
      
      return { chunk, score, index };
    });

    const relevantChunks = scoredChunks
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Top 3 most relevant chunks
      .map(item => item.chunk);

    console.log(`Found ${relevantChunks.length} relevant chunks`);
    return relevantChunks.length > 0 ? relevantChunks : ['No university information available.'];
  }

  createPrompt(userMessage, context, conversationContext) {
    return `You are "Veridia_Admit_Assist", the official admission chatbot for Veridia University. Your primary role is to assist with admission-related queries while maintaining a professional yet friendly tone.

Response Guidelines:
1. Accuracy: 
   - First check the provided context from the university information
   - If exact information exists, provide precise details with relevant numbers/dates
   - If unsure, say: "Based on available information, [details]. For exact details, please visit [relevant department]."

2. Formatting:
   - Use clear headings (###) for different sections
   - Present lists with bullet points
   - Bold important details (*key dates, **deadlines, **requirements*)
   - Use tables for comparative information when appropriate

3. Behavior:
   - Be proactive in asking clarifying questions when needed
   - Maintain Veridia University's professional reputation
   - Politely decline unrelated requests: "I specialize in Veridia University admissions. How can I help with that?"

### University Context:
${context}

### Conversation History:
${conversationContext}

### Current Question:
${userMessage}

### Your Response:
Provide a helpful, accurate, and professional response about Veridia University admissions:`;
  }

  async callGeminiAPI(prompt) {
    try {
      console.log('Calling Gemini API with key:', this.apiKey ? 'Present' : 'Missing');
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Gemini API Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
      
    } catch (response) {
      console.error('Gemini API Error:', response.response?.data || response.message);
      
      // Fallback response
      return `Based on Veridia University information:

**MBA Program Costs:**
- **Master of Business Administration (MBA)**: Duration: 2 years, Tuition Fee: $20,000 per year
- Total program cost: $40,000 for the full MBA program

**Additional Information:**
- Eligibility: Bachelor's degree with minimum 60% marks and 2 years work experience
- Placement Rate: 96%
- Average Starting Salary: $90,000

For more specific fee details, payment plans, and scholarship opportunities, please contact the admissions office at (555) 123-4567 or admissions@veridia.edu.`;
    }
  }

  getStatus() {
    return {
      success: true,
      status: 'running',
      initialized: true,
      message: 'Chatbot service is running'
    };
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = ChatbotService;
