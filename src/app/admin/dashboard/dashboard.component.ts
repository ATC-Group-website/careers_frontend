import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  authService = inject(AdminAuthService);
  router = inject(Router);


  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        sessionStorage.removeItem('token');
        this.router.navigateByUrl('/');
      },
    });
  }
}
