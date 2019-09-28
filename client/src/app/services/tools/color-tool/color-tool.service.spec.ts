import { TestBed } from '@angular/core/testing';

import { ColorToolService } from './color-tool.service';

describe('ColorToolService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ColorToolService = TestBed.get(ColorToolService);
        expect(service).toBeTruthy();
    });
});
