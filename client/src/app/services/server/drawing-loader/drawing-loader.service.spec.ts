import { TestBed } from '@angular/core/testing';

import { DrawingLoaderService } from './drawing-loader.service';

describe('DrawingLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawingLoaderService = TestBed.get(DrawingLoaderService);
    expect(service).toBeTruthy();
  });
});
