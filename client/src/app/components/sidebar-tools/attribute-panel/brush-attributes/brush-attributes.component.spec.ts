import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { Thickness } from 'src/constants/tool-constants';
import { BrushAttributesComponent } from './brush-attributes.component';

fdescribe('BrushAttributesComponent', () => {
    let component: BrushAttributesComponent;
    let fixture: ComponentFixture<BrushAttributesComponent>;
    let event: MatSliderChange;
    let attributesManagerService: AttributesManagerService;
    let shortcutManagerService: ShortcutManagerService;
    const AVERAGE_THICKNESS = (Thickness.Min + Thickness.Max) / 2;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrushAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: MatDialog,
                    useValue: {},
                },
            ],
        })
            .overrideComponent(BrushAttributesComponent, {
                set: {
                    providers: [
                        {
                            provide: AttributesManagerService,
                            useValue: {
                                changeThickness: () => null,
                                changeStyle: () => null,
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
            })
            .compileComponents();
        fixture = TestBed.createComponent(BrushAttributesComponent);
        component = fixture.componentInstance;

        event = new MatSliderChange();

        component.ngOnInit();

        attributesManagerService = fixture.debugElement.injector.get<AttributesManagerService>(
            AttributesManagerService,
        );
        shortcutManagerService = fixture.debugElement.injector.get<ShortcutManagerService>(ShortcutManagerService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`onSliderChange should change the value of thickness if event value [${Thickness.Min},${Thickness.Max}]`, () => {
        event.value = AVERAGE_THICKNESS;
        const SPY = spyOn(component, 'onThicknessChange').and.returnValue();

        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(AVERAGE_THICKNESS);
        expect(SPY).toHaveBeenCalled();
    });

    it(`onSliderChange should not change the value of thickness if event value  ]${Thickness.Min},${Thickness.Max}[`, () => {
        const SPY = spyOn(component, 'onThicknessChange');

        event.value = Thickness.Max + AVERAGE_THICKNESS;
        component.onSliderChange(event);
        event.value = Thickness.Min - AVERAGE_THICKNESS;
        component.onSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it('onSliderChange should not call onThicknessChange if event value is null', () => {
        const SPY = spyOn(component, 'onThicknessChange');

        event.value = null;
        component.onSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onThicknessChange should call changeThickness if form thickness value is [${Thickness.Min},${Thickness.Max}]`, () => {
        component.brushAttributesForm.controls.thickness.setValue(AVERAGE_THICKNESS);
        const SPY = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(SPY).toHaveBeenCalled();
    });

    it(`onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness > ${Thickness.Max}`, () => {
        component.brushAttributesForm.controls.thickness.setValue(Thickness.Max + AVERAGE_THICKNESS);
        const SPY = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness < ${Thickness.Min}`, () => {
        component.brushAttributesForm.controls.thickness.setValue(Thickness.Min - AVERAGE_THICKNESS);
        const SPY = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it('onFocus should call changeIsOnInput when user in on focus', () => {
        const SPY = spyOn(shortcutManagerService, 'changeIsOnInput').and.returnValue();

        component.onFocus();

        expect(SPY).toHaveBeenCalled();
    });

    it('onFocus should  call changeIsOnInput when user is out of focus', () => {
        const SPY = spyOn(shortcutManagerService, 'changeIsOnInput').and.returnValue();

        component.onFocusOut();

        expect(SPY).toHaveBeenCalled();
    });

    it('change should call changeStyle when user select a brush style', () => {
        const SPY = spyOn(attributesManagerService, 'changeStyle').and.returnValue();

        component.change(1);

        expect(SPY).toHaveBeenCalled();
    });
});
