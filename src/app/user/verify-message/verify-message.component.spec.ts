import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMessageComponent } from './verify-message.component';

describe('VerifyMessageComponent', () => {
  let component: VerifyMessageComponent;
  let fixture: ComponentFixture<VerifyMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
