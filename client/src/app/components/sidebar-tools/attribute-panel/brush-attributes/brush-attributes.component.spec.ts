import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { BrushAttributesComponent } from './brush-attributes.component';
import { MatSliderChange } from '@angular/material';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { FormBuilder } from '@angular/forms';
import { Thickness } from 'src/constants/tool-constants';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('BrushAttributesComponent', () => {
    let component: BrushAttributesComponent;
    let fixture: ComponentFixture<BrushAttributesComponent>;
    let event: MatSliderChange;
    let attributesManagerService: AttributesManagerService;
    let shortcutManagerService: ShortcutManagerService;
    let shit: AttributesManagerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrushAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [FormBuilder],
        }).overrideComponent(BrushAttributesComponent, {
            set: {
                providers: [
                    {
                        provide: AttributesManagerService,
                        useValue: {
                            changeThickness: () => null,
                            changeStyle: () => 1,
                        },
                    },
                    {
                        provide: ShortcutManagerService,
                        useValue: {
                            changeIsOnInput: () => null,
                        },
                    },
                ],
            }
        })
        .compileComponents();
        fixture = TestBed.createComponent(BrushAttributesComponent);
        component = fixture.componentInstance;

        let injector = getTestBed();
        
        event = new MatSliderChange();

        component.ngOnInit();

        shit = fixture.debugElement.injector.get<AttributesManagerService>(AttributesManagerService);

        attributesManagerService = injector.get<AttributesManagerService>(AttributesManagerService);
        shortcutManagerService = injector.get<ShortcutManagerService>(ShortcutManagerService);

    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`#onSliderChange should change the value of thickness if event value [${Thickness.Min},${Thickness.Max}]`, () => {
        event.value = Thickness.Default - 1;
        const spy = spyOn(component, 'onThicknessChange').and.returnValue();

        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(Thickness.Default - 1);
        expect(spy).toHaveBeenCalled();
    });

    it(`#onSliderChange should not change the value of thickness if event value < ${Thickness.Min}`, () => {
        const oldValue = component.brushAttributesForm.value.thickness;

        event.value = Thickness.Min - 1;
        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(oldValue);
    });

    it(`#onSliderChange should not change the value of thickness if event value > ${Thickness.Max}`, () => {
        const oldValue = component.brushAttributesForm.value.thickness;

        event.value = Thickness.Max + 1;
        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(oldValue);
    });

    it('#onSliderChange should not change the value of thickness if event value is null', () => {
        const oldValue = component.brushAttributesForm.value.thickness;

        event.value = null;
        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(oldValue);
    });

    // IT WAS THERE THAT IT WAS FUCKING FAILING ALWAYS
    it(`#onThicknessChange should call changeThickness if form thickness value is [${Thickness.Min},${Thickness.Max}]`, () => {
        let thickness = component.brushAttributesForm.controls['thickness'];
        thickness.setValue(30);

        const spy = spyOn(shit, 'changeThickness').and.returnValue();

        console.log(thickness.value);

        component.onThicknessChange();

        expect(spy).toHaveBeenCalled();
    });
    // THERE

    it(`#onThicknessChange should not call chanegeThickness of AttibuteManagerService if form thickness > ${Thickness.Max}`, () => {
        component.brushAttributesForm.controls.thickness.setValue(Thickness.Max + 1);
        let spyOnChangeThicknesAttributeManager = spyOn(attributesManagerService, 'changeThickness').and.returnValue();
        
        component.onThicknessChange();

        expect(spyOnChangeThicknesAttributeManager).not.toHaveBeenCalled();
    });

    it(`#onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness < ${Thickness.Min}`, () => {
        component.brushAttributesForm.controls.thickness.setValue(Thickness.Min - 1);
        let spyOnChangeThicknesAttributeManager = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(spyOnChangeThicknesAttributeManager).not.toHaveBeenCalled();
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

    it('#change should call changeStyle when user select a brush style', () => {
        let spy = spyOn(attributesManagerService, 'changeStyle').and.returnValue();
        component.change(1);
        expect(spy).toHaveBeenCalled();
    });
});
