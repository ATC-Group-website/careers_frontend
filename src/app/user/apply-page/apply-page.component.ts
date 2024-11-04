import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';

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
  ],
  templateUrl: './apply-page.component.html',
  styleUrl: './apply-page.component.css',
})
export class ApplyPageComponent implements OnInit {
  isLoggedIn: boolean = false; // Adjust this logic based on your authentication state
  showMessage: boolean = true; // State to control message visibility

  applyForm!: FormGroup;
  router = inject(Router);
  selectedBase64File: string | null = null;
  isLoading: boolean = false;
  filename: string | null = null;
  checked: boolean = false;

  currencies: string[] = ['EGP', 'SAR', 'AED'];
  eligibleToWork: string[] = ['Yes', 'No'];

  constructor() {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userToken = localStorage.getItem('user');
      this.isLoggedIn = !!localStorage.getItem('user');
    }
    // get user token and get his data to fetch it in the inputs

    this.applyForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone_number: new FormControl(null, Validators.required),
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
      cv: new FormControl(null),
      references: new FormArray([]),
      disability_needs: new FormControl('', Validators.required), // Control for health and disability
    });

    // Initialize References FormArray with 2 referees
    for (let i = 0; i < 1; i++) {
      this.references.push(this.createReference());
    }
  }

  onApply(): void {
    if (this.applyForm.valid) {
      console.log(this.applyForm.value);
      console.log(this.applyForm);

      // Implement form submission logic here
    } else {
      console.log('error');
    }
  }

  createReference(): FormGroup {
    return new FormGroup({
      referee_name: new FormControl('', Validators.required),
      referee_job_title: new FormControl('', Validators.required),
      referee_school_establishment: new FormControl('', Validators.required),
      referee_address: new FormControl('', Validators.required),
      referee_phone_number: new FormControl('', Validators.required),
      referee_email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      dates_of_employment: new FormControl('', Validators.required), // Include "From - To" in your implementation
      permission_to_contact: new FormControl(false), // Checkbox for permission to contact
    });
  }

  get references(): FormArray {
    return this.applyForm.get('references') as FormArray;
  }
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Only allows numbers
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
