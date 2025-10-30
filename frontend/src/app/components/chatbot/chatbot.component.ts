import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  isOpen: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Add welcome message
    this.messages.push({
      text: 'Hello! I\'m TSEC Admit Assist. How can I help you with admissions today?',
      isUser: false,
      timestamp: new Date()
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.newMessage.trim() || this.isLoading) return;

    const userMessage = this.newMessage.trim();
    this.messages.push({
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    });

    this.newMessage = '';
    this.isLoading = true;

    this.http.post<any>('http://localhost:3000/api/chatbot/send', {
      message: userMessage
    }).subscribe({
      next: (response) => {
        this.messages.push({
          text: response.response,
          isUser: false,
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.messages.push({
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date()
        });
        this.isLoading = false;
        console.error('Chatbot error:', error);
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}

