import { TestBed } from '@angular/core/testing';

import { DrawingInfoService } from './drawing-info.service';

describe('DrawingInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawingInfoService = TestBed.get(DrawingInfoService);
    expect(service).toBeTruthy();
  });
});
