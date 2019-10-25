import { TestBed } from '@angular/core/testing';

import { UndoRedoerService } from './undo-redoer.service';

describe('UndoRedoerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UndoRedoerService = TestBed.get(UndoRedoerService);
    expect(service).toBeTruthy();
  });
});
