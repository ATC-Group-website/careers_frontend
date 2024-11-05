import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CareersService } from '../services/careers.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-apply-page',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    ReactiveFormsModule,
    CommonModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    InputTextareaModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './apply-page.component.html',
  styleUrl: './apply-page.component.css',
})
export class ApplyPageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  careersService = inject(CareersService);
  messageService = inject(MessageService);

  isLoggedIn: boolean = false; // Adjust this logic based on your authentication state
  showMessage: boolean = true; // State to control message visibility

  applyForm!: FormGroup;
  selectedBase64File: string | null = null;
  isLoading: boolean = false;
  filename: string | null = null;
  checked: boolean = false;
  jobId!: number;

  currencies: string[] = ['EGP', 'SAR', 'AED'];
  eligibleToWork: string[] = ['Yes', 'No'];

  // countryCodes = [
  //   { label: '+20', value: '+20' },
  //   { label: '+966', value: '+966' },
  //   { label: '+971', value: '+971' },
  // ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userToken = localStorage.getItem('user');
      this.isLoggedIn = !!localStorage.getItem('user');
    }
    // get user token and get his data to fetch it in the inputs

    this.route.params.subscribe((params) => {
      this.jobId = parseInt(params['id'], 10);
    });

    this.applyForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone_number: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      address: new FormControl('', Validators.required),
      university: new FormControl('', Validators.required),
      major: new FormControl('', Validators.required),
      grad_year: new FormControl('', [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear()),
        Validators.pattern('^[0-9]{4}$'), // Ensure it is exactly 4 digits
      ]),
      experience_years: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?:[0-9]|[1-9][0-9])$/),
      ]),
      notice_period: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?:[0-9]|[1-9][0-9])$/),
      ]),
      expected_salary: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      currency: new FormControl('', Validators.required),
      location_eligibility: new FormControl('', Validators.required),
      cv: new FormControl(null, Validators.required),
      // references: new FormArray([]),
      // disability_needs: new FormControl('', Validators.required), // Control for health and disability
    });

    // // Initialize References FormArray with 2 referees
    // for (let i = 0; i < 1; i++) {
    //   this.references.push(this.createReference());
    // }
  }

  onApply(): void {
    if (this.applyForm.invalid) {
      Object.keys(this.applyForm.controls).forEach((field) => {
        const control = this.applyForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    } else if (this.applyForm.valid) {
      this.isLoading = true;

      console.log(this.applyForm.value);
      console.log(this.applyForm);

      const formData = {
        name: this.applyForm.controls['name'].value,
        email: this.applyForm.controls['email'].value,
        phone_number: this.applyForm.controls['phone_number'].value,
        address: this.applyForm.controls['address'].value,
        university: this.applyForm.controls['university'].value,
        major: this.applyForm.controls['major'].value,
        grad_year: this.applyForm.controls['grad_year'].value,
        years_of_experience: this.applyForm.controls['experience_years'].value,
        notice_period: this.applyForm.controls['notice_period'].value,
        expected_salary: this.applyForm.controls['expected_salary'].value,
        currency: this.applyForm.controls['currency'].value,
        location_eligibility:
          this.applyForm.controls['location_eligibility'].value === 'Yes'
            ? true
            : false,
        base64_pdf: this.selectedBase64File,
      };

      console.log(formData);

      if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem('user');

        if (isNaN(this.jobId)) {
          this.isLoading = false;
          return;
        }

        if (token !== null) {
          this.careersService.applyAsUser(formData, this.jobId).subscribe({
            next: (res) => {
              console.log('user');

              console.log(res);
              this.isLoading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: 'You applied to the job! successfully',
              });
            },
            error: (err) => {
              console.log('user');

              console.error(err);
              this.isLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
              });
            },
          });
        } else {
          this.careersService.applyAsGuest(formData, this.jobId).subscribe({
            next: (res) => {
              console.log('guest');

              console.log(res);
              this.isLoading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: 'You applied to the job! successfully',
              });
            },
            error: (err) => {
              console.log('guest');

              console.error(err);
              this.isLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
              });
            },
          });
        }
      }
    }
  }

  // createReference(): FormGroup {
  //   return new FormGroup({
  //     referee_name: new FormControl('', Validators.required),
  //     referee_job_title: new FormControl('', Validators.required),
  //     referee_school_establishment: new FormControl('', Validators.required),
  //     referee_address: new FormControl('', Validators.required),
  //     referee_phone_number: new FormControl('', Validators.required),
  //     referee_email: new FormControl('', [
  //       Validators.required,
  //       Validators.email,
  //     ]),
  //     dates_of_employment: new FormControl('', Validators.required), // Include "From - To" in your implementation
  //     permission_to_contact: new FormControl(false), // Checkbox for permission to contact
  //   });
  // }

  // get references(): FormArray {
  //   return this.applyForm.get('references') as FormArray;
  // }

  onKeyPressPhoneNumber(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    // Only allow numbers
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault(); // Prevent non-numeric characters
    }
  }

  onKeyPressGraduationYear(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    // Only allow numbers
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault(); // Prevent non-numeric characters
    }

    // Prevent exceeding 4 characters
    if (input.value.length >= 4) {
      event.preventDefault(); // Prevent additional characters
    }
  }

  onKeyPressExperienceYears(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    // Only allow numbers
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault(); // Prevent non-numeric characters
    }

    // Prevent exceeding 2 characters
    if (input.value.length >= 2) {
      event.preventDefault(); // Prevent additional characters
    }
  }

  onKeyPressExpectedSalary(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    // Only allow numbers
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault(); // Prevent non-numeric characters
    }

    // Prevent exceeding 2 characters
    if (input.value.length >= 7) {
      event.preventDefault(); // Prevent additional characters
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
          console.log('Base64 PDF:', base64); // Test output
        };
        reader.readAsDataURL(file); // Converts the file to Base64
      }
    } else {
      console.warn('Please select a PDF file.');
    }
  }

  closeMessage() {
    this.showMessage = false; // Set to false to hide the message
    console.log('here');
  }
}
