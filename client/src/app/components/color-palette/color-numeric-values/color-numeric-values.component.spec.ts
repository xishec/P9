import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorNumericValuesComponent } from './color-numeric-values.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

fdescribe('ColorNumericValuesComponent', () => {
  let component: ColorNumericValuesComponent;
  let fixture: ComponentFixture<ColorNumericValuesComponent>;
  let form: FormGroup; 

  const MOCK_COLOR = '01234567';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorNumericValuesComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorNumericValuesComponent);
    component = fixture.componentInstance;

    component.initializeForm();

    form = component.colorNumericValuesForm;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('by default RGB are 0 and A is 1', () => {
      expect(form.controls['R'].value).toEqual(0);
      expect(form.controls['G'].value).toEqual(0);
      expect(form.controls['B'].value).toEqual(0);
      expect(form.controls['A'].value).toEqual(1);
  });

  it('setColorNumericValues should call setHexValues before setRGBValues', () => {
      const spyOnSetHex = spyOn(component, 'setHexValues').and.returnValue();
      const spyOnSetRGB = spyOn(component, 'setRGBValues').and.returnValue();
      
      component.setColorNumericValues();

      expect(spyOnSetHex).toHaveBeenCalledBefore(spyOnSetRGB);
  });

  it(`when setHexValues with ${MOCK_COLOR} then this preview color is the first 6 char`, () => {
      component.previewColor = MOCK_COLOR;
      
      component.setHexValues();

      expect(form.controls['hex'].value).toEqual('012345');
  });

  it(`when setRGBValues with ${MOCK_COLOR} then R=01, G=23, B=45 A=0.2`, () => {
    component.previewColor = MOCK_COLOR;

    component.setRGBValues();

    expect(form.controls['R'].value).toEqual(1);
    expect(form.controls['G'].value).toEqual(35);
    expect(form.controls['B'].value).toEqual(69);
    expect(form.controls['A'].value).toEqual('0.4');
  });

});
