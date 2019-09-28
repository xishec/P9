import { TestBed, getTestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { ColorToolService } from './color-tool.service';
import { MAX_NUMBER_OF_LAST_COLORS, COLORS, ColorType } from 'src/constants/color-constants';
import { Color } from '../../../../classes/Color';

fdescribe('ColorToolService', () => {
    let service: ColorToolService;
    let injector: TestBed;
    let colorQueue: BehaviorSubject<string[]>;
    let primaryColor: string = COLORS[0].hex;
    let secondaryColor: string = COLORS[1].hex;
    let backgroundColor: string = COLORS[2].hex;
    let focusColor: string = COLORS[5].hex;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorToolService],
        });
        injector = getTestBed();
        service = injector.get(ColorToolService);
        colorQueue = service['colorQueue'];
        service['backgroundColor'] = new BehaviorSubject<string>(backgroundColor);
        service['primaryColor'] = new BehaviorSubject<string>(primaryColor);
        service['secondaryColor'] = new BehaviorSubject<string>(secondaryColor);
        primaryColor = COLORS[0].hex;
        secondaryColor = COLORS[1].hex;
        backgroundColor = COLORS[2].hex;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#addColorToQueue should add an element to the queue', () => {
        let begingColorQueueLength = colorQueue.value.length;
        service.addColorToQueue('red');
        expect(colorQueue.value.length).toBe(begingColorQueueLength + 1);
    });

    it('#addColorToQueue should return 10 for the length of the array if the staring length is 10', () => {
        colorQueue.value.length = MAX_NUMBER_OF_LAST_COLORS;
        service.addColorToQueue('red');
        expect(colorQueue.value.length).toBe(MAX_NUMBER_OF_LAST_COLORS);
    });

    it('#changePreviewColor should change previewColor to "a970eb" ', () => {
        let color: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[4].hex);
        service.changePreviewColor('a970eb');
        expect(service['previewColor']).toEqual(color);
    });

    it('#changeBackgroundColor should change background-color to "a970eb" ', () => {
        let color: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[4].hex);
        service.changeBackgroundColor('a970eb');
        expect(service['backgroundColor']).toEqual(color);
    });

    it('#changeSelectedColor should change selectedColor to backgroundColor type', () => {
        let selectedColor: BehaviorSubject<ColorType> = new BehaviorSubject<ColorType>(ColorType.backgroundColor);
        service.changeSelectedColor(ColorType.backgroundColor);
        expect(service['selectedColor']).toEqual(selectedColor);
    });

    it('#changeCurrentShowColorPalette should change showColorPalette to true', () => {
        service['showColorPalette'] = new BehaviorSubject<boolean>(false);
        service.changeCurrentShowColorPalette(true);
        let showColorPalette = new BehaviorSubject<boolean>(true);
        expect(service['showColorPalette']).toEqual(showColorPalette);
    });

    it(`#changeColorOnFocus should change the background color to the focused color ${focusColor}`, () => {
        service['selectedColor'] = new BehaviorSubject<ColorType>(ColorType.backgroundColor);
        service.changeColorOnFocus(focusColor);
        expect(service['backgroundColor']).toEqual(new BehaviorSubject<string>(focusColor));
    });

    it(`#changeColorOnFocus should change the primaryColor color to the focused color ${focusColor}`, () => {
        service['selectedColor'] = new BehaviorSubject<ColorType>(ColorType.primaryColor);
        service.changeColorOnFocus(focusColor);
        expect(service['primaryColor']).toEqual(new BehaviorSubject<string>(focusColor));
    });

    it(`#changeColorOnFocus should change the secondaryColor color to the focused color ${focusColor}`, () => {
        service['selectedColor'] = new BehaviorSubject<ColorType>(ColorType.secondaryColor);
        service.changeColorOnFocus(focusColor);
        expect(service['secondaryColor']).toEqual(new BehaviorSubject<string>(focusColor));
    });

    it(`#changeColorOnFocus should not change the seconday color if the primary color is selected`, () => {
        let tmpSecondayColor: BehaviorSubject<string> = service['secondaryColor'];
        service['selectedColor'] = new BehaviorSubject<ColorType>(ColorType.primaryColor);
        service.changeColorOnFocus(focusColor);
        expect(service['secondaryColor']).toEqual(tmpSecondayColor);
    });

    it(`#getColorOnFocus should return ${backgroundColor} when backgroundColor is focused`, () => {
        service['selectedColor'] = new BehaviorSubject<ColorType>(ColorType.backgroundColor);
        expect(service.getColorOnFocus()).toEqual(backgroundColor);
    });

    it(`#getColorOnFocus should return ${primaryColor} when primaryColor is focused`, () => {
        service['selectedColor'] = new BehaviorSubject<ColorType>(ColorType.primaryColor);
        expect(service.getColorOnFocus()).toEqual(primaryColor);
    });

    it(`#getColorOnFocus should return ${secondaryColor} when secondaryColor is focused`, () => {
        service['selectedColor'] = new BehaviorSubject<ColorType>(ColorType.secondaryColor);
        expect(service.getColorOnFocus()).toEqual(secondaryColor);
    });

    it(`#getColorOnFocus should return ${new Color().hex} when selectedColor is undefined`, () => {
        service['selectedColor'] = new BehaviorSubject<undefined>(undefined);
        expect(service.getColorOnFocus()).toEqual(new Color().hex);
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
