import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { rouResolver } from './rou.resolver';

describe('rouResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => rouResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
