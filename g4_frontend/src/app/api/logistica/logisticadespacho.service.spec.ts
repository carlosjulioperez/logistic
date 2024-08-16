import { TestBed } from '@angular/core/testing';

import { LogisticadespachoService } from './logisticadespacho.service';

describe('LogisticadespachoService', () => {
  let service: LogisticadespachoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticadespachoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
