import { TestBed } from '@angular/core/testing';

import { DrawingModalWindow } from './drawing-modal-window.service';

describe('DrawingModalWindow', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DrawingModalWindow = TestBed.get(DrawingModalWindow);
        expect(service).toBeTruthy();
    });
});
