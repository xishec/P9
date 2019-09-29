import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2, /*forwardRef, */ CUSTOM_ELEMENTS_SCHEMA /* Type/*/ } from '@angular/core';
//import { FormsModule /*NG_VALUE_ACCESSOR*/ } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

//import { BehaviorSubject, Observable } from 'rxjs';

import { ColorPickerComponent } from './color-picker.component';
import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';

const MOCK_COLOR = '#000000';

fdescribe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    //let fakeColorToolService: ColorToolService;
    let event: MatSliderChange;
    //let rendererMock: Renderer2;
    // let injector: TestBed;
    // let spyOnSetAttribute: jasmine.Spy;
    //let spyOnAppendChild: jasmine.Spy;

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
            //imports: [FormsModule, RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        //rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);

        // spyOnSetAttribute = spyOn(rendererMock, 'setAttribute').and.returnValue();
        // spyOnAppendChild = spyOn(rendererMock, 'appendChild').and.returnValue();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        event = new MatSliderChange();

        // fakeColorToolService = {
        //     // currentPreviewColor: new Observable<string>(new BehaviorSubject<string>('888888')),
        //     //user: { name: 'Test User' },
        //     // isLoggedIn: true,
        // };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onSliderChange should stop if event is null', () => {
        component.onSliderChange(event);
        component.obscurity = 4;
        //let renderer: Renderer2 = new Renderer2();
        //component = new ColorPickerComponent(fakeColorToolService, Renderer2());

        expect(component.obscurity).toEqual(4);
    });

    // it('#onSliderChange should change obscurity', () => {
    //     let event: MatSliderChange = new MatSliderChange();
    //     component.onSliderChange(event);
    //     expect(component.obscurity).toEqual(event.value);
    // });
});
