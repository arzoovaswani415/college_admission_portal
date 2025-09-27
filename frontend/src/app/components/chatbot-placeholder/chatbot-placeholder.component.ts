import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdmissionService } from '../../services/admission.service';

@Component({
  selector: 'app-chatbot-placeholder',
  templateUrl: './chatbot-placeholder.component.html',
  styleUrls: ['./chatbot-placeholder.component.css']
})
export class ChatbotPlaceholderComponent implements OnInit {
  chatbotStatus = 'Ready for Implementation';
  isCheckingStatus = false;

  constructor(
    private admissionService: AdmissionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.checkChatbotStatus();
  }

  checkChatbotStatus(): void {
    this.isCheckingStatus = true;
    this.admissionService.healthCheck().subscribe({
      next: (response) => {
        this.isCheckingStatus = false;
        if (response.success) {
          this.chatbotStatus = 'Backend Connected - Ready for Chatbot Implementation';
          this.snackBar.open('Backend is running and ready for chatbot integration', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
      },
      error: (error) => {
        this.isCheckingStatus = false;
        this.chatbotStatus = 'Backend Not Available';
        this.snackBar.open('Backend is not running. Please start the backend server.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onChatbotClick(): void {
    this.snackBar.open('Chatbot feature will be implemented in the next phase', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
