import { TestBed } from '@angular/core/testing';

import { StampToolService } from './stamp-tool.service';

describe('StampToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StampToolService = TestBed.get(StampToolService);
    expect(service).toBeTruthy();
  });
});
