import { TestBed, getTestBed } from '@angular/core/testing';

import { ToolSelectorService } from './tool-selector.service';

fdescribe('ToolSelectorService', () => {
    let injector: TestBed;
    let service: ToolSelectorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToolSelectorService]
        });

        injector = getTestBed();
        service = injector.get(ToolSelectorService);
    });
    

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
