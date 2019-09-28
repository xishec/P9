import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { PencilAttributesComponent } from './pencil-attributes.component';
import { Thickness } from '../../../../../constants/tool-constants';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ShortcutManagerService } from '../../../../services/shortcut-manager/shortcut-manager.service';

describe('PencilAttributesComponent', () => {
    let component: PencilAttributesComponent;
    let fixture: ComponentFixture<PencilAttributesComponent>;
    let event: MatSliderChange;
    let attributesManageService: AttributesManagerService;
    let shortcutManagerService: ShortcutManagerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
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
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilAttributesComponent);
        component = fixture.componentInstance;
        component.initializeForm();

        event = new MatSliderChange();

        let injector = getTestBed();
        attributesManageService = injector.get<AttributesManagerService>(AttributesManagerService);
        shortcutManagerService = injector.get<ShortcutManagerService>(ShortcutManagerService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`#onSliderChange should change the value of thickness if event value [${Thickness.Min},${Thickness.Max}]`, () => {
        event.value = Thickness.Default;
        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(Thickness.Default);
    });

    it(`#onSliderChange should not change the value of thickness if event value < ${Thickness.Min}`, () => {
        const oldValue = component.pencilAttributesForm.value.thickness;

        event.value = Thickness.Min - 1;
        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(oldValue);
    });

    it(`#onSliderChange should not change the value of thickness if event value > ${Thickness.Max}`, () => {
        const oldValue = component.pencilAttributesForm.value.thickness;

        event.value = Thickness.Max + 1;
        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(oldValue);
    });

    it('#onSliderChange should not change the value of thickness if event value is null', () => {
        const oldValue = component.pencilAttributesForm.value.thickness;

        event.value = null;
        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(oldValue);
    });

    it(`#onSliderChange should call onThicknessChange if event value is [${Thickness.Min},${Thickness.Max}]`, () => {
        spyOn(component, 'onThicknessChange');
        event.value = Thickness.Default;
        component.onSliderChange(event);

        expect(component.onThicknessChange).toHaveBeenCalled();
    });

    it(`#onThicknessChange should call changeThickness if form thickness value is [${Thickness.Min},${Thickness.Max}]`, () => {
        let spy = spyOn(attributesManageService, 'changeThickness').and.returnValue();
        component.onThicknessChange();
        expect(spy).toHaveBeenCalled();
    });

    it(`#onThicknessChange should not change thickness of AttibuteManagerService if form thickness > ${Thickness.Max}`, () => {
        const oldValue = component.pencilAttributesForm.value.thickness;

        component.pencilAttributesForm.controls.thickness.setValue(Thickness.Max + 1);
        component.onThicknessChange();

        expect(attributesManageService.thickness.getValue()).toBe(oldValue);
    });

    it(`#onThicknessChange should not change thickness of AttibuteManagerService if form thickness < ${Thickness.Min}`, () => {
        const oldValue = component.pencilAttributesForm.value.thickness;
        component.pencilAttributesForm.controls.thickness.setValue(Thickness.Min - 1);

        component.onThicknessChange();

        expect(attributesManageService.thickness.getValue()).toBe(oldValue);
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
});
