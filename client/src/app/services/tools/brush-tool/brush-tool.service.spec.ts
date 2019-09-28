import { TestBed } from '@angular/core/testing';

import { BrushToolService } from './brush-tool.service';

describe('BrushToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrushToolService = TestBed.get(BrushToolService);
    expect(service).toBeTruthy();
  });
});
