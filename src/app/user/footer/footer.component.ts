import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  emailResume() {
    const email = 'careers@atc.com.eg';
    const subject = encodeURIComponent('Resume Submission');
    const body = encodeURIComponent(
      'Hello, I would like to submit my resume for future opportunities.',
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }
}
