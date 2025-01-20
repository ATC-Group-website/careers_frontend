import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  http = inject(HttpClient);

  // private apiUrl = 'https://jobs.api.atc.com.eg';
  private apiUrl = 'https://careers.api.atcprotraining.com';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    // console.log(token);

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

  getApplicants(jobId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/${jobId}/users`, {
      headers: this.getAuthHeaders(),
    });
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

  updateApplicantStatus(
    jobId: number,
    email: string,
    statusValue: string,
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/jobs/${jobId}/status`,
      {
        status: statusValue,
        email: email,
      },
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  getActiveJobsCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/jobs/live/count`, {
      headers: this.getAuthHeaders(),
    });
  }

  getArchivedJobsCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/archived/count`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllUsersCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/count`, {
      headers: this.getAuthHeaders(),
    });
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
    { label: 'No experience', value: 'No experience' },
    { label: '0 - 2 years', value: '0 - 2 years' },
    { label: '2 - 4 years', value: '2 - 4 years' },
    { label: '4 - 6 years', value: '4 - 6 years' },
    { label: '6 - 8 years', value: '6 - 8 years' },
    { label: '8 - 10 years', value: '8 - 10 years' },
    { label: '10+ years', value: '10+ years' },
  ];

  departments: { label: string; value: string }[] = [
    { label: 'Audit', value: 'audit' },
    { label: 'Bookkeeping', value: 'bookkeeping' },

    { label: 'Corporate Tax', value: 'corporate_tax' },
    { label: 'Development', value: 'development' },
    { label: 'Financial Management', value: 'financial_management' },
    { label: 'HR', value: 'HR' },
    { label: 'Insurance', value: 'insurance' },
    { label: 'International Taxation', value: 'international_taxation' },
    {
      label: 'Investment & Company Incorporation',
      value: 'Investment_and_company_incorporation',
    },
    { label: 'IT', value: 'it' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Payroll', value: 'payroll' },
    { label: 'Sales', value: 'sales' },
    { label: 'Stamp Tax', value: 'stamp_tax' },
    { label: 'Translation', value: 'translation' },
    { label: 'Value Added Tax (VAT)', value: 'vat' },
  ];
}
