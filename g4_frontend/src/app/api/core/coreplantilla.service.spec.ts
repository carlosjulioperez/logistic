import { TestBed } from '@angular/core/testing';

import { CoreplantillaService } from './coreplantilla.service';

describe('CoreplantillaService', () => {
  let service: CoreplantillaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreplantillaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
