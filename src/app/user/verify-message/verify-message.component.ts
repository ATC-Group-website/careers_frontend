import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UserAuthService } from '../services/user-auth.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-verify-message',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  providers: [MessageService],

  templateUrl: './verify-message.component.html',
  styleUrl: './verify-message.component.css',
})
export class VerifyMessageComponent {
  authService = inject(UserAuthService);
  messageService = inject(MessageService);

  verifyMessage: Message[] = [];

  sendActivationEmail() {
    this.authService.sendVerificationEmail().subscribe({
      next: (res) => {
        // console.log(res);

        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: `Email verified successfully`,
          life: 5000,
        });
      },
    });
  }
}
