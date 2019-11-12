import { TestBed } from '@angular/core/testing';

import { FillToolService } from './fill-tool.service';

describe('FillToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FillToolService = TestBed.get(FillToolService);
    expect(service).toBeTruthy();
  });
});
