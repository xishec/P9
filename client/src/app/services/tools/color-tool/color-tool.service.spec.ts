import { getTestBed, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import {
    ColorType,
    DEFAULT_GRAY_0,
    DEFAULT_GRAY_1,
    DEFAULT_WHITE,
    MAX_NUMBER_OF_LAST_COLORS,
} from 'src/constants/color-constants';
import { ColorToolService } from './color-tool.service';

describe('ColorToolService', () => {
    let service: ColorToolService;
    let injector: TestBed;
    let colorQueue: BehaviorSubject<string[]>;
    let primaryColor: string = DEFAULT_GRAY_0;
    let secondaryColor: string = DEFAULT_GRAY_1;
    let backgroundColor: string = DEFAULT_WHITE;
    const focusColor = '666666f11';
    let previewColor = new BehaviorSubject<string>(DEFAULT_WHITE);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorToolService],
        });
        injector = getTestBed();
        service = injector.get(ColorToolService);
        colorQueue = service.colorQueue;
        service.backgroundColor = new BehaviorSubject<string>(backgroundColor);
        service.primaryColor = new BehaviorSubject<string>(primaryColor);
        service.secondaryColor = new BehaviorSubject<string>(secondaryColor);
        primaryColor = DEFAULT_GRAY_0;
        secondaryColor = DEFAULT_GRAY_1;
        backgroundColor = DEFAULT_WHITE;
        previewColor = new BehaviorSubject<string>(DEFAULT_WHITE);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#addColorToQueue should add an element to the queue', () => {
        const begingColorQueueLength = colorQueue.value.length;
        service.addColorToQueue('red');
        expect(colorQueue.value.length).toBe(begingColorQueueLength + 1);
    });

    it('#addColorToQueue should return 10 for the length of the array if the staring length is 10', () => {
        colorQueue.value.length = MAX_NUMBER_OF_LAST_COLORS;
        service.addColorToQueue('red');
        expect(colorQueue.value.length).toBe(MAX_NUMBER_OF_LAST_COLORS);
    });

    it(`#changePreviewColor should change previewColor to ${DEFAULT_WHITE} `, () => {
        const color: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_WHITE);
        service.changePreviewColor(DEFAULT_WHITE);
        expect(service.previewColor).toEqual(color);
    });

    it(`#changeBackgroundColor should change background-color to ${DEFAULT_WHITE} `, () => {
        const color: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_WHITE);
        service.changeBackgroundColor(DEFAULT_WHITE);
        expect(service.backgroundColor).toEqual(color);
    });

    it('#changeselectedColorType should change selectedColorType to backgroundColor type', () => {
        const selectedColorType: BehaviorSubject<ColorType> = new BehaviorSubject<ColorType>(ColorType.backgroundColor);
        service.changeSelectedColorType(ColorType.backgroundColor);
        expect(service.selectedColorType).toEqual(selectedColorType);
    });

    it('#changeCurrentShowColorPalette should change showColorPalette to true', () => {
        service.showColorPalette = new BehaviorSubject<boolean>(false);
        service.changShowColorPalette(true);
        const showColorPalette = new BehaviorSubject<boolean>(true);
        expect(service.showColorPalette).toEqual(showColorPalette);
    });

    it(`#changeColorOnFocus should change the background color to the focused color ${focusColor}`, () => {
        service.selectedColorType = new BehaviorSubject<ColorType>(ColorType.backgroundColor);
        service.changeColorOnFocus(focusColor);
        expect(service.backgroundColor).toEqual(new BehaviorSubject<string>(focusColor));
    });

    it(`#changeColorOnFocus should change the primaryColor color to the focused color ${focusColor}`, () => {
        service.selectedColorType = new BehaviorSubject<ColorType>(ColorType.primaryColor);
        service.changeColorOnFocus(focusColor);
        expect(service.primaryColor).toEqual(new BehaviorSubject<string>(focusColor));
    });

    it(`#changeColorOnFocus should change the secondaryColor color to the focused color ${focusColor}`, () => {
        service.selectedColorType = new BehaviorSubject<ColorType>(ColorType.secondaryColor);
        service.changeColorOnFocus(focusColor);
        expect(service.secondaryColor).toEqual(new BehaviorSubject<string>(focusColor));
    });

    it(`#changeColorOnFocus should not change the seconday color if the primary color is selected`, () => {
        const tmpSecondayColor: BehaviorSubject<string> = service.secondaryColor;
        service.selectedColorType = new BehaviorSubject<ColorType>(ColorType.primaryColor);
        service.changeColorOnFocus(focusColor);
        expect(service.secondaryColor).toEqual(tmpSecondayColor);
    });

    it(`#getColorOnFocus should return ${backgroundColor} when backgroundColor is focused`, () => {
        service.selectedColorType = new BehaviorSubject<ColorType>(ColorType.backgroundColor);
        expect(service.getColorOnFocus()).toEqual(backgroundColor);
    });

    it(`#getColorOnFocus should return ${primaryColor} when primaryColor is focused`, () => {
        service.selectedColorType = new BehaviorSubject<ColorType>(ColorType.primaryColor);
        expect(service.getColorOnFocus()).toEqual(primaryColor);
    });

    it(`#getColorOnFocus should return ${secondaryColor} when secondaryColor is focused`, () => {
        service.selectedColorType = new BehaviorSubject<ColorType>(ColorType.secondaryColor);
        expect(service.getColorOnFocus()).toEqual(secondaryColor);
    });

    it(`#getColorOnFocus should return ${DEFAULT_WHITE} when selectedColorType is undefined`, () => {
        service.selectedColorType = new BehaviorSubject<undefined>(undefined);
        expect(service.getColorOnFocus()).toEqual(DEFAULT_WHITE);
    });

    it('#translateRGBToHex should return b88282 if rgb is 184,130,130', () => {
        expect(service.translateRGBToHex(184, 130, 130)).toBe('b88282');
    });

    it('#translateRGBToHex should return 000000 if rgb is smaller than 0', () => {
        expect(service.translateRGBToHex(-10, -10, -10)).toBe('000000');
    });

    it(`#translateRGBToHex should return ${DEFAULT_WHITE} if rgb is higher than 255`, () => {
        expect(service.translateRGBToHex(999, 999, 999, 1)).toBe(DEFAULT_WHITE);
    });

    it(`#translateRGBToHex should return b882821a if rgb is 184, 130, 130 and opacity is 0.1`, () => {
        expect(service.translateRGBToHex(184, 130, 130, 0.1)).toBe('b882821a');
    });

    it(`#translateRGBToHex should return b8828200 if rgb is 184, 130, 130 and opacity is 0`, () => {
        expect(service.translateRGBToHex(184, 130, 130, 0)).toBe('b8828200');
    });

    it('#DecimalToHex should return 25 if number is 37', () => {
        expect(service.DecimalToHex(37)).toBe('25');
    });

    it('#DecimalToHex should return 00 if number is negative', () => {
        expect(service.DecimalToHex(-10)).toBe('00');
    });

    it('#DecimalToHex should return ff if number is higher than 255', () => {
        expect(service.DecimalToHex(999)).toBe('ff');
    });

    it('#switchPrimarySecondary should change primaryColor to secondaryColor after colors switch', () => {
        service.switchPrimarySecondary();
        expect(service.primaryColor.value).toEqual(service.secondaryColor.value);
    });

    it('#switchPrimarySecondary should change secondaryColor to primaryColor after colors switch', () => {
        service.switchPrimarySecondary();
        expect(service.secondaryColor.value).toEqual(service.primaryColor.value);
    });

    it(`#getPreviewColorOpacityHex should return ${previewColor.value.slice(6, 8)} the opacity of previewColor`, () => {
        service.previewColor = previewColor;
        expect(service.getPreviewColorOpacityHex()).toEqual(previewColor.value.slice(6, 8));
    });

    it(`#getPreviewColorOpacityDecimal should return 1 when the opacity of previewColor is "ff"`, () => {
        service.previewColor = new BehaviorSubject<string>('888888ff');
        expect(service.getPreviewColorOpacityDecimal()).toEqual('1');
    });

    it(`#getPreviewColorOpacityDecimal should return 0 when the opacity of previewColor is "00"`, () => {
        service.previewColor = new BehaviorSubject<string>('88888800');
        expect(service.getPreviewColorOpacityDecimal()).toEqual('0');
    });

    it(`#getPreviewColorOpacityDecimal should return 0 when the opacity of previewColor is "11"`, () => {
        service.previewColor = new BehaviorSubject<string>('88888811');
        expect(service.getPreviewColorOpacityDecimal()).toEqual('0.1');
    });
});
