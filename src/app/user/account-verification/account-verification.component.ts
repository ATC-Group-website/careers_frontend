import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-account-verification',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './account-verification.component.html',
  styleUrl: './account-verification.component.css',
})
export class AccountVerificationComponent implements OnInit {
  errorMessage: string | null = null;

  isLoading: boolean = false;
  auth_url: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userAuth: UserAuthService,
  ) {}

  ngOnInit(): void {
    // Use queryParamMap to get the auth_url from query parameters
    this.route.queryParamMap.subscribe((params) => {
      this.auth_url = params.get('auth_url'); // Retrieve the auth_url from the query parameters
      console.log('Auth URL:', this.auth_url); // Log the auth_url for verification
    });
  }

  onLogin(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    } else {
      this.isLoading = true;
      // this.userAuth.loginToVerify(formData.form.value).subscribe({
      //   next: (response) => {
      //     this.isLoading = false;

      //     console.log(response);

      //     if (
      //       typeof window !== 'undefined' &&
      //       typeof sessionStorage !== 'undefined'
      //     ) {
      //       const token = localStorage.setItem('token', response.token);

      //       this.isLoading = false;
      //     }

      //     const token = localStorage.getItem('token');
      //     console.log(token);

      //     console.log(this.auth_url);

      //     //     this.userAuth.verifyEmail(token, this.auth_url).subscribe({
      //     //       next: (response) => {
      //     //         console.log(response);
      //     //       },
      //     //       error: (err) => {
      //     //         console.log(err);
      //     //       },
      //     //     });
      //     //   },
      //     //   error: (err) => {
      //     //     this.isLoading = false;
      //     //     this.errorMessage =
      //     //       err.error.error || 'Login failed. Please try again.';
      //     //   },
      //     // });
      //     if (this.auth_url) {
      //       this.userAuth.verifyEmail(token, this.auth_url).subscribe({
      //         next: (response) => {
      //           console.log(response);
      //         },
      //         error: (err) => {
      //           console.log(err);
      //         },
      //       });
      //     } else {
      //       console.error('auth_url is not available');
      //     }
      //   },
      //   error: (err) => {
      //     this.isLoading = false;
      //     this.errorMessage =
      //       err.error.error || 'Login failed. Please try again.';
      //   },
      // });
    }
  }
}
