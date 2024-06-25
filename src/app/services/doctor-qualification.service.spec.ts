import { TestBed } from '@angular/core/testing';
import { DoctorQualificationService } from './doctor-qualification.service';


describe('DoctorQualificationService', () => {
  let service: DoctorQualificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorQualificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
