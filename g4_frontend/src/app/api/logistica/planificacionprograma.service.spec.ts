import { TestBed } from '@angular/core/testing';

import { PlanificacionprogramaService } from './planificacionprograma.service';

describe('PlanificacionprogramaService', () => {
  let service: PlanificacionprogramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanificacionprogramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
