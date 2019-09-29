import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ColorPickerComponent } from './color-picker.component';
import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';

const MOCK_COLOR = '#000000';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
            providers: [
                {
                    provide: ColorToolService,
                    useValue: {
                        currentPrimaryColor: () => MOCK_COLOR,
                    },
                },
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                    },
                },
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
});
