import { TestBed } from '@angular/core/testing';

import { MagnetismToolService } from './magnetism-tool.service';

describe('MagnetismToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MagnetismToolService = TestBed.get(MagnetismToolService);
    expect(service).toBeTruthy();
  });
});
