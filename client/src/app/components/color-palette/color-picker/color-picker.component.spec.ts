import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material';

import { createMouseEvent } from 'src/classes/test-helpers';
import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let colorToolService: ColorToolService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
            providers: [Renderer2],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideComponent(ColorPickerComponent, {
                set: {
                    providers: [
                        {
                            provide: ColorToolService,
                            useValue: {
                                translateRGBToHex: () => null,
                                getPreviewColorOpacityHex: () => null,
                                changePreviewColor: () => null,
                            },
                        },
                        {
                            provide: CanvasRenderingContext2D,
                            useValue: {
                                drawImage: () => null,
                            },
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        colorToolService = fixture.debugElement.injector.get<ColorToolService>(ColorToolService);
    }));

    beforeEach(() => null);

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onSliderChange should stop execution if the value of the event is null', () => {
        const event: MatSliderChange = new MatSliderChange();
        component.obscurity = 1;
        event.value = null;
        component.onSliderChange(event);
        expect(component.obscurity).toEqual(1);
    });

    it('onSliderChange should change obscurity level to the event\'s value ', () => {
        const event: MatSliderChange = new MatSliderChange();
        component.obscurity = 1;
        event.value = 2;
        component.onSliderChange(event);
        expect(component.obscurity).toEqual(2);
    });

    it(
        'onCanvasClick should not call changePreviewColor, translateRGBToHex getPreviewColorOpacityHex' +
            'and changePreviewColor when obscurity is 0',
        () => {
            const event: MouseEvent = createMouseEvent(2, 4, 6, 1, 1);

            const TRANSLATE_SPY = spyOn(colorToolService, 'translateRGBToHex');
            const GET_PREVIEW_SPY = spyOn(colorToolService, 'getPreviewColorOpacityHex');
            const CHANGE_PREVIEW_SPY = spyOn(colorToolService, 'changePreviewColor');

            component.onCanvasClick(event);

            expect(TRANSLATE_SPY).not.toHaveBeenCalled();
            expect(GET_PREVIEW_SPY).not.toHaveBeenCalled();
            expect(CHANGE_PREVIEW_SPY).not.toHaveBeenCalled();
        },
    );

    it(
        'onCanvasClick should  call changePreviewColor, translateRGBToHex getPreviewColorOpacityHex' +
            'and changePreviewColor  obscurity is 1',
        () => {
            const event: MouseEvent = createMouseEvent(2, 4, 6, 1, 1);

            const TRANSLATE_SPY = spyOn(colorToolService, 'translateRGBToHex');
            const GET_PREVIEW_SPY = spyOn(colorToolService, 'getPreviewColorOpacityHex');
            const CHANGE_PREVIEW_SPY = spyOn(colorToolService, 'changePreviewColor');

            component.obscurity = 1;
            component.onCanvasClick(event);

            expect(TRANSLATE_SPY).toHaveBeenCalled();
            expect(GET_PREVIEW_SPY).toHaveBeenCalled();
            expect(CHANGE_PREVIEW_SPY).toHaveBeenCalled();
        },
    );
});
