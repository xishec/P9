import { TestBed } from '@angular/core/testing';

import { QuillToolService } from './quill-tool.service';

describe('QuillToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuillToolService = TestBed.get(QuillToolService);
    expect(service).toBeTruthy();
  });
});
