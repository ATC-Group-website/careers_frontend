import { Component, Inject, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarService } from '../sidebar/sidebar.service';
import { Meta, Title } from '@angular/platform-browser';

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

  constructor(
    private title: Title,
    private meta: Meta,
  ) {
    this.title.setTitle('ATC Careers');
  }
  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        sessionStorage.removeItem('token');
        this.router.navigateByUrl('/');
      },
    });
  }
}
