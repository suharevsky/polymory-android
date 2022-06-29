import { TestBed } from '@angular/core/testing';

import { ZodicSignService } from './zodic-sign.service';

describe('ZodicSignService', () => {
  let service: ZodicSignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZodicSignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
