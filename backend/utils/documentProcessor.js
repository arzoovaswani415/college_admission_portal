const fs = require('fs');
const path = require('path');

class DocumentProcessor {
    constructor() {
        this.knowledgeBasePath = path.join(__dirname, '../knowledge-base');
        this.documentsPath = path.join(this.knowledgeBasePath, 'documents');
        this.processedPath = path.join(this.knowledgeBasePath, 'processed');

        // Ensure directories exist
        this.ensureDirectories();
    }

    ensureDirectories() {
        [this.knowledgeBasePath, this.documentsPath, this.processedPath].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    // Simple text extraction from PDF (for demo purposes)
    // In production, you'd use a proper PDF parsing library like pdf-parse
    extractTextFromPDF(pdfPath) {
        // This is a placeholder - in production, use pdf-parse or similar
        console.log(`Processing PDF: ${pdfPath}`);

        // For demo, return structured content based on filename
        const filename = path.basename(pdfPath, '.pdf');

        switch (filename.toLowerCase()) {
            case 'college_information':
                return {
                    title: 'Verdia University Information',
                    content: `
            VERDIA UNIVERSITY - COMPREHENSIVE INFORMATION
            
            ADMISSION REQUIREMENTS:
            - High school diploma or equivalent
            - Minimum GPA of 2.5 (3.0 for competitive programs)
            - SAT/ACT scores (optional but recommended)
            - Personal statement (500-750 words)
            - Two letters of recommendation
            - Application fee: $50 (non-refundable)
            - Official transcripts from all institutions attended
            
            APPLICATION DEADLINES:
            Fall Semester:
            - Early Action: March 1st
            - Regular Decision: May 1st
            - Late Applications: June 1st (space permitting)
            
            Spring Semester:
            - Early Action: October 1st
            - Regular Decision: December 1st
            - Late Applications: January 1st (space permitting)
            
            Summer Semester:
            - Applications due: March 1st
            
            ACADEMIC PROGRAMS:
            
            Computer Science Program:
            - Duration: 4 years (120 credit hours)
            - Concentrations: Software Engineering, Data Science, Cybersecurity, AI/ML
            - Prerequisites: High school mathematics, basic programming knowledge
            - Career outcomes: Software Developer, Data Scientist, Systems Analyst
            
            Business Administration Program:
            - Duration: 4 years (120 credit hours)
            - Concentrations: Finance, Marketing, Management, International Business
            - Prerequisites: High school mathematics and English
            - Career outcomes: Business Analyst, Marketing Manager, Financial Advisor
            
            Engineering Programs:
            - Civil Engineering
            - Mechanical Engineering
            - Electrical Engineering
            - Duration: 4 years (130 credit hours)
            
            SCHOLARSHIPS AND FINANCIAL AID:
            
            Merit Scholarships:
            - Presidential Scholarship: Full tuition (GPA 3.8+, SAT 1400+)
            - Dean's Scholarship: $10,000/year (GPA 3.5+, SAT 1300+)
            - Achievement Scholarship: $5,000/year (GPA 3.0+, SAT 1200+)
            - Application deadline: March 1st
            
            Need-Based Financial Aid:
            - Federal Pell Grant
            - State grants
            - Work-study programs
            - Low-interest loans
            - FAFSA deadline: March 1st for priority consideration
            
            TUITION AND FEES (2024-2025):
            - In-state tuition: $12,000/year
            - Out-of-state tuition: $24,000/year
            - Room and board: $8,000/year
            - Books and supplies: $1,500/year
            - Technology fee: $500/year
            
            CAMPUS LIFE:
            - Student population: 15,000 undergraduate, 5,000 graduate
            - Student-to-faculty ratio: 18:1
            - Average class size: 25 students
            - 200+ student organizations
            - NCAA Division II athletics
            - On-campus housing for 6,000 students
            
            CAMPUS FACILITIES:
            - Modern library with 500,000+ volumes
            - State-of-the-art laboratories
            - Recreation center with fitness facilities
            - Student union with dining options
            - Technology-enabled classrooms
            - Research centers and institutes
            
            LOCATION:
            - Campus City, State
            - 200-acre main campus
            - 15 minutes from downtown
            - Public transportation available
            - Safe, residential neighborhood
            
            CONTACT INFORMATION:
            - Admissions Office: (555) 123-4567
            - Email: admissions@verdia.edu
            - Website: www.verdia.edu
            - Office hours: Monday-Friday, 8:00 AM - 5:00 PM
            - Campus tours: Available Monday-Saturday
          `,
                    category: 'general',
                    tags: ['admission', 'requirements', 'deadlines', 'programs', 'scholarships', 'tuition', 'campus']
                };

            default:
                return {
                    title: filename,
                    content: 'Document content would be extracted here',
                    category: 'general',
                    tags: []
                };
        }
    }

    processDocuments() {
        const processedDocs = [];

        // Process PDF files in documents directory
        if (fs.existsSync(this.documentsPath)) {
            const files = fs.readdirSync(this.documentsPath);

            files.forEach(file => {
                if (file.toLowerCase().endsWith('.pdf')) {
                    const filePath = path.join(this.documentsPath, file);
                    const extracted = this.extractTextFromPDF(filePath);
                    processedDocs.push(extracted);
                }
            });
        }

        // Save processed content
        const outputPath = path.join(this.processedPath, 'knowledge_base.json');
        fs.writeFileSync(outputPath, JSON.stringify(processedDocs, null, 2));

        console.log(`Processed ${processedDocs.length} documents`);
        return processedDocs;
    }

    loadKnowledgeBase() {
        const knowledgeBasePath = path.join(this.processedPath, 'knowledge_base.json');

        if (fs.existsSync(knowledgeBasePath)) {
            const content = fs.readFileSync(knowledgeBasePath, 'utf8');
            return JSON.parse(content);
        }

        // If no processed file exists, process documents
        return this.processDocuments();
    }
}

module.exports = DocumentProcessor;
