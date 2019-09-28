import { /*async,*/ TestBed, /*ComponentFixture,*/ getTestBed } from '@angular/core/testing';

import { ColorToolService } from './color-tool.service';

fdescribe('switchPrimarySecondary', () => {
    let service: ColorToolService;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorToolService],
        });

        injector = getTestBed();
        service = injector.get(ColorToolService);
    });

    it('should be created', () => {
        //const service: ColorToolService = TestBed.get(ColorToolService);
        expect(service).toBeTruthy();
    });

    it('should change primaryColor to secondayColor after colors switch', () => {
        let primaryColor = service['primaryColor'].value;
        service.switchPrimarySecondary();
        expect(primaryColor).toBe(service['secondaryColor'].value);
    });

    it('should change secondaryColor to primaryColor after colors switch', () => {
        let secondayColor = service['secondaryColor'].value;
        service.switchPrimarySecondary();
        expect(secondayColor).toBe(service['primaryColor'].value);
    });
});
