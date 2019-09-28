import { /*async,*/ TestBed, /*ComponentFixture,*/ getTestBed } from '@angular/core/testing';

import { BehaviorSubject /*Observable*/ } from 'rxjs';
import { ColorToolService } from './color-tool.service';
import { MAX_NUMBER_OF_LAST_COLORS, COLORS } from 'src/constants/color-constants';

fdescribe('ColorToolService', () => {
    let service: ColorToolService;
    let injector: TestBed;
    let colorQueue: BehaviorSubject<string[]>;
    // let previewColor: BehaviorSubject<string>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorToolService],
        });
        injector = getTestBed();
        service = injector.get(ColorToolService);
        colorQueue = service['colorQueue'];
        //previewColor = service['previewColor'];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#addColorToQueue should add an element to the queue', () => {
        let begingColorQueueLength = colorQueue.value.length;
        service.addColorToQueue('string');
        expect(colorQueue.value.length).toBe(begingColorQueueLength + 1);
    });

    it('#addColorToQueue should return 10 for the length of the array if the staring length is 10', () => {
        colorQueue.value.length = MAX_NUMBER_OF_LAST_COLORS;
        service.addColorToQueue('string');
        expect(colorQueue.value.length).toBe(MAX_NUMBER_OF_LAST_COLORS);
    });

    it('#changePreviewColor should change color to "a970eb" ', () => {
        let color: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[4].hex);
        service.changePreviewColor('a970eb');
        expect(service['previewColor']).toEqual(color);
    });

    it('#rgbToHex should return 000000 if rgb is 0,0,0', () => {
        let hexNumber = service.rgbToHex(184, 130, 130);
        expect(hexNumber).toBe('b88282');
    });

    it('#rgbToHex should return 000000 if rgb is smaller than 0', () => {
        let hexNumber = service.rgbToHex(-10, -10, -10);
        expect(hexNumber).toBe('000000');
    });

    it('#rgbToHex should return ffffff if rgb is higher than 255', () => {
        let hexNumber = service.rgbToHex(999, 999, 999);
        expect(hexNumber).toBe('ffffff');
    });

    it('#correctRGB should return 25 if number is 37', () => {
        let hexNumber = service.correctRGB(37);
        expect(hexNumber).toBe('25');
    });
    it('#correctRGB should return 00 if number is negative', () => {
        let hexNumber = service.correctRGB(-10);
        expect(hexNumber).toBe('00');
    });

    it('#correctRGB should return ff if number is higher than 255', () => {
        let hexNumber = service.correctRGB(999);
        expect(hexNumber).toBe('ff');
    });

    it('#switchPrimarySecondary should change primaryColor to secondayColor after colors switch', () => {
        let primaryColor = service['primaryColor'].value;
        service.switchPrimarySecondary();
        expect(primaryColor).toEqual(service['secondaryColor'].value);
    });

    it('#switchPrimarySecondary should change secondaryColor to primaryColor after colors switch', () => {
        let secondayColor = service['secondaryColor'].value;
        service.switchPrimarySecondary();
        expect(secondayColor).toEqual(service['primaryColor'].value);
    });
});
