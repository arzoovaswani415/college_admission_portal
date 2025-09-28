import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  _id?: string;
  sessionId: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
  messageType: 'user' | 'assistant';
  context?: any;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  context?: any;
  message?: string;
}

export interface ChatHistory {
  success: boolean;
  messages: ChatMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chatbot';

  constructor(private http: HttpClient) { }

  sendMessage(message: string, sessionId: string, userId: string): Observable<ChatResponse> {
    const headers = this.getHeaders();
    return this.http.post<ChatResponse>(`${this.apiUrl}/send`, {
      message,
      sessionId,
      userId
    }, { headers });
  }

  getChatHistory(sessionId: string, limit: number = 50): Observable<ChatHistory> {
    const headers = this.getHeaders();
    return this.http.get<ChatHistory>(`${this.apiUrl}/history/${sessionId}?limit=${limit}`, { headers });
  }

  clearChatHistory(sessionId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/history/${sessionId}`, { headers });
  }

  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
