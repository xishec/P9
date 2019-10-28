import { TestBed } from '@angular/core/testing';

import { EraserToolService } from './eraser-tool.service';

describe('EraserToolService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: EraserToolService = TestBed.get(EraserToolService);
        expect(service).toBeTruthy();
    });
});
