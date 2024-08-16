import { TestBed } from '@angular/core/testing';

import { CoregrupoService } from './coregrupo.service';

describe('CoregrupoService', () => {
  let service: CoregrupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoregrupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
