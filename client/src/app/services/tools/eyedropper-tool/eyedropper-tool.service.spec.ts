import { TestBed } from '@angular/core/testing';

import { EyedropperToolService } from './eyedropper-tool.service';

describe('EyedropperToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EyedropperToolService = TestBed.get(EyedropperToolService);
    expect(service).toBeTruthy();
  });
});
