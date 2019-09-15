import { TestBed } from '@angular/core/testing';

import { AbstractShapeToolService } from './abstract-shape-tool.service';

describe('AbstractShapeToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbstractShapeToolService = TestBed.get(AbstractShapeToolService);
    expect(service).toBeTruthy();
  });
});
