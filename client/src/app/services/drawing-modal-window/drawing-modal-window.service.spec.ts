import { getTestBed, TestBed } from '@angular/core/testing';

import { DrawingInfo } from 'src/classes/DrawingInfo';
import { DrawingModalWindowService } from './drawing-modal-window.service';

const WIDTH = 100;
const HEIGHT = 100;
const COLOR = '000000';

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

    it(`changeDrawingInfo with ${WIDTH}, ${HEIGHT} and ${COLOR} should update drawingInfo`, () => {
        service.changeDrawingInfo(WIDTH, HEIGHT, COLOR);

        expect(service.drawingInfo.value.width).toEqual(WIDTH);
        expect(service.drawingInfo.value.height).toEqual(HEIGHT);
        expect(service.drawingInfo.value.color).toEqual(COLOR);
    });
});
