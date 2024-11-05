import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserAuthService } from './user/services/user-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'careers_frontend';

  authService = inject(UserAuthService);
  router = inject(Router);
  isLogged: boolean = false;
  userName: string | null = '';

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('user');
      const expirationTime = Number(localStorage.getItem('expiration_timee')); // Ensure the key matches what you set during login

      if (token && expirationTime) {
        const currentTime = Date.now();
        if (currentTime >= expirationTime) {
          // Token expired, log out user
          console.log(expirationTime);
          console.log('token expired');

          this.logoutUser();
        } else {
          // Token is valid
          this.isLogged = true;
          this.userName = localStorage.getItem('username') || '';
          console.log('token valid');

          // Set a timeout to log out when expiration time is reached

          const timeoutDuration = expirationTime - currentTime;
          console.log(timeoutDuration);

          setTimeout(() => {
            this.logoutUser();
          }, timeoutDuration);
        }
      }
    }
  }

  private logoutUser() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('User logged out successfully');
        localStorage.removeItem('user');
        localStorage.removeItem('expiration_timee');
        this.isLogged = false; // Update the logged-in state
        this.router.navigate(['/login']); // Redirect to login
      },
      error: (err) => {
        console.error('Error logging out:', err);
      },
    });
  }
}
