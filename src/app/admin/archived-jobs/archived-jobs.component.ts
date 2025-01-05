import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Job } from '../interfaces/admin.interface';
import { Router, RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { JobsService } from '../services/jobs.service';
import { TopbarComponent } from '../topbar/topbar.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-archived-jobs',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    TooltipModule,
    InputTextModule,
    TopbarComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './archived-jobs.component.html',
  styleUrl: './archived-jobs.component.css',
})
export class ArchivedJobsComponent implements OnInit {
  archivedJobs!: Job[];
  jobsPerPage: number = 10; // Number of jobs per page
  currentPage: number = 1; // Track the current page
  totalJobs: number = 0; // Total number of jobs from the API
  loading: boolean = true;

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  jobsService = inject(JobsService);
  router = inject(Router);

  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('ATC Careers');
    this.fetchArchivedJobs(this.currentPage);
    this.loading = false;
  }

  fetchArchivedJobs(pageNum: number) {
    this.jobsService
      .getPaginatedArchivedJobs(this.jobsPerPage, pageNum)
      .subscribe({
        next: (response) => {
          this.loading = false;
          // console.log(response);

          this.archivedJobs = response.data;
          this.totalJobs = response.total;
        },
        error: (err) => {
          this.loading = false;
          // console.log(err);
        },
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.first / this.jobsPerPage + 1;
    // Update current page (PrimeNG pages start from 0)

    this.fetchArchivedJobs(this.currentPage); // Fetch jobs for the new page
  }

  confirmArchive(event: Event, jobId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to publish this job?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.jobsService.toggleArchiveJob(jobId).subscribe({
          next: (response) => {
            // console.log(response);
            this.fetchArchivedJobs(this.currentPage);
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: `Job published successfully`,
            });
          },
          error: (err) => {
            // console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to publish job',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  confirmDelete(event: Event, jobId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this job?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        // Call the deleteJob method and subscribe to handle the response
        this.jobsService.deleteJob(jobId).subscribe({
          next: (response) => {
            this.fetchArchivedJobs(this.currentPage);
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: `Job deleted successfully`,
            });
          },
          error: (err) => {
            // console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete job',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  navigateToDetails(id: number) {
    this.router.navigateByUrl(`/admin/dashboard/jobs/${id}`);
  }

  formatDepartment(department: string): string {
    return department.replace(/_/g, ' ');
  }
}
