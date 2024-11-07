import { Job } from './../interfaces/admin.interface';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { JobsService } from '../services/jobs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    EditorModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    RippleModule,
    LoadingSpinnerComponent,
    TopbarComponent,
  ],
  providers: [MessageService],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css',
})
export class JobDetailsComponent implements OnInit {
  messageService = inject(MessageService);
  jobsService = inject(JobsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  job!: Job;
  id!: number;

  cities: any[] | undefined;
  years: any[] | undefined;
  departments: any[] | undefined;
  updateJobForm!: FormGroup;
  formGroup: FormGroup | undefined;
  isLoading: boolean = false;

  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('ATC Careers');

    this.fetchJobDetails();
    // Change the array to strings
    this.cities = this.jobsService.cities;
    this.departments = this.jobsService.departments;

    this.years = this.jobsService.yearsOfExperience;

    this.updateJobForm = new FormGroup({
      title: new FormControl('', Validators.required),
      years: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
    });
  }

  fetchJobDetails() {
    this.route.params.subscribe((params) => {
      this.id = parseInt(params['id'], 10);
      if (isNaN(this.id)) {
        this.isLoading = false;
        return;
      }

      this.jobsService.getSingleJob(this.id).subscribe({
        next: (res) => {
          this.job = res.job;
          console.log(res);

          this.updateJobForm.patchValue({
            title: this.job.title,
            department: this.job.department,
            location: this.job.location,
            years: this.job.years,
            description: this.job.description,
          });

          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        },
      });
    });
  }

  onSubmit() {
    if (this.updateJobForm.valid) {
      this.isLoading = true;

      const jobData = this.updateJobForm.value;
      console.log('Job Updated:', jobData);

      this.jobsService.updateJob(this.id, jobData).subscribe({
        next: (res) => {
          console.log(res);
          this.fetchJobDetails();

          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'Job updated successfully',
          });
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard/jobs']); // Replace '/jobs' with the desired route
          }, 1500); // Delay in milliseconds (2 seconds)
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating job:', error);
          if ((error.status = 401)) {
            sessionStorage.removeItem('token');
            this.router.navigateByUrl('admin/login');
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update job. Please try again.',
          });
        },
      });

      // Add logic here to send `jobData` to the backend
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check all required fields',
      });
    }
  }
}
