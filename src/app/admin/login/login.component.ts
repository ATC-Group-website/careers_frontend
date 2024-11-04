import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAuthService } from '../services/admin-auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  authService = inject(AdminAuthService);

  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor() {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      const adminToken = sessionStorage.getItem('token');
      if (adminToken !== null) {
        this.router.navigate(['admin/dashboard']);
      }
    }
  }

  onLogin(formData: NgForm) {
    if (formData.form.invalid) {
      Object.keys(formData.form.controls).forEach((field) => {
        const control = formData.form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    } else {
      this.errorMessage = null;
      this.isLoading = true;

      this.authService.login(formData.form.value).subscribe({
        next: (response) => {
          console.log(response);

          this.authService.setToken(response.token);
          this.router.navigateByUrl('/admin/dashboard');
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error.error || ' Invalid credentials ';
          this.isLoading = false;
        },
      });
    }
  }
}
