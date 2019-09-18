import { TestBed } from '@angular/core/testing';

import { DrawStackService } from './draw-stack.service';

describe('DrawStackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawStackService = TestBed.get(DrawStackService);
    expect(service).toBeTruthy();
  });
});
