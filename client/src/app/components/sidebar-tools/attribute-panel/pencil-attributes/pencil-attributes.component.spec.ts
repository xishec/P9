import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { PencilAttributesComponent } from './pencil-attributes.component';
import { Thickness } from '../../../../../constants/tool-constants';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ShortcutManagerService } from '../../../../services/shortcut-manager/shortcut-manager.service';

fdescribe('PencilAttributesComponent', () => {
    let component: PencilAttributesComponent;
    let fixture: ComponentFixture<PencilAttributesComponent>;
    let event: MatSliderChange;
    let attributesManageService: AttributesManagerService;
    // let shortcutManagerService: ShortcutManagerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [FormBuilder, AttributesManagerService, ShortcutManagerService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilAttributesComponent);
        component = fixture.componentInstance;
        component.initializeForm();

        event = new MatSliderChange();
        attributesManageService = new AttributesManagerService();
        // shortcutManagerService = new ShortcutManagerService();
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
        const validMockValue = 5;

        event.value = validMockValue;
        component.onSliderChange(event);

        expect(component.onThicknessChange).toHaveBeenCalled();
    });

    it(`#onThicknessChange should change thickness of AttibuteManagerService if form thickness value is [${Thickness.Min},${Thickness.Max}]`, () => {
        component.pencilAttributesForm.controls.thickness.setValue(4);
        component.onThicknessChange();

        console.log(attributesManageService.thickness.getValue());
        expect(attributesManageService.thickness.getValue()).toBe(4);
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

    it('#onFocus should call changeIsOnInput when user in on focus', () => {});
});
