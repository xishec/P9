import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material';

import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';
import { ColorPickerComponent } from './color-picker.component';
import { createMouseEvent } from 'src/classes/test-helpers';

fdescribe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
            providers: [
                ColorToolService,
                Renderer2,
                // {
                //     provide: Renderer2,
                //     useValue: {
                //         createElement: () => null,
                //         setAttribute: () => null,
                //         appendChild: () => null,
                //     },
                // },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onSliderChange should stop execution if the value of the event is null', () => {
        let event: MatSliderChange = new MatSliderChange();
        component.obscurity = 1;
        event.value = null;
        component.onSliderChange(event);
        expect(component.obscurity).toEqual(1);
    });

    it("#onSliderChange should change obscurity level to the event's value ", () => {
        let event: MatSliderChange = new MatSliderChange();
        component.obscurity = 1;
        event.value = 2;
        component.onSliderChange(event);
        expect(component.obscurity).toEqual(2);
    });

    it('#onCanvasClick should not change obscurity to 0 if obscurity is defined', () => {
        let event: MouseEvent = createMouseEvent(0, 0, 0);
        component.obscurity = 1;
        const valueServiceSpy: jasmine.SpyObj<CanvasRenderingContext2D> = jasmine.createSpyObj(
            'CanvasRenderingContext2D',
            ['getImageData'],
        );
        const stubValue: ImageData = new ImageData(10, 10);

        valueServiceSpy.getImageData.and.returnValue(stubValue);

        component.onCanvasClick(event);
        expect(component.obscurity).toEqual(1);
    });
});
