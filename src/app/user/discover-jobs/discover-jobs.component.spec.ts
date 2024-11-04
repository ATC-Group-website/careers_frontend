import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverJobsComponent } from './discover-jobs.component';

describe('DiscoverJobsComponent', () => {
  let component: DiscoverJobsComponent;
  let fixture: ComponentFixture<DiscoverJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoverJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoverJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
