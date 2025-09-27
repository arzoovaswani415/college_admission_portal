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
}
