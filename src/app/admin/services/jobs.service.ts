import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  http = inject(HttpClient);

  private apiUrl = 'https://test.ahleldaraeb.com';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    console.log(token);

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  createJob(jobData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs`, jobData, {
      headers: this.getAuthHeaders(),
    });
  }

  getPaginatedJobs(jobsPerPage: number, pageNum: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/jobs/paginate/${jobsPerPage}?page=${pageNum}`,
    );
  }

  getPaginatedArchivedJobs(
    jobsPerPage: number,
    pageNum: number,
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/admin/jobs/archived/${jobsPerPage}?page=${pageNum}`,
    );
  }

  getSingleJob(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateJob(id: number, jobData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/jobs/${id}`, jobData, {
      headers: this.getAuthHeaders(),
    });
  }
  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jobs/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  toggleArchiveJob(id: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/jobs/${id}/toggle-archived`,
      {},
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  cities: string[] = [
    'Alexandria, Egypt',
    'Al Khobar, Saudi Arabia',
    'Cairo, Egypt',
    'Dubai, United Arab Emirates',
    'Giza, Egypt',
    'Jeddah, Saudi Arabia',
    'Makkah, Saudi Arabia',
    'Riyadh, Saudi Arabia',
  ];

  yearsOfExperience: { label: string; value: string }[] = [
    { label: '0 - 2 years', value: '0 - 2 ' },
    { label: '2 - 4 years', value: '2 - 4' },
    { label: '4 - 6 years', value: '4 - 6' },
    { label: '6 - 8 years', value: '6 - 8' },
    { label: '8 - 10 years', value: '8 - 10' },
    { label: '10+ years', value: '10+' },
  ];

  departments: string[] = ['Taxing', 'Accounting', 'Auditing', 'HR', 'Vat'];
}
