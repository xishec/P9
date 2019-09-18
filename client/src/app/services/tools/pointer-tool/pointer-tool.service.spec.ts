import { TestBed } from '@angular/core/testing';

import { PointerToolService } from './pointer-tool.service';

describe('PointerToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PointerToolService = TestBed.get(PointerToolService);
    expect(service).toBeTruthy();
  });
});
