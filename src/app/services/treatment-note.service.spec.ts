import { TestBed } from '@angular/core/testing';

import { TreatmentNoteService } from './treatment-note.service';

describe('TreatmentNoteService', () => {
  let service: TreatmentNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatmentNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
