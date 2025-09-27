import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-veridia-university',
  templateUrl: './veridia-university.component.html',
  styleUrls: ['./veridia-university.component.css']
})
export class VeridiaUniversityComponent implements OnInit {
  isDarkMode = false;
  isChatbotOpen = false;
  isMobileMenuOpen = false;

  // Chatbot data
  chatbotMessages: Array<{type: 'bot' | 'user', message: string, timestamp: Date}> = [];
  currentUserMessage = '';
  isTyping = false;

  // FAQ data for chatbot
  faqs = [
    {
      question: "What are the application deadlines?",
      answer: "Our application deadlines are: Early Decision (November 1st), Regular Decision (January 15th), and Rolling Admission (until May 1st)."
    },
    {
      question: "What are the admission requirements?",
      answer: "We require: High school transcript, SAT/ACT scores, two letters of recommendation, personal essay, and application fee. International students need TOEFL/IELTS scores."
    },
    {
      question: "Do you offer scholarships?",
      answer: "Yes! We offer merit-based scholarships, need-based financial aid, and athletic scholarships. The average scholarship amount is $15,000 per year."
    },
    {
      question: "What majors do you offer?",
      answer: "We offer over 50 majors including Business, Engineering, Liberal Arts, Sciences, and Health Sciences. Visit our academics page for the complete list."
    },
    {
      question: "How can I schedule a campus visit?",
      answer: "You can schedule a campus visit by calling our admissions office at (555) 123-4567 or visiting our website to book online. Tours are available Monday-Friday."
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize chatbot with welcome message
    this.addBotMessage("Hello! I'm here to help with your questions about Veridia University. How can I assist you today?");
    
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleChatbot(): void {
    this.isChatbotOpen = !this.isChatbotOpen;
  }

  closeChatbot(): void {
    this.isChatbotOpen = false;
  }

  sendMessage(): void {
    if (this.currentUserMessage.trim()) {
      this.addUserMessage(this.currentUserMessage);
      this.processUserMessage(this.currentUserMessage);
      this.currentUserMessage = '';
    }
  }

  addUserMessage(message: string): void {
    this.chatbotMessages.push({
      type: 'user',
      message: message,
      timestamp: new Date()
    });
  }

  addBotMessage(message: string): void {
    this.chatbotMessages.push({
      type: 'bot',
      message: message,
      timestamp: new Date()
    });
  }

  processUserMessage(message: string): void {
    this.isTyping = true;
    
    // Simulate typing delay
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      let response = "I'd be happy to help! Could you be more specific about what you'd like to know?";
      
      // Check for FAQ matches
      for (const faq of this.faqs) {
        if (lowerMessage.includes(faq.question.toLowerCase().split(' ')[0]) || 
            lowerMessage.includes('deadline') || 
            lowerMessage.includes('requirement') || 
            lowerMessage.includes('scholarship') || 
            lowerMessage.includes('major') || 
            lowerMessage.includes('visit')) {
          response = faq.answer;
          break;
        }
      }
      
      this.addBotMessage(response);
      this.isTyping = false;
    }, 1000);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.isMobileMenuOpen = false;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.currentUserMessage = target.value;
  }
}
