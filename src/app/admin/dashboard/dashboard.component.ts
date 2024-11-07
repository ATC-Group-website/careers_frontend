import { Component, Inject, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, SidebarComponent, TopbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  authService = inject(AdminAuthService);
  router = inject(Router);
  sidebarService = Inject(SidebarService);

  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        sessionStorage.removeItem('token');
        this.router.navigateByUrl('/');
      },
    });
  }
}
