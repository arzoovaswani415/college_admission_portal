import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdmissionService, Admission } from '../../services/admission.service';

@Component({
  selector: 'app-admission-form',
  templateUrl: './admission-form.component.html',
  styleUrls: ['./admission-form.component.css']
})
export class AdmissionFormComponent implements OnInit, AfterViewInit {
  admissionForm: FormGroup;
  isSubmitting = false;
  courses = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Medicine',
    'Arts',
    'Science'
  ];

  constructor(
    private fb: FormBuilder,
    private admissionService: AdmissionService,
    private snackBar: MatSnackBar
  ) {
    this.admissionForm = this.createForm();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Force enable click events on mat-select elements
    setTimeout(() => {
      this.enableSelectClicks();
    }, 100);

    // Set up periodic checks to ensure clicks work
    setInterval(() => {
      this.enableSelectClicks();
    }, 2000);

    // Watch for new mat-option elements being added to DOM
    this.setupMutationObserver();
  }

  private setupMutationObserver(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if it's a mat-option or contains mat-options
              if (element.classList.contains('mat-option')) {
                this.fixMatOption(element as HTMLElement);
              }
              // Check for mat-options within the added element
              const matOptions = element.querySelectorAll('.mat-option');
              matOptions.forEach(option => this.fixMatOption(option as HTMLElement));
            }
          });
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private fixMatOption(element: HTMLElement): void {
    element.style.pointerEvents = 'auto';
    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    
    // Fix all children elements
    const allChildren = element.querySelectorAll('*');
    allChildren.forEach(child => {
      const childElement = child as HTMLElement;
      childElement.style.cursor = 'pointer';
      childElement.style.pointerEvents = 'auto';
    });
    
    const optionText = element.querySelector('.mat-option-text') as HTMLElement;
    if (optionText) {
      optionText.style.pointerEvents = 'auto';
      optionText.style.cursor = 'pointer';
    }
  }

  private enableSelectClicks(): void {
    // Find all mat-select elements and ensure they're clickable
    const selectElements = document.querySelectorAll('mat-select');
    selectElements.forEach(select => {
      const element = select as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
      
      // Also fix the trigger element
      const trigger = element.querySelector('.mat-select-trigger') as HTMLElement;
      if (trigger) {
        trigger.style.pointerEvents = 'auto';
        trigger.style.cursor = 'pointer';
      }
    });

    // Fix mat-option elements specifically
    const optionElements = document.querySelectorAll('.mat-option');
    optionElements.forEach(option => {
      const element = option as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
      element.style.userSelect = 'none';
      
      // Fix all children elements
      const allChildren = element.querySelectorAll('*');
      allChildren.forEach(child => {
        const childElement = child as HTMLElement;
        childElement.style.cursor = 'pointer';
        childElement.style.pointerEvents = 'auto';
      });
      
      // Fix option text content
      const optionText = element.querySelector('.mat-option-text') as HTMLElement;
      if (optionText) {
        optionText.style.pointerEvents = 'auto';
        optionText.style.cursor = 'pointer';
      }
    });

    // Fix date picker toggles
    const datePickerToggles = document.querySelectorAll('mat-datepicker-toggle');
    datePickerToggles.forEach(toggle => {
      const element = toggle as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
    });

    // Also ensure global menu elements remain clickable
    const menuButtons = document.querySelectorAll('.user-menu-btn');
    menuButtons.forEach(button => {
      const element = button as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
    });

    const menuItems = document.querySelectorAll('mat-menu-item');
    menuItems.forEach(item => {
      const element = item as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required]
      }),
      address: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: ['', [Validators.required, Validators.minLength(2)]],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
        country: ['', [Validators.required, Validators.minLength(2)]]
      }),
      academicInfo: this.fb.group({
        course: ['', Validators.required],
        previousEducation: ['', [Validators.required, Validators.minLength(10)]],
        gpa: ['', [Validators.min(0), Validators.max(4.0)]],
        academicLevel: ['', Validators.required]
      }),
      documents: this.fb.group({
        resume: [''],
        transcript: [''],
        recommendationLetter: [''],
        other: ['']
      })
    });
  }

  onSubmit(): void {
    if (this.admissionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData: Admission = this.admissionForm.value;
      
      this.admissionService.createAdmission(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.snackBar.open('Application submitted successfully!', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            this.admissionForm.reset();
          } else {
            this.snackBar.open('Error submitting application. Please try again.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error submitting application:', error);
          this.snackBar.open('Error submitting application. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.admissionForm);
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  getErrorMessage(controlName: string, groupName?: string): string {
    const control = groupName 
      ? this.admissionForm.get(`${groupName}.${controlName}`)
      : this.admissionForm.get(controlName);
    
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(controlName)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('pattern')) {
      if (controlName === 'phone') {
        return 'Please enter a valid phone number';
      }
      if (controlName === 'zipCode') {
        return 'Please enter a valid ZIP code';
      }
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `${this.getFieldDisplayName(controlName)} must be at least ${requiredLength} characters`;
    }
    if (control?.hasError('min')) {
      return 'GPA must be at least 0';
    }
    if (control?.hasError('max')) {
      return 'GPA must be at most 4.0';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      street: 'Street Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      country: 'Country',
      course: 'Course',
      previousEducation: 'Previous Education',
      gpa: 'GPA',
      academicLevel: 'Academic Level'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(controlName: string, groupName?: string): boolean {
    const control = groupName 
      ? this.admissionForm.get(`${groupName}.${controlName}`)
      : this.admissionForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getCurrentStep(): number {
    // This would be implemented based on the stepper's current step
    return 1; // Placeholder - would be dynamic based on stepper
  }

  getProgressPercentage(): number {
    // Calculate progress based on completed form sections
    let completedSections = 0;
    const totalSections = 3; // personalInfo, address, academicInfo
    
    if (this.admissionForm.get('personalInfo')?.valid) completedSections++;
    if (this.admissionForm.get('address')?.valid) completedSections++;
    if (this.admissionForm.get('academicInfo')?.valid) completedSections++;
    
    return (completedSections / totalSections) * 100;
  }

  onSelectOpened(opened: boolean): void {
    // Handle select dropdown open/close events
    if (opened) {
      console.log('Select dropdown opened');
    } else {
      console.log('Select dropdown closed');
    }
  }
}
