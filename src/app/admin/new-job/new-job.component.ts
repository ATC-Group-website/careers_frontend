import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { JobsService } from '../services/jobs.service';
import { TopbarComponent } from "../topbar/topbar.component";

@Component({
  selector: 'app-new-job',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    EditorModule,
    ToastModule,
    ButtonModule,
    TopbarComponent
],
  providers: [MessageService],
  templateUrl: './new-job.component.html',
  styleUrl: './new-job.component.css',
})
export class NewJobComponent implements OnInit {
  messageService = inject(MessageService);
  jobsService = inject(JobsService);

  cities: any[] | undefined;
  years: any[] | undefined;
  departments: any[] | undefined;
  newJobForm!: FormGroup;
  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.cities = this.jobsService.cities;
    this.departments = this.jobsService.departments;
    this.years = this.jobsService.yearsOfExperience;

    this.newJobForm = new FormGroup({
      title: new FormControl('', Validators.required),
      years: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.newJobForm.valid) {
      this.isLoading = true;
      const jobData = this.newJobForm.value;
      // console.log('Job Posted:', jobData);

      this.jobsService.createJob(jobData).subscribe({
        next: (res) => {
          // console.log(res);
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'Job posted successfully',
          });
          this.newJobForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error posting job:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to post job. Please try again.',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check all required fields',
      });
    }
  }
}
