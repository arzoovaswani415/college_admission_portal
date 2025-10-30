#!/usr/bin/env python3
import os
import sys
import json
import warnings
from dotenv import load_dotenv

# Suppress warnings
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
    from langchain_community.document_loaders import PyPDFLoader
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_community.vectorstores import FAISS
    from langchain.chains import RetrievalQA
    from langchain.prompts import PromptTemplate
    from langchain.memory import ConversationBufferMemory
except ImportError as e:
    print(f"Error: Missing required packages. Install with: pip install -r requirements.txt")
    print(f"Import error: {e}")
    sys.exit(1)

# Global variables for caching
qa_chain = None
is_initialized = False

def initialize_chain():
    global qa_chain, is_initialized
    
    if is_initialized:
        return
    
    try:
        # Set up API key
        api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
        if not api_key:
            print("Error: GEMINI_API_KEY or GOOGLE_API_KEY not found in environment")
            sys.exit(1)
        
        os.environ['GOOGLE_API_KEY'] = api_key
        
        # Load PDF
        pdf_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'COLLEGE-INFORMATION.pdf')
        if not os.path.exists(pdf_path):
            print("Error: COLLEGE-INFORMATION.pdf not found in assets folder")
            sys.exit(1)
        
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        
        # Split documents
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(documents)
        
        # Create embeddings and vector store
        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        vector_store = FAISS.from_documents(chunks, embeddings)
        
        # Create prompt template
        template = """You are "TSEC_Admit_Assist", the official admission chatbot for Thadomal Shahani Engineering College. Your primary role is to assist with admission-related queries while maintaining a professional yet friendly tone.

Response Guidelines:
1. Accuracy: 
   - First check the provided context from the PDF
   - If exact information exists, provide precise details with relevant numbers/dates
   - If unsure, say: "Based on available information, [details]. For exact details, please visit [relevant department]."

2. Formatting:
   - Use clear headings (###) for different sections
   - Present lists with bullet points
   - Bold important details (*key dates, **deadlines, **requirements*)
   - Use tables for comparative information when appropriate

3. Behavior:
   - Be proactive in asking clarifying questions when needed
   - Maintain TSEC's professional reputation
   - Politely decline unrelated requests: "I specialize in TSEC admissions. How can I help with that?"

4. Special Cases:
   - For course queries: Include duration, fees, eligibility, and placement stats
   - For deadlines: Highlight *important dates* in bold
   - For comparisons: Present in table format when possible

### Current Context:
{context}

### Conversation History:
{history}

### Question:
{question}

### Response Format:
[Start with appropriate greeting if new conversation]
[Provide concise, accurate information]
[End with relevant follow-up question/suggestion]

Context: {context}

Conversation History:
{history}

Question: {question}
Answer:"""
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["context", "history", "question"],
        )
        
        # Initialize LLM and memory
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
        memory = ConversationBufferMemory(memory_key="history", input_key="question", return_messages=True)
        
        # Create QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm,
            retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
            chain_type_kwargs={
                "prompt": prompt,
                "memory": memory,
            },
            return_source_documents=True,
        )
        
        is_initialized = True
        print("✅ LangChain chatbot initialized successfully", file=sys.stderr)
        
    except Exception as e:
        print(f"Error initializing chatbot: {e}", file=sys.stderr)
        print("Fallback: Using basic response mode", file=sys.stderr)
        is_initialized = True  # Allow fallback mode

def get_response(query):
    global qa_chain
    
    if not qa_chain:
        # Fallback responses when LangChain fails
        query_lower = query.lower()
        if any(word in query_lower for word in ['course', 'program', 'degree']):
            return "TSEC offers various engineering programs including Computer Science, Information Technology, Electronics, and Mechanical Engineering. For detailed course information, please visit our official website or contact the admissions office."
        elif any(word in query_lower for word in ['admission', 'apply', 'requirement']):
            return "For admission requirements and application procedures, please check our official website or contact the admissions department directly. They can provide you with the most current information."
        elif any(word in query_lower for word in ['fee', 'cost', 'tuition']):
            return "Fee structure varies by program and year. Please contact the accounts department or check our official website for the most up-to-date fee information."
        else:
            return "I'm here to help with TSEC admissions. Please ask about courses, admission requirements, fees, or any other admission-related questions."
    
    try:
        result = qa_chain.invoke({"query": query})
        response = result["result"]
        
        if response.strip().lower().startswith(("i don't know", "i'm not sure")):
            response = "I'm sorry, I couldn't find specific information about that. " + response
        
        return response
        
    except Exception as e:
        return f"I apologize, but I encountered an error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python chat_service.py <query>")
        sys.exit(1)
    
    query = sys.argv[1]
    
    try:
        # Initialize the chain
        initialize_chain()
        
        # Get response
        response = get_response(query)
        print(response)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)
