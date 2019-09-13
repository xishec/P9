import { TestBed } from '@angular/core/testing';

import { DrawingModalWindowService } from './drawing-modal-window.service';

describe('DrawingModalWindowService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DrawingModalWindowService = TestBed.get(DrawingModalWindowService);
        expect(service).toBeTruthy();
    });
});
