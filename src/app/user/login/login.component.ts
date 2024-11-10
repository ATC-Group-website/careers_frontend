import { PasswordModule } from 'primeng/password';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UserAuthService } from '../services/user-auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FormsModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    PasswordModule,
    FooterComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  errorMessage: string | null = null;

  router = inject(Router);
  authService = inject(UserAuthService);

  constructor(
    private title: Title,
    private meta: Meta,
  ) {
    this.title.setTitle('ATC Careers');

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userToken = localStorage.getItem('user');
      if (userToken !== null) {
        this.router.navigate(['']);
      }
    }
  }

  ngOnInit(): void {
    this.authService.checkStoredVerificationStatus();
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

      this.authService.loginUser(formData.form.value).subscribe({
        next: (response) => {
          // console.log(response);

          this.authService.setVerificationStatusFromResponse(
            response.user.email_verified_at,
          );
          // console.log(response.user.email_verified_at);

          this.authService.checkStoredVerificationStatus();

          this.authService.loginuser({
            token: response.token,
            userName: response.user.name,
            expirationTime: response.expiration_time,
            user_id: response.user.id,
          });

          this.router.navigateByUrl('');
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
