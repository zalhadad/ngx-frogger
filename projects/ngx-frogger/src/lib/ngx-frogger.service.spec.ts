import { TestBed } from '@angular/core/testing';

import { NgxFroggerService } from './ngx-frogger.service';

describe('NgxFroggerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxFroggerService = TestBed.get(NgxFroggerService);
    expect(service).toBeTruthy();
  });
});
