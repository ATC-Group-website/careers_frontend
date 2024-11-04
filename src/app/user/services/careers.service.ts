import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CareersService {
  http = inject(HttpClient);

  private apiUrl = 'https://test.ahleldaraeb.com';

  constructor() {}

  // getCurrentJobs(jobsPerPage: number, pageNum: number): Observable<any> {
  //   return this.http.get(
  //     `${this.apiUrl}/jobs/paginate/${jobsPerPage}?page=${pageNum}`,
  //   );
  // }

  fetchJobs(
    pageNum: number,
    term: string,
    location: string,
    department: string,
    years: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', pageNum)
      .set('title', term)
      .set('location', location)
      .set('department', department)
      .set('years', years);
    return this.http.get(`${this.apiUrl}/post/search`, { params });
  }

  fetchSingleJob(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/${id}`);
  }

  applyAsGuest(formData: any, id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply/${id}`, formData);
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
    { label: '0 - 2 years', value: '0 - 2 ' },
    { label: '2 - 4 years', value: '2 - 4' },
    { label: '4 - 6 years', value: '4 - 6' },
    { label: '6 - 8 years', value: '6 - 8' },
    { label: '8 - 10 years', value: '8 - 10' },
    { label: '10+ years', value: '10+' },
  ];

  departments: { label: string; value: string }[] = [
    { label: 'All Departments', value: '' }, // Add this option for clearing the filter
    { label: 'Auditing', value: 'Auditing' },
    { label: 'Taxation', value: 'Taxation' },
    { label: 'Vat', value: 'Vat' },
    { label: 'HR', value: 'HR' },
    { label: 'Managerial', value: 'managerial' },
    { label: 'Accounting', value: 'Accounting' },
  ];
}
