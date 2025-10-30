#!/usr/bin/env python3
import os
import sys
import warnings
from dotenv import load_dotenv

# Suppress all warnings
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Load environment variables
load_dotenv()

def get_response(query):
    """Simple fallback responses for TSEC chatbot"""
    query_lower = query.lower()
    
    if any(word in query_lower for word in ['course', 'program', 'degree', 'engineering']):
        return """TSEC offers various engineering programs:

**Undergraduate Programs:**
• Computer Engineering
• Information Technology
• Electronics and Telecommunication
• Mechanical Engineering
• Civil Engineering

**Postgraduate Programs:**
• Master of Technology (M.Tech)
• Master of Computer Applications (MCA)

For detailed curriculum and admission requirements, please visit our official website or contact the admissions office."""
    
    elif any(word in query_lower for word in ['admission', 'apply', 'requirement', 'eligibility']):
        return """**Admission Requirements:**

• 10+2 with Physics, Chemistry, and Mathematics
• Minimum 50% aggregate marks
• Valid entrance exam scores (JEE Main/MHT-CET)
• Application form submission
• Document verification

**Application Process:**
1. Fill online application form
2. Upload required documents
3. Pay application fee
4. Appear for counseling (if required)

For current admission dates and detailed requirements, contact our admissions office."""
    
    elif any(word in query_lower for word in ['fee', 'cost', 'tuition', 'payment']):
        return """**Fee Structure (Approximate):**

• Tuition Fee: ₹1,50,000 - ₹2,00,000 per year
• Development Fee: ₹25,000 per year
• Library Fee: ₹5,000 per year
• Laboratory Fee: ₹10,000 per year
• Other charges: ₹15,000 per year

**Total Annual Cost:** ₹2,05,000 - ₹2,55,000

*Fees may vary by program and year. Please contact the accounts department for exact current fees.*"""
    
    elif any(word in query_lower for word in ['scholarship', 'financial', 'aid', 'loan']):
        return """**Scholarship Opportunities:**

• Merit-based scholarships for top performers
• Government scholarships (EBC, OBC, SC/ST)
• Alumni scholarship programs
• Industry-sponsored scholarships
• Need-based financial assistance

**Eligibility:**
• Academic performance
• Family income criteria
• Special category benefits

Contact the scholarship cell for application details and deadlines."""
    
    elif any(word in query_lower for word in ['placement', 'job', 'career', 'company']):
        return """**Placement Statistics:**

• 90%+ placement rate
• Average package: ₹6-8 LPA
• Top recruiters: TCS, Infosys, Wipro, Accenture
• Highest package: ₹15+ LPA
• Internship opportunities with leading companies

**Career Support:**
• Dedicated placement cell
• Industry partnerships
• Skill development programs
• Mock interviews and resume building

Visit our placement office for detailed statistics and company profiles."""
    
    elif any(word in query_lower for word in ['campus', 'facility', 'hostel', 'library']):
        return """**Campus Facilities:**

• Modern classrooms with smart boards
• Well-equipped laboratories
• Central library with digital resources
• Computer labs with latest software
• Sports complex and gymnasium
• Cafeteria and food court
• Hostel accommodation (boys & girls)
• Medical center
• Transportation facilities

**Campus Life:**
• Technical clubs and societies
• Cultural events and festivals
• Sports competitions
• Industry visits and workshops

Experience a vibrant campus life at TSEC!"""
    
    else:
        return """Welcome to TSEC Admit Assist! 

I can help you with information about:
• **Courses & Programs** - Engineering degrees and specializations
• **Admission Requirements** - Eligibility and application process  
• **Fee Structure** - Tuition and other costs
• **Scholarships** - Financial aid opportunities
• **Placements** - Career prospects and statistics
• **Campus Life** - Facilities and student life

What would you like to know about TSEC admissions?"""

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python simple_chat.py <query>")
        sys.exit(1)
    
    query = sys.argv[1]
    response = get_response(query)
    print(response)



