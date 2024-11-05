import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private apiUrl = 'https://test.ahleldaraeb.com';

  userToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >((typeof window !== 'undefined' && localStorage.getItem('user')) || null);

  // private userNameSubject = new BehaviorSubject<string | null>(null);
  // userName$ = this.userNameSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  http = inject(HttpClient);
  constructor() {}

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
    return this.http.post<any>(`${this.apiUrl}/user/login`, loginData).pipe(
      tap((response: any) => {
        // const fullName = response.user.name;
        // const firstName = fullName.split(' ')[0]; // Extract the first word
        // this.userNameSubject.next(firstName); // Store the first name

        const fullName = response.user.name;
        const firstName = fullName.split(' ')[0]; // Extract the first word of the name
        const token = response.token; // Assuming the token is provided in the response
        // const expirationTime = response.expiration_time * 60 * 1000; // Convert from minutes to milliseconds

        // Store the token in local storage
        if (token) {
          localStorage.setItem('user', token);
          this.userToken.next(token); // Update the BehaviorSubject
          // localStorage.setItem('expiration_time', expirationTime.toString()); // Convert to string

          // Update the user's first name
          this.userNameSubject.next(firstName);

          // Calculate the delay until token expiration
          // const currentTime = Date.now();
          // const expirationDelay = expirationTime - currentTime;

          // if (expirationDelay > 0) {
          // setTimeout(() => this.logout(), expirationDelay);
          // } else {
          // this.logout(); // Logout immediately if the expiration time has passed
        }
      }),
    );
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

  getUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.getAuthUserHeaders(),
    });
  }
  logout(): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/user/logout`,
        {},
        {
          headers: this.getAuthUserHeaders(),
        },
      )
      .pipe(
        tap(() => {
          console.log('Logout successful, clearing localStorage');
          localStorage.removeItem('user');
          localStorage.removeItem('expiration_timee');
          this.userToken.next(null);
          this.userNameSubject.next(null);
        }),
        catchError((error) => {
          console.error('Logout error:', error); // Log the error
          return throwError(error); // Return the error to the subscriber
        }),
      );
  }
}
