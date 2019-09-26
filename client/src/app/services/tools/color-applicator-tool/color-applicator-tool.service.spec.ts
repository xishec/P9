import { TestBed } from '@angular/core/testing';

import { ColorApplicatorToolService } from './color-applicator-tool.service';

describe('ColorApplicatorToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorApplicatorToolService = TestBed.get(ColorApplicatorToolService);
    expect(service).toBeTruthy();
  });
});
