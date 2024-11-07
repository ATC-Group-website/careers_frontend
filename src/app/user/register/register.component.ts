import { Component, forwardRef, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { UserAuthService } from '../services/user-auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { registerUserForm } from '../../admin/interfaces/user-layout';
import { FooterComponent } from '../footer/footer.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HeaderComponent,
    EditorModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    ButtonModule,
    PasswordModule,
    CommonModule,
    FileUploadModule,
    ToastModule,
    FooterComponent,
  ],
  providers: [
    MessageService,

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RegisterComponent),
      multi: true,
    },
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  isLoading: boolean = false;
  errorMessage: string | null = null;
  registerForm!: FormGroup;
  selectedBase64File: string | null = null;
  filename: string | null = null;

  router = inject(Router);
  authService = inject(UserAuthService);

  constructor(
    private title: Title,
    private meta: Meta,
  ) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userToken = localStorage.getItem('user');
      if (userToken !== null) {
        this.router.navigate(['']);
      }
    }
  }

  ngOnInit(): void {
    this.title.setTitle('ATC Careers');

    this.registerForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
        phone_number: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
        address: new FormControl('', Validators.required),
        cv: new FormControl(null, Validators.required),
      },
      { validators: this.passwordMatchValidator() },
    );
  }

  onRegister() {
    if (this.registerForm.invalid) {
      // console.log('error inside register');
      // console.log(this.registerForm);

      Object.keys(this.registerForm.controls).forEach((field) => {
        const control = this.registerForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    } else {
      this.errorMessage = null;
      this.isLoading = true;

      if (this.selectedBase64File) {
        const formData: registerUserForm = {
          name: this.registerForm.controls['name'].value,
          email: this.registerForm.controls['email'].value,
          password: this.registerForm.controls['password'].value,
          phone_number: this.registerForm.controls['phone_number'].value,
          address: this.registerForm.controls['address'].value,
          cv: this.selectedBase64File,
        };
        // console.log(formData);

        this.authService.registerUser(formData).subscribe({
          next: (response) => {
            // console.log(response);

            this.router.navigateByUrl('/login');
            this.isLoading = false;
          },
          error: (err) => {
            // console.log(err);

            this.errorMessage = err.error.error || ' Invalid credentials ';
            this.isLoading = false;
          },
        });
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    // const file = event.files[0]; // Get the first selected file
    if (input.files) {
      const lastIndex = input.files.length - 1; // Get the index of the last file
      const file = input.files[lastIndex]; // Take the last file
      if (file && file.type === 'application/pdf') {
        this.filename = file.name; // Store the file name
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64 = e.target.result;
          this.selectedBase64File = base64; // Store Base64 string for upload
          // You can now use this.base64 to upload to the server
          // console.log('Base64 PDF:', base64); // Test output
        };
        reader.readAsDataURL(file); // Converts the file to Base64
      }
    } else {
      // console.warn('Please select a PDF file.');
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
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

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Only allows numbers
  }
}
