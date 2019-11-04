import { TestBed } from '@angular/core/testing';

import { TextToolService } from './text-tool.service';

describe('TextToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextToolService = TestBed.get(TextToolService);
    expect(service).toBeTruthy();
  });
});
