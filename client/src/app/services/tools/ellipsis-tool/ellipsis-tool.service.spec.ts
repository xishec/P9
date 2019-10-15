import { TestBed } from '@angular/core/testing';

import { EllipsisToolService } from './ellipsis-tool.service';

describe('EllipsisToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EllipsisToolService = TestBed.get(EllipsisToolService);
    expect(service).toBeTruthy();
  });
});
