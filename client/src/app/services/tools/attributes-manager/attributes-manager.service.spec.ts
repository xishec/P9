import { TestBed } from '@angular/core/testing';

import { AttributesManagerService } from './attributes-manager.service';

describe('AttributesManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttributesManagerService = TestBed.get(AttributesManagerService);
    expect(service).toBeTruthy();
  });
});
