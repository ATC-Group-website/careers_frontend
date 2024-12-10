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
import { UserAuthService } from '../services/user-auth.service';
import { DialogModule } from 'primeng/dialog';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFParser } from './pdf-parser';
import { Job } from '../../admin/interfaces/admin.interface';
import { Meta, Title } from '@angular/platform-browser';
import { CapitalizeFirstPipe } from '../../pipes/capitalize-first.pipe';

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
    DialogModule,
    CapitalizeFirstPipe,
  ],
  providers: [MessageService],
  templateUrl: './apply-page.component.html',
  styleUrl: './apply-page.component.css',
})
export class ApplyPageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  careersService = inject(CareersService);
  authService = inject(UserAuthService);
  messageService = inject(MessageService);

  isLoggedIn: boolean = false; // Adjust this logic based on your authentication state
  showLoginDialog: boolean = false;
  job!: Job;

  applyForm!: FormGroup;
  selectedBase64File: string | null = null;
  isLoading: boolean = true;
  filename: string | null = null;
  checked: boolean = false;
  jobId!: number;
  errorMessage: string | null = null;

  currencies: string[] = ['EGP', 'SAR', 'AED'];
  eligibleToWork: string[] = ['Yes', 'No'];

  // countryCodes = [
  //   { label: '+20', value: '+20' },
  //   { label: '+966', value: '+966' },
  //   { label: '+971', value: '+971' },
  // ];

  // private pdfParser = new PDFParser();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private title: Title,
    private meta: Meta,
  ) {
    // try {
    //   this.pdfParser = new PDFParser();
    // } catch (error) {
    //   console.error('Failed to initialize PDF parser:', error);
    // }
  }

  ngOnInit(): void {
    // pdfjsLib.GlobalWorkerOptions.workerSrc =
    //   'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs';

    this.title.setTitle('Apply for a Career Opportunity | ATC Careers');
    this.meta.updateTag({
      name: 'description',
      content:
        'Discover rewarding career paths at ATC Group. We offer dynamic opportunities in Accounting, Tax, Zakat, Audit, and Financial Consulting across Mena region. Join a team committed to excellence, innovation, and professional growth.',
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'ATC careers, job opportunities ATC, ATC Group jobs, accounting careers KSA, tax jobs Egypt, financial consulting jobs, ATC Group recruitment, careers in audit and tax',
    });

    this.fetchJobDetails();

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userToken = localStorage.getItem('user');
      this.isLoggedIn = !!localStorage.getItem('user');
      if (!this.isLoggedIn) {
        this.showLoginDialog = true; // Open dialog if not logged in
      }
      let user_id = localStorage.getItem('user_id');
      if (user_id) {
        this.authService.getUserData(user_id).subscribe({
          next: (res) => {
            // console.log(res);

            this.applyForm.patchValue({
              name: res.name,
              email: res.email,
              address: res.address,
              phone_number: res.phone_number,
            });
            this.applyForm.controls['email'].disable(); // Disable the email field

            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            // console.log(err);
          },
        });
      }
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
        Validators.max(2050),
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

  fetchJobDetails() {
    this.route.params.subscribe((params) => {
      this.jobId = parseInt(params['id'], 10);
      if (isNaN(this.jobId)) {
        this.errorMessage = 'Invalid job ID provided.';
        this.isLoading = false;
        return;
      }
      this.careersService.fetchSingleJob(this.jobId).subscribe({
        next: (res) => {
          this.job = res.job;
          // console.log(res.job);
          this.isLoading = false;
        },
        error: (error) => {
          // console.log(error);

          error.error.error === 'Job not found'
            ? (this.errorMessage = error.error.error + '.')
            : (this.errorMessage =
                'Unable to fetch job details. Please try again later.');

          this.isLoading = false;
        },
      });
    });
  }

  onApply(): void {
    if (this.applyForm.invalid) {
      Object.keys(this.applyForm.controls).forEach((field) => {
        const control = this.applyForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    } else if (this.applyForm.valid) {
      this.isLoading = true;

      // console.log(this.applyForm.value);
      // console.log(this.applyForm);

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

      // console.log(formData);

      if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem('user');

        if (isNaN(this.jobId)) {
          this.isLoading = false;
          return;
        }

        if (token !== null) {
          this.careersService.applyAsUser(formData, this.jobId).subscribe({
            next: (res) => {
              // console.log('user');
              // console.log(formData);
              // console.log(this.jobId);

              // console.log(res);
              this.isLoading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: res.message,
              });
              this.applyForm.reset();
            },
            error: (err) => {
              // console.log('user');
              // console.log(formData);
              // console.log(this.jobId);
              // console.error(err);
              this.isLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
              });
            },
          });
        } else {
          this.careersService.applyAsGuest(formData, this.jobId).subscribe({
            next: (res) => {
              // console.log('guest');

              // console.log(res);
              this.isLoading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: res.message,
              });
              this.applyForm.reset();
            },
            error: (err) => {
              // console.log('guest');

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
    if (input.files) {
      const lastIndex = input.files.length - 1; // Get the index of the last file
      const file = input.files[lastIndex]; // Take the last file
      if (file && file.type === 'application/pdf') {
        this.filename = file.name; // Store the file name
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64 = e.target.result;

          this.selectedBase64File = base64; // Store Base64 string for upload
        };
        reader.readAsDataURL(file); // Converts the file to Base64
      }
    } else {
      console.warn('Please select a PDF file.');
    }
  }

  // pdf js functions
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     const lastIndex = input.files.length - 1; // Get the index of the last file
  //     const file = input.files[lastIndex]; // Take the last file
  //     if (file && file.type === 'application/pdf') {
  //       this.filename = file.name; // Store the file name
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         const base64 = e.target.result;
  //         console.log('onFileSelected');

  //         this.extractTextFromPdf(file); // Extract text from the selected PDF
  //         this.selectedBase64File = base64; // Store Base64 string for upload
  //       };
  //       reader.readAsDataURL(file); // Converts the file to Base64
  //     }
  //   } else {
  //     console.warn('Please select a PDF file.');
  //   }
  // }

  // extractTextFromPdf(file: File): void {
  //   console.log('extractTextFromPdf');
  //   const fileReader = new FileReader();
  //   fileReader.onload = () => {
  //     const arrayBuffer = fileReader.result as ArrayBuffer;
  //     console.log(arrayBuffer);

  //     pdfjsLib.getDocument(arrayBuffer).promise.then((pdfDoc) => {
  //       let textContent = '';
  //       let pagePromises = [];

  //       console.log('before loop');

  //       for (let i = 1; i <= pdfDoc.numPages; i++) {
  //         pagePromises.push(
  //           pdfDoc.getPage(i).then((page) => {
  //             return page.getTextContent().then((text) => {
  //               text.items.forEach((item: any) => {
  //                 textContent += item.str + ' ';
  //               });
  //             });
  //           }),
  //         );
  //       }
  //       console.log('before promise all');

  //       // After all pages have been processed, fill the form
  //       Promise.all(pagePromises).then(() => {
  //         console.log('inside promise');

  //         this.fillFormFromExtractedText(textContent);
  //       });
  //     });
  //   };
  //   fileReader.readAsArrayBuffer(file);
  // }

  // fillFormFromExtractedText(textContent: string): void {
  //   console.log('fillFormFromExtractedText');
  //   const nameMatch = textContent.match(/Name: (.*)/);
  //   const emailMatch = textContent.match(/Email: (.*)/);
  //   const phoneMatch = textContent.match(/Phone: (.*)/);
  //   const addressMatch = textContent.match(/address: (.*)/);
  //   const universityMatch = textContent.match(/University: (.*)/);
  //   const majorMatch = textContent.match(/Major: (.*)/);
  //   const graduationYearMatch = textContent.match(/Graduation year: (.*)/);
  //   console.log(
  //     nameMatch,
  //     emailMatch,
  //     phoneMatch,
  //     addressMatch,
  //     addressMatch,
  //     universityMatch,
  //     majorMatch,
  //     graduationYearMatch,
  //   );

  //   // Fill form if matches are found
  //   if (nameMatch) {
  //     this.applyForm.patchValue({ name: nameMatch[1] });
  //   }
  //   if (emailMatch) {
  //     this.applyForm.patchValue({ email: emailMatch[1] });
  //   }
  //   if (phoneMatch) {
  //     this.applyForm.patchValue({ phone_number: phoneMatch[1] });
  //   }
  //   if (addressMatch) {
  //     this.applyForm.patchValue({ address: addressMatch[1] });
  //   }
  //   if (universityMatch) {
  //     this.applyForm.patchValue({ university: universityMatch[1] });
  //   }
  //   if (majorMatch) {
  //     this.applyForm.patchValue({ major: majorMatch[1] });
  //   }
  //   if (graduationYearMatch) {
  //     this.applyForm.patchValue({ grad_year: graduationYearMatch[1] });
  //   }
  // }

  goToLogin() {
    this.showLoginDialog = false; // Close dialog
    this.router.navigate(['/login']); // Navigate to login page
  }

  formatDepartment(department: string): string {
    return department.replace(/_/g, ' ');
  }
}
