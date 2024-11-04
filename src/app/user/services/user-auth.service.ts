import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  userToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >((typeof window !== 'undefined' && localStorage.getItem('user')) || null);

  http = inject(HttpClient);
  constructor() {}

  private apiUrl = 'https://test.ahleldaraeb.com';

  getAuthUserHeaders(): HttpHeaders {
    const userToken = this.getToken();
    console.log(userToken);

    let headers = new HttpHeaders();
    if (userToken) {
      headers = headers.set('Authorization', `Bearer ${userToken}`);
    }
    return headers;
  }

  registerUser(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register`, registerData);
  }

  loginUser(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, loginData);
  }

  // After login, call this method to set the token
  setToken(token: string): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('user', token);
      this.userToken.next(token); // Update the BehaviorSubject
    }
  }

  getToken(): string | null {
    return this.userToken.getValue(); // Access current token value
  }

  verifyEmail(userToken: any, auth_url: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userToken}`,
    });

    const requestOptions = {
      headers: headers,
    };

    return this.http.get<any>(`${auth_url}`, requestOptions);
  }

  logout(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/user/logout`,
      {},
      {
        headers: this.getAuthUserHeaders(),
      },
    );
  }
}
