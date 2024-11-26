import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class CareersService {
  http = inject(HttpClient);
  userAuth = inject(UserAuthService);

  private apiUrl = 'https://test.ahleldaraeb.com';

  constructor() {}

  // getCurrentJobs(jobsPerPage: number, pageNum: number): Observable<any> {
  //   return this.http.get(
  //     `${this.apiUrl}/jobs/paginate/${jobsPerPage}?page=${pageNum}`,
  //   );
  // }

  // fetchJobs(
  //   pageNum: number | null,
  //   term: string | null,
  //   location: string | null,
  //   department: string | null,
  //   years: string | null,
  // ): Observable<any> {
  //   let params = new HttpParams()
  //     .set('page', pageNum)
  //     .set('title', term)
  //     .set('location', location)
  //     .set('department', department)
  //     .set('years', years);
  //   return this.http.get(`${this.apiUrl}/post/search`, { params });
  // }

  fetchJobs(
    pageNum: number | null,
    term: string | null,
    location: string | null,
    department: string | null,
    years: string | null,
  ): Observable<any> {
    let params = new HttpParams();

    if (pageNum !== null) {
      params = params.set('page', pageNum);
    }
    if (term) {
      params = params.set('title', term);
    }
    if (location) {
      params = params.set('location', location);
    }
    if (department) {
      params = params.set('department', department);
    }
    if (years) {
      params = params.set('years', years);
    }

    return this.http.get(`${this.apiUrl}/post/search`, { params });
  }

  fetchSingleJob(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/${id}`);
  }

  applyAsGuest(formData: any, jobId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply/${jobId}`, formData);
  }

  applyAsUser(formData: any, jobId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply/${jobId}`, formData, {
      headers: this.userAuth.getAuthUserHeaders(),
    });
  }

  locations: { label: string; value: string }[] = [
    { label: 'All Locations', value: '' }, // Option to clear filter
    { label: 'Alexandria, Egypt', value: 'Alexandria, Egypt' },
    { label: 'Al Khobar, Saudi Arabia', value: 'Al Khobar, Saudi Arabia' },
    { label: 'Cairo, Egypt', value: 'Cairo, Egypt' },
    {
      label: 'Dubai, United Arab Emirates',
      value: 'Dubai, United Arab Emirates',
    },
    { label: 'Giza, Egypt', value: 'Giza, Egypt' },
    { label: 'Jeddah, Saudi Arabia', value: 'Jeddah, Saudi Arabia' },
    { label: 'Makkah, Saudi Arabia', value: 'Makkah, Saudi Arabia' },
    { label: 'Riyadh, Saudi Arabia', value: 'Riyadh, Saudi Arabia' },
  ];

  yearsOfExperience: { label: string; value: string }[] = [
    { label: 'All Experience Levels', value: '' },
    { label: 'No experience', value: 'No experience' },
    { label: '0 - 2 years', value: '0 - 2 years' },
    { label: '2 - 4 years', value: '2 - 4 years' },
    { label: '4 - 6 years', value: '4 - 6 years' },
    { label: '6 - 8 years', value: '6 - 8 years' },
    { label: '8 - 10 years', value: '8 - 10 years' },
    { label: '10+ years', value: '10+ years' },
  ];

  departments: { label: string; value: string }[] = [
    { label: 'All Departments', value: '' }, // Add this option for clearing the filter
    { label: 'Audit', value: 'audit' },
    { label: 'Bookkeeping', value: 'bookkeeping' },
    { label: 'Corporate Tax', value: 'corporate_tax' },
    { label: 'Development', value: 'development' },
    { label: 'Financial Management', value: 'financial_management' },
    { label: 'HR', value: 'HR' },
    { label: 'Insurance', value: 'insurance' },
    { label: 'International Taxation', value: 'international_taxation' },
    { label: 'IT', value: 'it' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Payroll', value: 'payroll' },
    { label: 'Sales', value: 'sales' },
    { label: 'Stamp Tax', value: 'stamp_tax' },
    { label: 'Value Added Tax (VAT)', value: 'vat' },
  ];
}
