import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { AdminAuthService } from '../services/admin-auth.service';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  authService = inject(AdminAuthService);
  router = inject(Router);
  sidebarService = inject(SidebarService);

  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        sessionStorage.removeItem('token');
        this.router.navigateByUrl('/');
      },
    });
  }

  sidebarVisible = false;

  toggleSidebar(event: Event) {
    this.sidebarVisible = !this.sidebarVisible;
    event.stopPropagation();
  }

  // Close the sidebar when clicking outside of it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.sidebarVisible) {
      this.sidebarVisible = false;
    }
  }
}
