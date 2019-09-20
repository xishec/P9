import { TestBed } from '@angular/core/testing';

import { TracingToolService } from './tracing-tool.service';

describe('TracingToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TracingToolService = TestBed.get(TracingToolService);
    expect(service).toBeTruthy();
  });
});
