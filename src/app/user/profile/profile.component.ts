import { CareersService } from './../services/careers.service';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { UserAuthService } from '../services/user-auth.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { User } from '../interfaces/user-interface';
import { CommonModule } from '@angular/common';
import {
  DomSanitizer,
  Meta,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    RouterModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  router = inject(Router);
  authService = inject(UserAuthService);
  sanitizer = inject(DomSanitizer);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  user!: any;
  isLoading: boolean = true;
  UserData!: FormGroup;
  sanitizedCVPaths: SafeResourceUrl[] = []; // Array of sanitized CV paths
  showCVModal: boolean = false; // Modal visibility state
  selectedCVIndex: number | null = null; // Tracks the selected CV to display
  status: string = ''; // This would be set based on the backend response

  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('ATC Careers');

    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage !== 'undefined'
    ) {
      const token = localStorage.getItem('user');
      this.fetchUserData();
      if (!token) {
        this.router.navigate(['/login']);
      }
    }

    this.UserData = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
      address: new FormControl('', Validators.required),
      phone_number: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }

  fetchUserData() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      let user_id = localStorage.getItem('user_id');
      if (user_id) {
        this.authService.getUserData(user_id).subscribe({
          next: (res) => {
            // console.log(res);
            this.user = res;

            this.UserData.patchValue({
              name: res.name,
              email: res.email,
              address: res.address,
              phone_number: res.phone_number,
            });

            this.sanitizeCVPaths(); // Sanitize paths for the CV array

            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            // console.log(err);
          },
        });
      }
    }
  }

  onUpdateUserData() {
    if (this.UserData.valid) {
      this.isLoading = true;

      const userData = this.UserData.value;
      // console.log('Job Updated:', userData);

      this.authService.updateUserData(this.user.id, userData).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'User info updated successfully',
          });

          // console.log(res);
          this.fetchUserData();

          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          // console.error('Error updating user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update User. Please try again.',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: ' Error',
      });
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Only allows numbers
  }

  sanitizeCVPaths() {
    if (this.user?.cv?.length) {
      this.sanitizedCVPaths = this.user.cv.map((cvItem: any) =>
        this.sanitizer.bypassSecurityTrustResourceUrl(cvItem.path),
      );
    }
  }

  // openCVModal(index: number) {
  //   this.selectedCVIndex = index; // Set selected CV index
  //   this.showCVModal = true; // Open the modal
  // }

  // closeCVModal() {
  //   this.showCVModal = false;
  //   this.selectedCVIndex = null; // Reset selected CV index
  // }

  getStatusColor(status: string): string {
    switch (status) {
      case 'rejected':
        return 'status-rejected';
      case 'accepted':
        return 'status-accepted';
      case 'in_process':
        return 'status-in-process';
      case 'applied':
        return 'status-applied';
      default:
        return '';
    }
  }

  // removeApplication(jobId: any) {
  //   this.authService.removeApplication(jobId).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  confirmDelete(event: Event, jobId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to withdraw this application?',
      header: 'Withdraw Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.authService.removeApplication(jobId).subscribe({
          next: (response) => {
            // console.log(response);
            this.fetchUserData();
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: `application deleted successfully`,
            });
          },
          error: (err) => {
            // console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to withdraw application',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
}
