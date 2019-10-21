import { TestBed } from '@angular/core/testing';

import { DrawingSaverService } from './drawing-saver.service';

describe('DrawingSaverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawingSaverService = TestBed.get(DrawingSaverService);
    expect(service).toBeTruthy();
  });
});
