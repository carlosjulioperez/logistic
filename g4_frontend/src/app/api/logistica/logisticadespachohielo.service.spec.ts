import { TestBed } from '@angular/core/testing';

import { LogisticadespachohieloService } from './logisticadespachohielo.service';

describe('LogisticadespachohieloService', () => {
  let service: LogisticadespachohieloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticadespachohieloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
