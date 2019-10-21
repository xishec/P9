import { TestBed } from '@angular/core/testing';

import { SelectionToolService } from './selection-tool.service';

describe('SelectionToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectionToolService = TestBed.get(SelectionToolService);
    expect(service).toBeTruthy();
  });
});
