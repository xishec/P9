import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleAttributesComponent } from './rectangle-attributes.component';
import { MatSliderChange } from '@angular/material';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Thickness } from 'src/constants/tool-constants';

fdescribe('RectangleAttributesComponent', () => {
    let component: RectangleAttributesComponent;
    let fixture: ComponentFixture<RectangleAttributesComponent>;
    let event: MatSliderChange;
    let attributesManagerService: AttributesManagerService;
    let shortcutManagerService: ShortcutManagerService;
    const AVERAGE_THICKNESS = (Thickness.Min + Thickness.Max) / 2;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [FormBuilder],
        }).overrideComponent(RectangleAttributesComponent, {
            set: {
                providers: [
                    {
                        provide: AttributesManagerService,
                        useValue: {
                            changeThickness: () => null,
                            changeTraceType: () => null,
                        },
                    },
                    {
                        provide: ShortcutManagerService,
                        useValue: {
                            changeIsOnInput: () => null,
                        },
                    },
                ],
            },
        });
        fixture = TestBed.createComponent(RectangleAttributesComponent);
        component = fixture.componentInstance;

        event = new MatSliderChange();

        component.ngOnInit();

        attributesManagerService = fixture.debugElement.injector.get<AttributesManagerService>(
            AttributesManagerService
        );
        shortcutManagerService = fixture.debugElement.injector.get<ShortcutManagerService>(ShortcutManagerService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`#onSliderChange should change the value of thickness if event value [${Thickness.Min},${Thickness.Max}]`, () => {
        event.value = AVERAGE_THICKNESS;
        let spy = spyOn(component, 'onThicknessChange').and.returnValue();

        component.onSliderChange(event);

        expect(component.rectangleAttributesForm.value.thickness).toBe(AVERAGE_THICKNESS);
        expect(spy).toHaveBeenCalled();
    });

    it(`#onSliderChange should not change the value of thickness if event value  ]${Thickness.Min},${Thickness.Max}[`, () => {
        let spy = spyOn(component, 'onThicknessChange').and.returnValue();

        event.value = Thickness.Max + AVERAGE_THICKNESS;
        component.onSliderChange(event);
        event.value = Thickness.Min - AVERAGE_THICKNESS;
        component.onSliderChange(event);

        expect(spy).not.toHaveBeenCalled();
    });

    it('#onSliderChange should not call onThicknessChange if event value is null', () => {
        let spy = spyOn(component, 'onThicknessChange').and.returnValue();

        event.value = null;
        component.onSliderChange(event);

        expect(spy).not.toHaveBeenCalled();
    });

    it(`#onThicknessChange should call changeThickness if form thickness value is [${Thickness.Min},${Thickness.Max}]`, () => {
        component.rectangleAttributesForm.controls.thickness.setValue(AVERAGE_THICKNESS);
        let spy = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(spy).toHaveBeenCalled();
    });

    it(`#onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness > ${Thickness.Max}`, () => {
        component.rectangleAttributesForm.controls.thickness.setValue(Thickness.Max + AVERAGE_THICKNESS);
        let spy = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(spy).not.toHaveBeenCalled();
    });

    it(`#onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness < ${Thickness.Min}`, () => {
        component.rectangleAttributesForm.controls.thickness.setValue(Thickness.Min - AVERAGE_THICKNESS);
        let spy = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(spy).not.toHaveBeenCalled();
    });

    it('#onFocus should call changeIsOnInput when user in on focus', () => {
        let spy = spyOn(shortcutManagerService, 'changeIsOnInput').and.returnValue();

        component.onFocus();

        expect(spy).toHaveBeenCalled();
    });

    it('#onFocus should  call changeIsOnInput when user is out of focus', () => {
        let spy = spyOn(shortcutManagerService, 'changeIsOnInput').and.returnValue();

        component.onFocusOut();

        expect(spy).toHaveBeenCalled();
    });

    it('#change should call changeStyle when user select a trace type', () => {
        let spy = spyOn(attributesManagerService, 'changeTraceType').and.returnValue();

        component.onTraceTypeChange();

        expect(spy).toHaveBeenCalled();
    });
});
