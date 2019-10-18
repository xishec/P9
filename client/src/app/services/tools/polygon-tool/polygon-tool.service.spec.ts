import { TestBed } from '@angular/core/testing';

import { PolygonToolService } from './polygon-tool.service';

describe('PolygonToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolygonToolService = TestBed.get(PolygonToolService);
    expect(service).toBeTruthy();
  });
});
