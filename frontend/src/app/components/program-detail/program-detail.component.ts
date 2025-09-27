import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService, Program } from '../../services/program.service';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {
  program: Program | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const programId = params['id'];
      this.program = this.programService.getProgramById(programId);
      this.isLoading = false;
      
      if (!this.program) {
        this.router.navigate(['/home']);
      }
    });
  }

  navigateToApplication(): void {
    this.router.navigate(['/apply']);
  }

  navigateBack(): void {
    this.router.navigate(['/home']);
  }

  getFormattedTuition(): string {
    if (!this.program) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(this.program.tuition);
  }
}