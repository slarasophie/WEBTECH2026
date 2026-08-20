import { TestBed } from '@angular/core/testing';

import { My } from './my';

describe('My', () => {
  let service: My;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(My);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
