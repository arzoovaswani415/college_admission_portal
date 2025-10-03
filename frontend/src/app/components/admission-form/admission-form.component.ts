import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdmissionService, Admission } from '../../services/admission.service';

@Component({
  selector: 'app-admission-form',
  templateUrl: './admission-form.component.html',
  styleUrls: ['./admission-form.component.css']
})
export class AdmissionFormComponent implements OnInit {
  admissionForm: FormGroup;
  isSubmitting = false;
  uploadedFiles: { [key: string]: File } = {};
  startDate = new Date(1990, 0, 1); // Default start date for date picker
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
    console.log('Submit button clicked!');
    console.log('Form valid:', this.admissionForm.valid);
    console.log('Form errors:', this.getFormErrors());
    
    // Show immediate feedback
    this.snackBar.open('📝 Processing your application...', 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
    
    if (this.admissionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log('Starting form submission...');
      
      // Show success message immediately for testing
      setTimeout(() => {
        this.isSubmitting = false;
        this.snackBar.open('🎉 Application submitted successfully! Documents uploaded successfully!', 'Close', {
          duration: 8000,
          panelClass: ['success-snackbar']
        });
        console.log('Form submitted successfully!');
      }, 2000);
      
      // Uncomment below for actual API call
      /*
      const formData: Admission = this.admissionForm.value;
      
      // Add uploaded file information to the form data
      const documents = {
        resume: this.uploadedFiles['resume'] ? {
          name: this.uploadedFiles['resume'].name,
          size: this.uploadedFiles['resume'].size,
          type: this.uploadedFiles['resume'].type,
          uploaded: true
        } : null,
        transcript: this.uploadedFiles['transcript'] ? {
          name: this.uploadedFiles['transcript'].name,
          size: this.uploadedFiles['transcript'].size,
          type: this.uploadedFiles['transcript'].type,
          uploaded: true
        } : null,
        recommendationLetter: this.uploadedFiles['recommendationLetter'] ? {
          name: this.uploadedFiles['recommendationLetter'].name,
          size: this.uploadedFiles['recommendationLetter'].size,
          type: this.uploadedFiles['recommendationLetter'].type,
          uploaded: true
        } : null,
        other: this.uploadedFiles['other'] ? {
          name: this.uploadedFiles['other'].name,
          size: this.uploadedFiles['other'].size,
          type: this.uploadedFiles['other'].type,
          uploaded: true
        } : null
      };
      
      // Add documents to form data
      formData.documents = documents;
      
      console.log('Submitting form data:', formData);
      
      this.admissionService.createAdmission(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          console.log('Response received:', response);
          if (response.success) {
            this.snackBar.open('🎉 Application submitted successfully! You will receive a confirmation email shortly.', 'Close', {
              duration: 8000,
              panelClass: ['success-snackbar']
            });
            this.admissionForm.reset();
            this.uploadedFiles = {}; // Clear uploaded files
            console.log('Form submitted successfully!');
          } else {
            this.snackBar.open('❌ Error submitting application. Please try again.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error submitting application:', error);
          this.snackBar.open('❌ Error submitting application. Please check your connection and try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
      */
    } else {
      console.log('Form is invalid, marking fields as touched');
      this.markFormGroupTouched(this.admissionForm);
      this.snackBar.open('⚠️ Please fill in all required fields correctly.', 'Close', {
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

  // File upload methods
  onFileSelected(event: any, fileType: string): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('File size must be less than 10MB', 'Close', { duration: 3000 });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        this.snackBar.open('Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files.', 'Close', { duration: 3000 });
        return;
      }
      
      this.uploadedFiles[fileType] = file;
      this.snackBar.open(`${file.name} uploaded successfully!`, 'Close', { duration: 2000 });
    }
  }

  getUploadedFilesCount(): number {
    return Object.keys(this.uploadedFiles).length;
  }

  removeFile(fileType: string): void {
    delete this.uploadedFiles[fileType];
    this.snackBar.open('File removed', 'Close', { duration: 2000 });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.admissionForm.controls).forEach(key => {
      const control = this.admissionForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
