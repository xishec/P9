import { TestBed } from '@angular/core/testing';

import { PenToolService } from './pen-tool.service';

describe('PenToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PenToolService = TestBed.get(PenToolService);
    expect(service).toBeTruthy();
  });
});
