import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { Meta, Title } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { JobsService } from '../services/jobs.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TopbarComponent, CardModule, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  jobsService = inject(JobsService);
  router = inject(Router);

  users_count!: number;
  archived_jobs_count!: number;
  live_jobs_count!: number;

  constructor(
    private title: Title,
    private meta: Meta,
  ) {
    this.title.setTitle('ATC Careers');
  }

  ngOnInit(): void {
    this.fetchDataCount();
  }

  fetchDataCount() {
    this.jobsService.getActiveJobsCount().subscribe({
      next: (res) => {
        // console.log(res);
        this.live_jobs_count = res;
      },
      error: (err) => {
        // console.log(err);
      },
    });
    this.jobsService.getArchivedJobsCount().subscribe({
      next: (res) => {
        // console.log(res);
        this.archived_jobs_count = res;
      },
      error: (err) => {
        // console.log(err);
      },
    });
    this.jobsService.getAllUsersCount().subscribe({
      next: (res) => {
        // console.log(res);
        this.users_count = res;
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }
}
