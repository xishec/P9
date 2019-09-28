import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilAttributesComponent } from './pencil-attributes.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatSliderChange } from '@angular/material';

import { Thickness } from '../../../../../constants/tool-constants';

fdescribe('PencilAttributesComponent', () => {
    let component: PencilAttributesComponent;
    let fixture: ComponentFixture<PencilAttributesComponent>;
    let event: MatSliderChange;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [FormBuilder],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilAttributesComponent);
        component = fixture.componentInstance;
        component.initializeForm();
        event = new MatSliderChange();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        console.log(component);
    });

    it(`#onSliderChange should change the value of thickness if event value [${Thickness.Min},${Thickness.Max}]`, () => {
        const valid_mock_value = 5;

        event.value = valid_mock_value;
        component.onSliderChange(event);

        expect(component.pencilAttributesForm.value.thickness).toBe(valid_mock_value);
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
});
