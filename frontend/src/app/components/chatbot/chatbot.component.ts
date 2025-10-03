import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage, ChatbotStatus } from '../../services/chatbot.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  
  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  chatbotStatus: ChatbotStatus | null = null;
  isInitialized: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    // Subscribe to chat history
    this.subscriptions.push(
      this.chatbotService.chatHistory$.subscribe(messages => {
        this.messages = messages;
      })
    );

    // Check chatbot status
    this.checkChatbotStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit(): void {
    // Focus on the textarea when component loads
    setTimeout(() => {
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 100);
  }

  /**
   * Check chatbot status and initialize if needed
   */
  checkChatbotStatus(): void {
    this.subscriptions.push(
      this.chatbotService.getStatus().subscribe({
        next: (status) => {
          this.chatbotStatus = status;
          this.isInitialized = status.initialized;
          
          if (!status.initialized && status.status === 'running') {
            this.initializeChatbot();
          } else if (status.status === 'stopped') {
            this.addSystemMessage('Chatbot service is currently offline. Please try again later.');
          }
        },
        error: (error) => {
          console.error('Error checking chatbot status:', error);
          this.chatbotStatus = {
            success: false,
            status: 'stopped',
            initialized: false,
            message: 'Chatbot service unavailable'
          };
          this.addSystemMessage('Unable to connect to chatbot service. Please check your connection and try again.');
        }
      })
    );
  }

  /**
   * Initialize the chatbot
   */
  initializeChatbot(): void {
    this.isLoading = true;
    this.addSystemMessage('Initializing chatbot... Please wait.');
    
    this.subscriptions.push(
      this.chatbotService.initializeChatbot().subscribe({
        next: (response) => {
          this.isInitialized = true;
          this.isLoading = false;
          console.log('Chatbot initialized successfully');
          this.addSystemMessage('Chatbot is ready! You can now ask questions about Veridia University admissions.');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Failed to initialize chatbot:', error);
          this.addSystemMessage('Failed to initialize chatbot. Please try again later or contact support.');
        }
      })
    );
  }

  /**
   * Send message to chatbot
   */
  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    const message = this.currentMessage.trim();
    this.currentMessage = '';
    this.isLoading = true;

    // Focus back on textarea after sending
    setTimeout(() => {
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 100);

    this.subscriptions.push(
      this.chatbotService.sendMessage(message).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Message is automatically added to history by the service
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error sending message:', error);
          this.addSystemMessage('Sorry, I encountered an error. Please try again.');
        }
      })
    );
  }

  /**
   * Focus on the textarea
   */
  focusTextarea(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }

  /**
   * Handle Enter key press
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Clear chat history
   */
  clearChat(): void {
    this.chatbotService.clearChatHistory();
  }

  /**
   * Add system message to chat
   */
  private addSystemMessage(message: string): void {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message,
      timestamp: new Date(),
      isUser: false
    };
    this.messages.push(systemMessage);
  }

  /**
   * Format timestamp for display
   */
  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * Format message text for display (handle markdown-like formatting)
   */
  formatMessage(message: string): string {
    if (!message) return '';
    
    // Convert basic markdown-like formatting
    let formatted = message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/### (.*?)(<br>|$)/g, '<h3>$1</h3>') // Headers
      .replace(/## (.*?)(<br>|$)/g, '<h2>$1</h2>') // Headers
      .replace(/# (.*?)(<br>|$)/g, '<h1>$1</h1>'); // Headers
    
    return formatted;
  }

  /**
   * Check if chatbot is ready
   */
  get isChatbotReady(): boolean {
    return this.isInitialized && this.chatbotStatus?.status === 'running';
  }
}
