import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserApplicationComponent } from './single-user-application.component';

describe('SingleUserApplicationComponent', () => {
  let component: SingleUserApplicationComponent;
  let fixture: ComponentFixture<SingleUserApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleUserApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleUserApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
