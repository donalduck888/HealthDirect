import { TestBed } from '@angular/core/testing';
import { SupplierManagementService } from './supplier-management.service';


describe('ProductManagementService', () => {
  let service: SupplierManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
