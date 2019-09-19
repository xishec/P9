import { TestBed } from '@angular/core/testing';

import { RectangleToolService } from './rectangle-tool.service';

describe('RectangleToolService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: RectangleToolService = TestBed.get(RectangleToolService);
        expect(service).toBeTruthy();
    });
});
