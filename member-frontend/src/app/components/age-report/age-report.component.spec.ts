import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeReportComponent } from './age-report.component';

describe('AgeReportComponent', () => {
  let component: AgeReportComponent;
  let fixture: ComponentFixture<AgeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
