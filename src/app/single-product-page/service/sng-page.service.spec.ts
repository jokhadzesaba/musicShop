import { TestBed } from '@angular/core/testing';

import { SngPageService } from './sng-page.service';

describe('SngPageService', () => {
  let service: SngPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SngPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
