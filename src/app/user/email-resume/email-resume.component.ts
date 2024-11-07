import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-email-resume',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './email-resume.component.html',
  styleUrl: './email-resume.component.css',
})
export class EmailResumeComponent {
  emailResume() {
    const email = 'careers@atc.com.eg';
    const subject = encodeURIComponent('Resume Submission');
    const body = encodeURIComponent(
      'Hello, I would like to submit my resume for future opportunities.',
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }
}
