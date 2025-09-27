import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Admission {
  _id?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  academicInfo: {
    course: string;
    previousEducation: string;
    gpa?: number;
  };
  documents?: {
    resume?: string;
    transcript?: string;
    recommendationLetter?: string;
    other?: string;
  };
  status?: string;
  applicationDate?: Date;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewDate?: Date;
}

export interface AdmissionResponse {
  success: boolean;
  message?: string;
  data?: Admission;
  count?: number;
  errors?: any[];
}

export interface AdmissionStats {
  success: boolean;
  data: {
    totalApplications: number;
    statusBreakdown: Array<{
      _id: string;
      count: number;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Get all admissions
  getAllAdmissions(): Observable<{ success: boolean; data: Admission[]; count: number }> {
    return this.http.get<{ success: boolean; data: Admission[]; count: number }>(`${this.apiUrl}/admissions`);
  }

  // Get admission by ID
  getAdmissionById(id: string): Observable<AdmissionResponse> {
    return this.http.get<AdmissionResponse>(`${this.apiUrl}/admissions/${id}`);
  }

  // Create new admission
  createAdmission(admission: Admission): Observable<AdmissionResponse> {
    return this.http.post<AdmissionResponse>(`${this.apiUrl}/admissions`, admission);
  }

  // Update admission status
  updateAdmissionStatus(id: string, status: string, reviewNotes?: string, reviewedBy?: string): Observable<AdmissionResponse> {
    return this.http.put<AdmissionResponse>(`${this.apiUrl}/admissions/${id}/status`, {
      status,
      reviewNotes,
      reviewedBy
    });
  }

  // Delete admission
  deleteAdmission(id: string): Observable<AdmissionResponse> {
    return this.http.delete<AdmissionResponse>(`${this.apiUrl}/admissions/${id}`);
  }

  // Get admission statistics
  getAdmissionStats(): Observable<AdmissionStats> {
    return this.http.get<AdmissionStats>(`${this.apiUrl}/admissions/stats`);
  }

  // Health check
  healthCheck(): Observable<{ success: boolean; message: string; timestamp: string }> {
    return this.http.get<{ success: boolean; message: string; timestamp: string }>(`${this.apiUrl}/health`);
  }
}
