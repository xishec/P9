import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSliderChange } from '@angular/material';

import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { Thickness } from '../../../../../constants/tool-constants';
import { ShortcutManagerService } from '../../../../services/shortcut-manager/shortcut-manager.service';
import { PencilAttributesComponent } from './pencil-attributes.component';

fdescribe('PencilAttributesComponent', () => {
    let component: PencilAttributesComponent;
    let fixture: ComponentFixture<PencilAttributesComponent>;
    let event: MatSliderChange;
    let attributesManagerService: AttributesManagerService;
    let shortcutManagerService: ShortcutManagerService;
    const AVERAGE_THICKNESS = (Thickness.Min + Thickness.Max) / 2;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [FormBuilder, {
                provide: MatDialog,
                useValue: {},
            }],
        }).overrideComponent(PencilAttributesComponent, {
            set: {
                providers: [
                    {
                        provide: AttributesManagerService,
                        useValue: {
                            changeThickness: () => null,
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
        fixture = TestBed.createComponent(PencilAttributesComponent);
        component = fixture.componentInstance;

        event = new MatSliderChange();

        component.ngOnInit();

        attributesManagerService = fixture.debugElement.injector.get<AttributesManagerService>(
            AttributesManagerService,
        );
        shortcutManagerService = fixture.debugElement.injector.get<ShortcutManagerService>(ShortcutManagerService);
    }));

    it(`#onSliderChange should change the value of thickness if event value [${Thickness.Min},${Thickness.Max}]`, () => {
        event.value = AVERAGE_THICKNESS;
        const spy = spyOn(component, 'onThicknessChange').and.returnValue();

        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(AVERAGE_THICKNESS);
        expect(spy).toHaveBeenCalled();
    });

    it(`#onSliderChange should not change the value of thickness if event value  ]${Thickness.Min},${Thickness.Max}[`, () => {
        const spy = spyOn(component, 'onThicknessChange').and.returnValue();

        event.value = Thickness.Max + AVERAGE_THICKNESS;
        component.onSliderChange(event);
        event.value = Thickness.Min - AVERAGE_THICKNESS;
        component.onSliderChange(event);

        expect(spy).not.toHaveBeenCalled();
    });

    it('#onSliderChange should not call onThicknessChange if event value is null', () => {
        const spy = spyOn(component, 'onThicknessChange').and.returnValue();

        event.value = null;
        component.onSliderChange(event);

        expect(spy).not.toHaveBeenCalled();
    });

    it(`#onThicknessChange should call changeThickness if form thickness value is [${Thickness.Min},${Thickness.Max}]`, () => {
        component.pencilAttributesForm.controls.thickness.setValue(AVERAGE_THICKNESS);
        const spy = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(spy).toHaveBeenCalled();
    });

    it(`#onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness > ${Thickness.Max}`, () => {
        component.pencilAttributesForm.controls.thickness.setValue(Thickness.Max + AVERAGE_THICKNESS);
        const spy = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(spy).not.toHaveBeenCalled();
    });

    it(`#onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness < ${Thickness.Min}`, () => {
        component.pencilAttributesForm.controls.thickness.setValue(Thickness.Min - AVERAGE_THICKNESS);
        const spy = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(spy).not.toHaveBeenCalled();
    });

    it('#onFocus should call changeIsOnInput when user in on focus', () => {
        const spy = spyOn(shortcutManagerService, 'changeIsOnInput').and.returnValue();

        component.onFocus();

        expect(spy).toHaveBeenCalled();
    });

    it('#onFocus should  call changeIsOnInput when user is out of focus', () => {
        const spy = spyOn(shortcutManagerService, 'changeIsOnInput').and.returnValue();

        component.onFocusOut();

        expect(spy).toHaveBeenCalled();
    });
});
