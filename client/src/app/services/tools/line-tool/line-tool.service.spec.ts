import { TestBed } from '@angular/core/testing';

import { LineToolService } from './line-tool.service';

describe('LineToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineToolService = TestBed.get(LineToolService);
    expect(service).toBeTruthy();
  });
});
