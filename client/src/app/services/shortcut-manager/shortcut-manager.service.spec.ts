import { TestBed } from '@angular/core/testing';

import { ShortcutManagerService } from './shortcut-manager.service';

describe('ShortcutManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShortcutManagerService = TestBed.get(ShortcutManagerService);
    expect(service).toBeTruthy();
  });
});
