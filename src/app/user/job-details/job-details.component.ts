import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../../admin/interfaces/admin.interface';
import { CareersService } from '../services/careers.service';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { TitleCasePipe } from '@angular/common';
import { EmailResumeComponent } from '../email-resume/email-resume.component';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    ButtonModule,
    LoadingSpinnerComponent,
    TitleCasePipe,
    EmailResumeComponent,
  ],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css',
})
export class JobDetailsComponent implements OnInit {
  id!: number;
  job!: Job;
  errorMessage: string | null = null;
  isLoading: boolean = true;

  careersService = inject(CareersService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('ATC Careers');
    this.fetchJobDetails();
  }

  fetchJobDetails() {
    this.route.params.subscribe((params) => {
      this.id = parseInt(params['id'], 10);
      if (isNaN(this.id)) {
        this.errorMessage = 'Invalid job ID provided.';
        this.isLoading = false;
        return;
      }
      this.careersService.fetchSingleJob(this.id).subscribe({
        next: (res) => {
          this.job = res.job;
          // console.log(res.job);
          this.isLoading = false;
        },
        error: (error) => {
          // console.log(error);

          error.error.error === 'Job not found'
            ? (this.errorMessage = error.error.error + '.')
            : (this.errorMessage =
                'Unable to fetch job details. Please try again later.');

          this.isLoading = false;
        },
      });
    });
  }

  applyForJob() {
    // Navigate to an application form or trigger an application action
    this.router.navigate(['/jobs/apply/', this.job.id]);
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  formatDepartment(department: string): string {
    return department.replace(/_/g, ' ');
  }
}
