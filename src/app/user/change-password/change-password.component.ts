import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    ButtonModule,
    PasswordModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  errorMessage: string | null = null;
  error: string | null = null;
  isLoading: boolean = false;
  updatePasswordForm!: FormGroup;

  router = inject(Router);
  authService = inject(UserAuthService);
  messageService = inject(MessageService);

  constructor(private title: Title) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userToken = localStorage.getItem('user');
      if (userToken === null) {
        this.router.navigate(['']);
      }
    }
  }

  ngOnInit(): void {
    this.title.setTitle('ATC Careers');

    this.updatePasswordForm = new FormGroup(
      {
        old_password: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),

        confirmNewPassword: new FormControl('', [Validators.required]),
      },

      { validators: this.passwordMatchValidator() },
    );
  }
  onChangePassword() {
    if (this.updatePasswordForm.invalid) {
      Object.keys(this.updatePasswordForm.controls).forEach((field) => {
        const control = this.updatePasswordForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    } else {
      this.errorMessage = null;
      this.isLoading = true;

      const formData: any = {
        old_password: this.updatePasswordForm.controls['old_password'].value,
        new_password: this.updatePasswordForm.controls['newPassword'].value,
      };

      this.authService.updateUserPassword(formData).subscribe({
        next: (response) => {
          this.isLoading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: response.message,
            life: 5000,
          });

          setTimeout(() => {
            this.router.navigate(['profile']);
          }, 5000);
        },
        error: (err) => {
          this.isLoading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
            life: 5000,
          });
        },
      });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('newPassword');
      const confirmPassword = control.get('confirmNewPassword');
      if (
        password &&
        confirmPassword &&
        password.value !== confirmPassword.value
      ) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }
}
