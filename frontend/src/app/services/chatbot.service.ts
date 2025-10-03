import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  timestamp: Date;
  isUser: boolean;
}

export interface ChatbotStatus {
  success: boolean;
  status: 'running' | 'stopped';
  initialized: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chatbot';
  private chatHistory: ChatMessage[] = [];
  private chatHistorySubject = new BehaviorSubject<ChatMessage[]>([]);
  public chatHistory$ = this.chatHistorySubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadChatHistory();
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  /**
   * Initialize the chatbot service
   */
  initializeChatbot(): Observable<any> {
    return this.http.post(`${this.apiUrl}/initialize`, {}, this.httpOptions)
      .pipe(
        map((response: any) => {
          if (response.success) {
            console.log('Chatbot initialized successfully');
            return response;
          } else {
            throw new Error(response.message || 'Failed to initialize chatbot');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Send a message to the chatbot
   */
  sendMessage(message: string): Observable<any> {
    const userMessage: ChatMessage = {
      id: this.generateId(),
      message: message,
      timestamp: new Date(),
      isUser: true
    };

    // Add user message to history immediately
    this.addToHistory(userMessage);

    return this.http.post(`${this.apiUrl}/chat`, { message }, this.httpOptions)
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            const botMessage: ChatMessage = {
              id: this.generateId(),
              message: response.data.response || 'No response received',
              timestamp: new Date(),
              isUser: false
            };
            this.addToHistory(botMessage);
            return botMessage;
          } else {
            throw new Error(response.message || 'Failed to get response from chatbot');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get chatbot status
   */
  getStatus(): Observable<ChatbotStatus> {
    return this.http.get<ChatbotStatus>(`${this.apiUrl}/status`)
      .pipe(
        map((response: any) => {
          if (response.success) {
            return {
              success: true,
              status: response.status,
              initialized: response.initialized,
              message: response.message
            };
          } else {
            throw new Error(response.message || 'Failed to get chatbot status');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Stop the chatbot service
   */
  stopService(): Observable<any> {
    return this.http.post(`${this.apiUrl}/stop`, {}, this.httpOptions)
      .pipe(
        map((response: any) => {
          if (response.success) {
            console.log('Chatbot service stopped');
            return response;
          } else {
            throw new Error(response.message || 'Failed to stop chatbot service');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get chat history
   */
  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  /**
   * Clear chat history
   */
  clearChatHistory(): void {
    this.chatHistory = [];
    this.chatHistorySubject.next(this.chatHistory);
    this.saveChatHistory();
  }

  /**
   * Add message to chat history
   */
  private addToHistory(message: ChatMessage): void {
    this.chatHistory.push(message);
    this.chatHistorySubject.next(this.chatHistory);
    this.saveChatHistory();
  }

  /**
   * Generate unique ID for messages
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Save chat history to localStorage
   */
  private saveChatHistory(): void {
    try {
      localStorage.setItem('chatbot_history', JSON.stringify(this.chatHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  /**
   * Load chat history from localStorage
   */
  private loadChatHistory(): void {
    try {
      const saved = localStorage.getItem('chatbot_history');
      if (saved) {
        this.chatHistory = JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        this.chatHistorySubject.next(this.chatHistory);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      this.chatHistory = [];
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Chatbot service error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || 'Server error';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
