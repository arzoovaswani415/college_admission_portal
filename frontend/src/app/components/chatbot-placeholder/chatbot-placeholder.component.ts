import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot-placeholder',
  templateUrl: './chatbot-placeholder.component.html',
  styleUrls: ['./chatbot-placeholder.component.css']
})
export class ChatbotPlaceholderComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isAuthenticated = false;
  currentUser: User | null = null;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  isTyping = false;
  sessionId = '';
  showScrollButton = false;

  constructor(
    private authService: AuthService,
    private chatbotService: ChatbotService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkAuthentication();
    this.initializeChat();
    this.setupScrollListener();
  }

  ngAfterViewChecked(): void {
    // Only auto-scroll if user is near the bottom
    this.scrollToBottomIfNeeded();
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
  }

  initializeChat(): void {
    if (this.isAuthenticated && this.currentUser) {
      this.sessionId = this.chatbotService.generateSessionId();
      this.loadChatHistory();
    }
  }

  loadChatHistory(): void {
    this.chatbotService.getChatHistory(this.sessionId).subscribe({
      next: (response) => {
        if (response.success) {
          this.messages = response.messages;
        }
      },
      error: (error) => {
        console.error('Error loading chat history:', error);
      }
    });
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading || !this.currentUser) {
      return;
    }

    const userMessage = this.currentMessage.trim();
    this.currentMessage = '';

    // Add user message to UI immediately
    const userChatMessage: ChatMessage = {
      sessionId: this.sessionId,
      userId: this.currentUser.id,
      message: userMessage,
      response: '',
      timestamp: new Date(),
      messageType: 'user'
    };
    this.messages.push(userChatMessage);

    // Show typing indicator
    this.isTyping = true;
    this.isLoading = true;

    // Send message to backend
    this.chatbotService.sendMessage(userMessage, this.sessionId, this.currentUser.id).subscribe({
      next: (response) => {
        this.isTyping = false;
        this.isLoading = false;

        if (response.success) {
          // Add bot response to UI
          const botChatMessage: ChatMessage = {
            sessionId: this.sessionId,
            userId: this.currentUser!.id,
            message: '',
            response: response.response,
            timestamp: new Date(),
            messageType: 'assistant'
          };
          this.messages.push(botChatMessage);
        } else {
          this.snackBar.open('Error getting response from AI', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        this.isTyping = false;
        this.isLoading = false;
        
        console.error('Error sending message:', error);
        this.snackBar.open('Error communicating with AI assistant', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  clearChat(): void {
    this.chatbotService.clearChatHistory(this.sessionId).subscribe({
      next: (response) => {
        if (response.success) {
          this.messages = [];
          this.snackBar.open('Chat history cleared', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error clearing chat:', error);
        this.snackBar.open('Error clearing chat history', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  goToAuth(): void {
    this.router.navigate(['/auth']);
  }

  logout(): void {
    this.authService.logout();
    this.checkAuthentication();
    this.messages = [];
    this.sessionId = '';
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatMessage(text: string): string {
    if (!text) return '';
    
    // Convert markdown-style bold (**text**) to HTML bold
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert line breaks to HTML breaks
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    // Convert bullet points to HTML list items
    formattedText = formattedText.replace(/^• (.*$)/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in ul tags
    formattedText = formattedText.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Clean up nested ul tags
    formattedText = formattedText.replace(/<\/ul>\s*<ul>/g, '');
    
    return formattedText;
  }

  private setupScrollListener(): void {
    // Set up scroll listener after view init
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.addEventListener('scroll', () => {
          this.checkScrollPosition();
        });
      }
    }, 100);
  }

  private checkScrollPosition(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        const isNearBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 100;
        this.showScrollButton = !isNearBottom && element.scrollHeight > element.clientHeight;
      }
    } catch (err) {
      // Ignore scroll errors
    }
  }

  private scrollToBottomIfNeeded(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        const isNearBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 100;
        
        // Only auto-scroll if user is near the bottom or if it's a new message
        if (isNearBottom || this.isTyping) {
          element.scrollTop = element.scrollHeight;
        }
        
        // Update scroll button visibility
        this.checkScrollPosition();
      }
    } catch (err) {
      // Ignore scroll errors
    }
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      // Ignore scroll errors
    }
  }
}
