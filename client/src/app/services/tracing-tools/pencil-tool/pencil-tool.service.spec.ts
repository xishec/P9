import { TestBed } from '@angular/core/testing';

import { PencilToolService } from './pencil-tool.service';

describe('PencilToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PencilToolService = TestBed.get(PencilToolService);
    expect(service).toBeTruthy();
  });
});
