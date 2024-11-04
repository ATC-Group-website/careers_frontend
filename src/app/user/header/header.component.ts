import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterModule,
    DropdownModule,
    ButtonModule,
    MenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userName: string | null = '';

  authService = inject(UserAuthService);

  constructor(private router: Router) {
    this.dropdownItems = [
      {
        label: 'menu',
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.goToProfile(),
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => this.goToSettings(),
      },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
    ];
  }
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.isLogged = localStorage.getItem('user') ? true : false;
      this.userName = 'User';
    }
  }

  logOut() {
    this.authService.logout();
  }

  dropdownItems: any[] = [];

  goToProfile() {
    // Navigate to profile page
    this.router.navigate(['/profile']);
  }

  goToSettings() {
    // Navigate to settings page
    this.router.navigate(['/settings']);
  }

  logout() {
    console.log('1');

    this.authService.logout().subscribe({
      next: (res) => {
        console.log('2');

        console.log('Logging out...');
        this.router.navigate(['/login']); // Redirect to login page
      },
      error: (error) => {
        console.log('3');

        console.log('Logout error:', error);
      },
    });
  }
}
