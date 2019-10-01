import { getTestBed, TestBed } from '@angular/core/testing';

import { DrawingInfo } from 'src/classes/DrawingInfo';
import { DrawingModalWindowService } from './drawing-modal-window.service';

const WIDTH = 100;
const HEIGHT = 100;

describe('DrawingModalWindowService', () => {
    let injector: TestBed;
    let service: DrawingModalWindowService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DrawingModalWindowService, DrawingInfo],
        });

        injector = getTestBed();
        service = injector.get(DrawingModalWindowService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(`changeDrawingInfoWidthHeight with ${WIDTH} and ${HEIGHT} should update drawingInfo`, () => {
        service.changeDrawingInfoWidthHeight(WIDTH, HEIGHT);

        expect(service.drawingInfo.value.width).toEqual(WIDTH);
        expect(service.drawingInfo.value.height).toEqual(HEIGHT);
    });

    it(`should call changeDisplayNewDrawingModalWindow with true`, () => {
        service[`displayNewDrawingModalWindow`].next = () => null;
        const SPY = spyOn(service[`displayNewDrawingModalWindow`], 'next');
        service.changeDisplayNewDrawingModalWindow(true);
        expect(SPY).toHaveBeenCalledWith(true);
    });
});
