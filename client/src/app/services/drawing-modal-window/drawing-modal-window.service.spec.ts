import { TestBed, getTestBed } from '@angular/core/testing';

import { DrawingModalWindowService } from './drawing-modal-window.service';
import { DrawingInfo } from 'src/classes/DrawingInfo';

const WIDTH = 100;
const HEIGHT = 100;

fdescribe('DrawingModalWindowService', () => {
    let injector: TestBed;
    let service: DrawingModalWindowService;

    beforeEach(() =>  {
        TestBed.configureTestingModule({
            providers: [DrawingModalWindowService, DrawingInfo],
        })

        injector = getTestBed();
        service = injector.get(DrawingModalWindowService);
    });

    it('should be created', () =>{
        expect(service).toBeTruthy();
    });

    it(`changeDrawingInfoWidthHeight with ${WIDTH} and ${HEIGHT} should update drawingInfo`, () => {
        service.changeDrawingInfoWidthHeight(WIDTH, HEIGHT);

        expect(service.drawingInfo.value.width).toEqual(WIDTH);
        expect(service.drawingInfo.value.height).toEqual(HEIGHT);
    });

});
