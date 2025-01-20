import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-account-verification',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    CommonModule,
    ToastModule,
  ],
  providers: [MessageService],

  templateUrl: './account-verification.component.html',
  styleUrl: './account-verification.component.css',
})
export class AccountVerificationComponent implements OnInit {
  messageService = inject(MessageService);
  router = inject(Router);

  errorMessage: string | null = null;

  isLoading: boolean = false;
  auth_url: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userAuth: UserAuthService,
    private title: Title,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('ATC Careers');

    // Use queryParamMap to get the auth_url from query parameters
    this.route.queryParamMap.subscribe((params) => {
      this.auth_url = params.get('auth_url'); // Retrieve the auth_url from the query parameters
      // console.log('Auth URL:', this.auth_url); // Log the auth_url for verification
    });
  }

  onLogin(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    } else {
      this.errorMessage = null;
      this.isLoading = true;
      this.userAuth.loginUser(formData.form.value).subscribe({
        next: (response) => {
          // console.log(response);

          this.userAuth.saveUserData({
            token: response.token,
            userName: response.user.name,
            expirationTime: response.expiration_time,
            user_id: response.user.id,
          });

          const token = this.userAuth.getToken();
          // console.log('token', token);

          // console.log('auth_url', this.auth_url);
          if (this.auth_url) {
            this.userAuth.verifyEmail(token, this.auth_url).subscribe({
              next: (response) => {
                // console.log(response);
                this.messageService.add({
                  severity: 'info',
                  summary: 'Success',
                  detail: `Email verified successfully`,
                  life: 5000,
                });
                this.router.navigateByUrl('');
              },
              error: (err) => {
                // console.log(err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: err.error.message,
                  life: 5000,
                });
              },
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'auth is not available',
              life: 5000,
            });
          }
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
