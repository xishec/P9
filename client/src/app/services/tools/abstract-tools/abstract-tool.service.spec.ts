import { TestBed } from '@angular/core/testing';

import { AbstractToolService } from './abstract-tool.service';

describe('AbstractToolService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: AbstractToolService = TestBed.get(AbstractToolService);
        expect(service).toBeTruthy();
    });
});
