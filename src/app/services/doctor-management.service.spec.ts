import { TestBed } from '@angular/core/testing';

import { DoctorManagementService } from './doctor-management.service';

describe('DoctorManagementService', () => {
  let service: DoctorManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
