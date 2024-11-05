import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
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
    CommonModule,
    MenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  dropdownOpen = false;

  isLogged!: boolean;
  userName: string | null = '';

  authService = inject(UserAuthService);

  constructor(
    private router: Router,
    private elementRef: ElementRef,
  ) {
    this.dropdownItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.goToProfile(),
      },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
    ];
  }
  ngOnInit(): void {
    this.authService.userToken.subscribe((token) => {
      this.isLogged = !!token;
    });

    console.log(this.isLogged);

    this.authService.userName$.subscribe((name) => {
      this.userName = name;
    });

    // if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    //   this.isLogged = localStorage.getItem('user') ? true : false;
    //   this.userName = 'User';
    // }
    // this.authService.userName$.subscribe((name) => {
    //   this.userName = name;
    // });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.dropdownOpen = false;
  }

  dropdownItems: any[] = [];

  goToSettings() {
    // Navigate to settings page
    this.router.navigate(['/settings']);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    console.log('1');

    this.authService.logout().subscribe({
      next: (res) => {
        console.log('2');

        console.log('Logging out...');
        localStorage.removeItem('user');
        this.router.navigate(['/login']); // Redirect to login page
      },
      error: (error) => {
        console.log('3');

        console.log('Logout error:', error);
      },
    });
    this.dropdownOpen = false;
  }
}
