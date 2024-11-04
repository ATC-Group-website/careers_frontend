import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyPageComponent } from './apply-page.component';

describe('ApplyPageComponent', () => {
  let component: ApplyPageComponent;
  let fixture: ComponentFixture<ApplyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
