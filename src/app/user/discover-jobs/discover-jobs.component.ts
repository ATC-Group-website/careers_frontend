import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Job } from '../../admin/interfaces/admin.interface';
import { CareersService } from '../services/careers.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { combineLatest } from 'rxjs';
import { EmailResumeComponent } from '../email-resume/email-resume.component';
import { Meta, Title } from '@angular/platform-browser';
import { CapitalizeFirstPipe } from '../../pipes/capitalize-first.pipe';

@Component({
  selector: 'app-discover-jobs',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    TimeAgoPipe,
    TitleCasePipe,
    RouterModule,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    EmailResumeComponent,
    CapitalizeFirstPipe,
  ],
  templateUrl: './discover-jobs.component.html',
  styleUrl: './discover-jobs.component.css',
})
export class DiscoverJobsComponent implements OnInit {
  jobs: Job[] = [];
  currentPage: number = 1;
  careersService = inject(CareersService);

  locationsOptions = this.careersService.locations;
  yearsFilterOptions = this.careersService.yearsOfExperience;
  departmentsOptions = this.careersService.departments;

  isResetting: boolean = false;

  lastPage: number = 0;
  loading: boolean = false;
  noMoreJobs: boolean = false; // New property to track if all jobs have been loaded

  // Create a FormGroup for all filters
  filterForm = new FormGroup({
    search: new FormControl({ value: '', disabled: false }),
    location: new FormControl({ value: '', disabled: false }),
    departments: new FormControl({ value: '', disabled: false }),
    years: new FormControl({ value: '', disabled: false }),
  });

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private title: Title,
    private meta: Meta,
  ) {}
  ngOnInit(): void {
    this.title.setTitle('ATC Careers');

    this.meta.updateTag({
      name: 'description',
      content:
        'Explore current job openings at ATC Careers. Apply today to join our team and advance your career with exciting opportunities.',
    });

    this.setupSearch();
    this.setupFilters();
    this.getJobs();
  }

  setupSearch() {
    this.filterForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(50), distinctUntilChanged())
      .subscribe(() => {
        this.resetAndFetch();
        // console.log('setup search');
      });
  }

  setupFilters() {
    combineLatest([
      this.filterForm
        .get('location')!
        .valueChanges.pipe(debounceTime(0), distinctUntilChanged()),
      this.filterForm
        .get('departments')!
        .valueChanges.pipe(debounceTime(0), distinctUntilChanged()),
      this.filterForm
        .get('years')!
        .valueChanges.pipe(debounceTime(0), distinctUntilChanged()),
    ]).subscribe(() => {
      if (!this.isResetting) {
        this.resetAndFetch();
      }
    });
  }

  resetAndFetch() {
    this.jobs = [];
    this.currentPage = 1;
    this.noMoreJobs = false;
    this.getJobs();
  }

  clearFilters() {
    this.isResetting = true; // Set flag to true
    this.filterForm.reset(); // Reset form
    this.isResetting = false; // Set flag back to false
    this.resetAndFetch(); // Fetch data once after reset
  }

  getJobs() {
    if (this.loading) return;

    this.loading = true;
    // Disable all controls while loading
    // this.filterForm.disable();
    // console.log(this.filterForm);

    this.careersService
      .fetchJobs(
        this.currentPage,
        this.filterForm.get('search')?.value || '', // Use the current search value
        this.filterForm.get('location')?.value || '',
        this.filterForm.get('departments')?.value || '', // Fix here: changed 'department' to 'departments'
        this.filterForm.get('years')?.value || '',
      )
      .subscribe({
        next: (response) => {
          // console.log(response);
          // console.log('inside job fetch 1');

          this.loading = false;
          this.filterForm.enable(); // Re-enable controls after loading
          this.jobs =
            this.currentPage === 1 // Changed from 0 to 1 to ensure it resets on first page
              ? response.data
              : [...this.jobs, ...response.data];
          this.lastPage = response.last_page;
          this.noMoreJobs = this.currentPage >= this.lastPage;
        },
        error: (err) => {
          this.loading = false;
          this.filterForm.enable(); // Re-enable controls on error
          console.error(err);
        },
      });
  }

  onLoadMore(): void {
    if (this.currentPage < this.lastPage) {
      this.currentPage += 1;
      this.getJobs();
    } else {
      this.noMoreJobs = true;
    }
  }

  scrollToSection(): void {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      const element = document.getElementById('job-openings');
      if (element) {
        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;
        const offset = 0;

        window.scrollTo({
          top: elementPosition + offset,
          behavior: 'smooth',
        });
      }
    }
  }

  onSearch(event: any) {
    event.preventDefault(); // Prevent the default action (form submission)
    this.getJobs();
    // console.log('inside on search');
    // Call getJobs() to fetch results based on current filter values
  }

  formatDepartment(department: string): string {
    return department.replace(/_/g, ' ');
  }
}
