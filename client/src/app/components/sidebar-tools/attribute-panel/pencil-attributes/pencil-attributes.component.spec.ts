import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { PencilAttributesComponent } from './pencil-attributes.component';
import { Thickness } from '../../../../../constants/tool-constants';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';

fdescribe('PencilAttributesComponent', () => {
    let component: PencilAttributesComponent;
    let fixture: ComponentFixture<PencilAttributesComponent>;
    let event: MatSliderChange;
    let attributesManageServiceSpy: AttributesManagerService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [FormBuilder, AttributesManagerService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilAttributesComponent);
        component = fixture.componentInstance;
        component.initializeForm();
        event = new MatSliderChange();
        attributesManageServiceSpy = new AttributesManagerService();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`#onSliderChange should change the value of thickness if event value [${Thickness.Min},${Thickness.Max}]`, () => {
        const validMockValue = 5;

        event.value = validMockValue;
        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(validMockValue);
    });

    it(`#onSliderChange should not change the value of thickness if event value < ${Thickness.Min}`, () => {
        const negativeMockValue = -5;
        let oldValue = component.pencilAttributesForm.value.thickness;

        event.value = negativeMockValue;
        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(oldValue);
    });

    it(`#onSliderChange should not change the value of thickness if event value > ${Thickness.Max}`, () => {
        const negativeMockValue = -5;
        let oldValue = component.pencilAttributesForm.value.thickness;

        event.value = negativeMockValue;
        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(oldValue);
    });

    it('#onSliderChange should not change the value of thickness if event value is null', () => {
        const nullMockValue = null;
        let oldValue = component.pencilAttributesForm.value.thickness;

        event.value = nullMockValue;
        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(oldValue);
    });

    it('#onSliderChange should call onThicknessChange if event value is valid', () => {
        spyOn(component, 'onThicknessChange');
        const validMockValue = 5;

        event.value = validMockValue;
        component.onSliderChange(event);

        expect(component.onThicknessChange).toHaveBeenCalled();
    });

    it('#onThicknessChange should change thickness of AttibuteManagerService if form thickness value is valid', () => {
        const validMockValue: number = Thickness.Default;

        component.pencilAttributesForm.controls.thickness.setValue(validMockValue);
        component.onThicknessChange();

        expect(attributesManageServiceSpy.thickness.getValue()).toBe(validMockValue);
    });

    it("#onThicknessChange should not change thickness of AttibuteManagerService if form thickness value isn't valid", () => {
        const validMockValue = Thickness.Max + 1;
        const oldValue = component.pencilAttributesForm.value.thickness;
        component.pencilAttributesForm.controls.thickness.setValue(validMockValue);
        component.onThicknessChange();

        expect(attributesManageServiceSpy.thickness.getValue()).toBe(oldValue);
    });
});
