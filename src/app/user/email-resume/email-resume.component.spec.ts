import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailResumeComponent } from './email-resume.component';

describe('EmailResumeComponent', () => {
  let component: EmailResumeComponent;
  let fixture: ComponentFixture<EmailResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
