import { TestBed } from '@angular/core/testing';

import { ManipulatorService } from './manipulator.service';

describe('ManipulatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManipulatorService = TestBed.get(ManipulatorService);
    expect(service).toBeTruthy();
  });
});
