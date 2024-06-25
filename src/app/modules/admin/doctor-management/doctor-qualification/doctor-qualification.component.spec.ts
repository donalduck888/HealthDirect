import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorQualificationComponent } from './doctor-qualification.component';

describe('DoctorQualificationComponent', () => {
  let component: DoctorQualificationComponent;
  let fixture: ComponentFixture<DoctorQualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorQualificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
