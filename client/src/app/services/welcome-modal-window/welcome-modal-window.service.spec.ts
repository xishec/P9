import { TestBed } from '@angular/core/testing';

import { WelcomeModalWindowService } from './welcome-modal-window.service';

describe('WelcomeModalWindowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WelcomeModalWindowService = TestBed.get(WelcomeModalWindowService);
    expect(service).toBeTruthy();
  });
});
