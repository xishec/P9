import { TestBed } from '@angular/core/testing';

import { ShortcutsManagerService } from './shortcuts-manager.service';

describe('ShortcutsManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShortcutsManagerService = TestBed.get(ShortcutsManagerService);
    expect(service).toBeTruthy();
  });
});
