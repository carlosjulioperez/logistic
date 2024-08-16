import { TestBed } from '@angular/core/testing';

import { PlanificacionaguajeService } from './planificacionaguaje.service';

describe('PlanificacionaguajeService', () => {
  let service: PlanificacionaguajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanificacionaguajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
