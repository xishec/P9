import { TestBed } from '@angular/core/testing';

import { ModalManagerService } from './modal-manager.service';

describe('ModalManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalManagerService = TestBed.get(ModalManagerService);
    expect(service).toBeTruthy();
  });
});
