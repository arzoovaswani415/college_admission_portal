import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgramService, Scholarship } from '../../services/program.service';

@Component({
  selector: 'app-scholarships',
  templateUrl: './scholarships.component.html',
  styleUrls: ['./scholarships.component.css']
})
export class ScholarshipsComponent implements OnInit {
  scholarships: Scholarship[] = [];
  filteredScholarships: Scholarship[] = [];
  selectedType: string = 'all';
  isLoading = true;

  scholarshipTypes = [
    { value: 'all', label: 'All Scholarships', icon: 'school' },
    { value: 'merit-based', label: 'Merit-Based', icon: 'emoji_events' },
    { value: 'need-based', label: 'Need-Based', icon: 'support' },
    { value: 'sports', label: 'Athletic', icon: 'sports' },
    { value: 'international', label: 'International', icon: 'public' },
    { value: 'academic', label: 'Academic', icon: 'psychology' }
  ];

  constructor(
    private programService: ProgramService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadScholarships();
  }

  loadScholarships(): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.scholarships = this.programService.getAllScholarships();
      this.filteredScholarships = this.scholarships;
      this.isLoading = false;
    }, 1000);
  }

  filterByType(type: string): void {
    this.selectedType = type;
    if (type === 'all') {
      this.filteredScholarships = this.scholarships;
    } else {
      this.filteredScholarships = this.scholarships.filter(
        scholarship => scholarship.type === type
      );
    }
  }

  navigateToApplication(): void {
    this.router.navigate(['/apply']);
  }

  getScholarshipTypeIcon(type: string): string {
    const typeConfig = this.scholarshipTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : 'school';
  }

  getScholarshipTypeLabel(type: string): string {
    const typeConfig = this.scholarshipTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.label : type;
  }

  getScholarshipTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'merit-based': 'var(--primary-gold)',
      'need-based': 'var(--secondary-green)',
      'sports': 'var(--accent-blue)',
      'international': 'var(--primary-navy)',
      'academic': 'var(--primary-light)',
      'minority': 'var(--secondary-light-green)'
    };
    return colors[type] || 'var(--gray-500)';
  }
}