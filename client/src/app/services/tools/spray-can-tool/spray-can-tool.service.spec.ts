import { TestBed } from '@angular/core/testing';

import { SprayCanToolService } from './spray-can-tool.service';

describe('SprayCanToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SprayCanToolService = TestBed.get(SprayCanToolService);
    expect(service).toBeTruthy();
  });
});
