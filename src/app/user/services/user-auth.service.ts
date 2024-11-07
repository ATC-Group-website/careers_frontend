import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

interface AuthState {
  isLogged: boolean;
  userName: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private apiUrl = 'https://test.ahleldaraeb.com';

  private logoutTimer: any;
  private authState = new BehaviorSubject<AuthState>({
    isLogged: false,
    userName: null,
  });

  authState$ = this.authState.asObservable();

  userToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >((typeof window !== 'undefined' && localStorage.getItem('user')) || null);

  private userNameSubject = new BehaviorSubject<string | null>(
    (typeof window !== 'undefined' && localStorage.getItem('username')) || null,
  );

  userName$ = this.userNameSubject.asObservable();

  http = inject(HttpClient);
  router = inject(Router);
  constructor() {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('user');
      const expirationTime = localStorage.getItem('expiration_time');
      const userName = localStorage.getItem('username');

      if (token && expirationTime) {
        const expTime = Number(expirationTime) * 1000; // Convert expiration time to milliseconds
        const currentTime = Date.now();

        // console.log(expTime);
        // console.log(currentTime);

        if (currentTime < expTime) {
          // Token is still valid
          this.setAuthState(true, userName);
          this.userToken.next(token);
          this.userNameSubject.next(userName);

          // console.log(expTime - currentTime);

          // Set up auto-logout timer
          const timeUntilExpiry = expTime - currentTime; // Calculate the time until expiration
          // this.setAutoLogoutTimer(timeUntilExpiry);

          // console.log('Auth restored - Valid until:', new Date(expTime));
          // console.log('yes');
          // console.log('problem here in checkauth state');
        } else {
          // Token has expired
          // console.log('Token expired - logging out ');
          // console.log('no');

          this.logoutUser();
        }
      }
    }
  }

  private setAuthState(isLogged: boolean, userName: string | null): void {
    this.authState.next({
      isLogged,
      userName,
    });
  }

  private setAutoLogoutTimer(duration: number): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.logoutTimer = setTimeout(() => {
      // console.log('Token expired - auto logout in the function');
      this.logoutUser();
    }, duration);
  }

  loginuser(userData: {
    token: string;
    userName: string;
    expirationTime: number;
    user_id: string;
  }): void {
    localStorage.setItem('user', userData.token);
    localStorage.setItem('username', userData.userName);
    localStorage.setItem('expiration_time', userData.expirationTime.toString());
    localStorage.setItem('user_id', userData.user_id);

    this.setAuthState(true, userData.userName);
    this.setAutoLogoutTimer(userData.expirationTime - Date.now());
    // console.log('problem here in loginuser');
  }

  logoutUser(): void {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expiration_time');

    // Clear auth state
    this.setAuthState(false, null);

    // Clear the logout timer
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  // ###################################################################
  getAuthUserHeaders(): HttpHeaders {
    const userToken = this.getToken();
    // console.log(userToken);

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
        const expirationTime = response.expiration_time; // Convert from minutes to milliseconds

        // Store the token in local storage
        if (token) {
          // Store authentication data
          localStorage.setItem('user', token);
          localStorage.setItem('username', firstName);
          localStorage.setItem('expiration_time', expirationTime.toString()); // Store as seconds

          // Update state
          this.userToken.next(token);
          this.userNameSubject.next(firstName);
          this.setAuthState(true, firstName);

          // Calculate the expiration time in milliseconds
          const expTime = expirationTime * 1000; // Convert from seconds to milliseconds
          const currentTime = Date.now(); // Current time in milliseconds

          this.setAutoLogoutTimer(expTime - currentTime); // Calculate duration until expiry
          // console.log('problem here in loginUser');
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
  private clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expiration_time');
    this.setAuthState(false, null);
    this.userToken.next(null);
    this.userNameSubject.next(null);
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.router.navigate(['/login']);
  }

  updateUserData(user_id: any, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${user_id}`, userData, {
      headers: this.getAuthUserHeaders(),
    });
  }

  getUserData(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthUserHeaders(),
    });
  }

  removeApplication(id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/user/job/remove/${id}`,
      {},
      {
        headers: this.getAuthUserHeaders(),
      },
    );
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
          this.userToken.next(null);
          this.userNameSubject.next(null);
          this.clearAuthData();
        }),
      );
  }
}
