import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AdminInterface, Job, LoginData } from '../interfaces/admin.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobsService } from './jobs.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  constructor() {}

  http = inject(HttpClient);
  jobsService = inject(JobsService);

  private apiUrl = 'https://test.ahleldaraeb.com';

  // Initialize BehaviorSubject with token from sessionStorage if available
  adminToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >((typeof window !== 'undefined' && sessionStorage.getItem('token')) || null);

  // // sending admintoken in request header
  // private getRequestOptions(adminToken: string): { headers: HttpHeaders } {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${adminToken}`,
  //   });
  //   return { headers: headers };
  // }

  // Simulate a logged-in state

  login(loginData: LoginData): Observable<AdminInterface> {
    return this.http.post<AdminInterface>(
      `${this.apiUrl}/admin/login`,
      loginData,
    );
  }

  // After login, call this method to set the token
  setToken(token: string): void {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      sessionStorage.setItem('token', token);
      this.adminToken.next(token); // Update the BehaviorSubject
    }
  }

  getToken(): string | null {
    return this.adminToken.getValue(); // Access current token value
  }

  logout(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/admin/logout`,
      {},
      {
        headers: this.jobsService.getAuthHeaders(),
      },
    );
  }

  // old add new job
  // addNewJob(formData: Job): Observable<any> {
  //   const token = localStorage.getItem('token');

  //   const headers = token
  //     ? new HttpHeaders({ Authorization: `Bearer ${token}` })
  //     : new HttpHeaders();

  //   return this.http.post<any>(`${this.apiUrl}/job`, formData, { headers });
  // }
}
