import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { JobsService } from '../services/jobs.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-job-applicants',
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
    LoadingSpinnerComponent,
    TopbarComponent,
    DropdownModule,
    TooltipModule,
    ReactiveFormsModule,
    FormsModule,

    DialogModule,
  ],
  providers: [ConfirmationService, MessageService],

  templateUrl: './job-applicants.component.html',
  styleUrl: './job-applicants.component.css',
})
export class JobApplicantsComponent implements OnInit {
  applicants!: any[];
  applicantsPerPage: number = 10;
  currentPage: number = 1;
  totalApplicants: number = 0;
  loading: boolean = true;
  jobId!: number;
  jobTitle: string = '';
  applicantEmail: string = '';
  updateStatusForm!: FormGroup;

  first = 0;

  rows = 10;

  status_array = ['applied', 'in_process', 'accepted', 'rejected'];
  statusOptions!: string[];

  showStatusUpdateDialog = false;

  confirmationService = inject(ConfirmationService);
  dialogService = inject(DialogModule);
  messageService = inject(MessageService);
  jobsService = inject(JobsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  userId: string = '';

  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('ATC Careers');

    this.fetchApplicants();
    this.loading = false;

    this.updateStatusForm = new FormGroup({
      status: new FormControl('', Validators.required),
    });
  }

  fetchApplicants() {
    this.route.params.subscribe((params) => {
      this.jobId = parseInt(params['id'], 10);
      if (isNaN(this.jobId)) {
        this.loading = false;
        return;
      }

      this.jobsService.getApplicants(this.jobId).subscribe({
        next: (response) => {
          this.loading = false;
          console.log(response);
          this.jobTitle = response.job_title;

          this.applicants = response.applicants;
          // this.totalJobs = response.total;
        },
        error: (err) => {
          this.loading = false;
          console.log(err);
        },
      });
    });
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.applicants
      ? this.first === this.applicants.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.applicants ? this.first === 0 : true;
  }

  // updateStatus(jobId: number, status: string) {
  //   this.confirmationService.confirm({
  //     target: event.target as EventTarget,
  //     message: 'Do you want to archive this job?',
  //     header: 'Confirmation',
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptIcon: 'none',
  //     rejectIcon: 'none',
  //     rejectButtonStyleClass: 'p-button-text',
  //     accept: () => {
  //       this.jobsService.toggleArchiveJob(jobId).subscribe({
  //         next: (response) => {
  //           console.log(response);
  //           this.messageService.add({
  //             severity: 'info',
  //             summary: 'Confirmed',
  //             detail: `Job archived successfully`,
  //           });
  //         },
  //         error: (err) => {
  //           console.log(err);
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: 'Failed to archived job',
  //           });
  //         },
  //       });
  //     },
  //     reject: () => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Rejected',
  //         detail: 'You have rejected',
  //         life: 3000,
  //       });
  //     },
  //   });
  // }

  openStatusUpdateDialog(
    jobId: number,
    applicantEmail: string,
    currentStatus: string,
  ) {
    this.jobId = jobId;
    this.applicantEmail = applicantEmail;

    // Define the available status options
    this.statusOptions = ['applied', 'screening', 'accepted', 'rejected'];

    // Create a form group for the update status form
    this.updateStatusForm.patchValue({
      status: currentStatus,
    });

    this.showStatusUpdateDialog = true;
  }
  updateStatus() {
    if (this.updateStatusForm.valid) {
      const newStatus = this.updateStatusForm.controls['status'].value;
      // console.log(this.jobId);
      // console.log(this.applicantEmail);
      // console.log(newStatus);
      this.jobsService
        .updateApplicantStatus(this.jobId, this.applicantEmail, newStatus)
        .subscribe({
          next: (response) => {
            this.fetchApplicants();
            // console.log(response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Job status updated to ${newStatus}`,
            });
            this.showStatusUpdateDialog = false;
          },
          error: (err) => {
            // console.log(err);

            // console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update job status',
            });
          },
        });
    }
  }
}
