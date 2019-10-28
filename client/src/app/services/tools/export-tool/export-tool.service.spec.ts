import { TestBed } from '@angular/core/testing';

import { ExportToolService } from './export-tool.service';

describe('ExportToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportToolService = TestBed.get(ExportToolService);
    expect(service).toBeTruthy();
  });
});
