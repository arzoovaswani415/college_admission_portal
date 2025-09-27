import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdmissionService, Admission, AdmissionStats } from '../../services/admission.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'course', 'status', 'applicationDate', 'actions'];
  dataSource = new MatTableDataSource<Admission>([]);
  stats: AdmissionStats | null = null;
  isLoading = false;
  selectedStatus = 'All';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private admissionService: AdmissionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAdmissions();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAdmissions(): void {
    this.isLoading = true;
    this.admissionService.getAllAdmissions().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.dataSource.data = response.data;
          this.applyFilter();
        } else {
          this.snackBar.open('Error loading admissions', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading admissions:', error);
        this.snackBar.open('Error loading admissions', 'Close', { duration: 3000 });
      }
    });
  }

  loadStats(): void {
    this.admissionService.getAdmissionStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response;
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.selectedStatus === 'All' ? '' : this.selectedStatus.trim().toLowerCase();
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  updateAdmissionStatus(admission: Admission, newStatus: string): void {
    const reviewNotes = prompt('Enter review notes (optional):');
    const reviewedBy = prompt('Enter your name:');
    
    this.admissionService.updateAdmissionStatus(
      admission._id!, 
      newStatus, 
      reviewNotes || undefined, 
      reviewedBy || undefined
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Admission status updated successfully', 'Close', { duration: 3000 });
          this.loadAdmissions();
          this.loadStats();
        } else {
          this.snackBar.open('Error updating status', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.snackBar.open('Error updating status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteAdmission(admission: Admission): void {
    if (confirm(`Are you sure you want to delete the application for ${admission.personalInfo.firstName} ${admission.personalInfo.lastName}?`)) {
      this.admissionService.deleteAdmission(admission._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Admission deleted successfully', 'Close', { duration: 3000 });
            this.loadAdmissions();
            this.loadStats();
          } else {
            this.snackBar.open('Error deleting admission', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Error deleting admission:', error);
          this.snackBar.open('Error deleting admission', 'Close', { duration: 3000 });
        }
      });
    }
  }

  viewAdmissionDetails(admission: Admission): void {
    // This would open a dialog with detailed information
    const details = `
      Name: ${admission.personalInfo.firstName} ${admission.personalInfo.lastName}
      Email: ${admission.personalInfo.email}
      Phone: ${admission.personalInfo.phone}
      Course: ${admission.academicInfo.course}
      Status: ${admission.status}
      Application Date: ${new Date(admission.applicationDate!).toLocaleDateString()}
      Previous Education: ${admission.academicInfo.previousEducation}
    `;
    
    alert(details);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Accepted': return 'accent';
      case 'Rejected': return 'warn';
      case 'Under Review': return 'primary';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Accepted': return 'check_circle';
      case 'Rejected': return 'cancel';
      case 'Under Review': return 'schedule';
      default: return 'help';
    }
  }

  getFullName(admission: Admission): string {
    return `${admission.personalInfo.firstName} ${admission.personalInfo.lastName}`;
  }

  getFormattedDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
