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

@Component({
  selector: 'app-jobs',
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
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
})
export class JobsComponent implements OnInit {
  jobs!: Job[];
  jobsPerPage: number = 10; // Number of jobs per page
  currentPage: number = 1; // Track the current page
  totalJobs: number = 0; // Total number of jobs from the API
  loading: boolean = true;

  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  jobsService = inject(JobsService);
  router = inject(Router);

  ngOnInit(): void {
    this.fetchJobs(this.currentPage);
    this.loading = false;
  }

  fetchJobs(pageNum: number) {
    this.jobsService.getPaginatedJobs(this.jobsPerPage, pageNum).subscribe({
      next: (response) => {
        this.loading = false;
        console.log(response);

        this.jobs = response.data;
        this.totalJobs = response.total;
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.first / this.jobsPerPage + 1;
    // Update current page (PrimeNG pages start from 0)

    this.fetchJobs(this.currentPage); // Fetch jobs for the new page
  }

  confirmArchive(event: Event, jobId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to archive this job?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.jobsService.toggleArchiveJob(jobId).subscribe({
          next: (response) => {
            console.log(response);
            this.fetchJobs(this.currentPage);
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: `Job archived successfully`,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to archived job',
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

  // confirmDelete(event: Event, jobId: number) {
  //   this.confirmationService.confirm({
  //     target: event.target as EventTarget,
  //     message: 'Do you want to delete this job?',
  //     header: 'Delete Confirmation',
  //     icon: 'pi pi-info-circle',
  //     acceptButtonStyleClass: 'p-button-danger p-button-text',
  //     rejectButtonStyleClass: 'p-button-text p-button-text',
  //     acceptIcon: 'none',
  //     rejectIcon: 'none',

  //     accept: () => {
  //       // Call the deleteJob method and subscribe to handle the response
  //       this.jobsService.deleteJob(jobId).subscribe({
  //         next: (response) => {
  //           console.log(response);
  //           this.fetchJobs(this.currentPage);
  //           this.messageService.add({
  //             severity: 'info',
  //             summary: 'Confirmed',
  //             detail: `Job deleted successfully`,
  //           });
  //         },
  //         error: (err) => {
  //           console.log(err);
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: 'Failed to delete job',
  //           });
  //         },
  //       });
  //     },
  //     reject: () => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Rejected',
  //         detail: 'You have rejected',
  //       });
  //     },
  //   });
  // }

  navigateToDetails(id: number) {
    this.router.navigateByUrl(`/admin/dashboard/jobs/${id}`);
  }
}
