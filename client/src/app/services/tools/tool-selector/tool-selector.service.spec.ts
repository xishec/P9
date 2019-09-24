import { TestBed } from '@angular/core/testing';

import { ToolsService } from './tool-selector.service';

describe('ToolsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolsService = TestBed.get(ToolsService);
        expect(service).toBeTruthy();
    });
});
