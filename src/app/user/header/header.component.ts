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
import { Subscription } from 'rxjs';

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
  isLogged: boolean = false;
  userName: string | null = null;
  dropdownOpen = false;

  private authSubscription?: Subscription;
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
    this.authService.authState$.subscribe((state) => {
      this.isLogged = state.isLogged;
      this.userName = state.userName;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.dropdownOpen = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  goToProfile() {
    this.dropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  dropdownItems: any[] = [];

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    this.dropdownOpen = false;
    this.authService.logout().subscribe({
      next: (res) => {
        // console.log(res);
        this.authService.logoutUser();
      },
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
