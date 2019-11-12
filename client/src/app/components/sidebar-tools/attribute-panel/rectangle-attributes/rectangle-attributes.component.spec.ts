import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSliderChange, MatSnackBar } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { THICKNESS } from 'src/constants/tool-constants';
import { RectangleAttributesComponent } from './rectangle-attributes.component';

describe('RectangleAttributesComponent', () => {
    let component: RectangleAttributesComponent;
    let fixture: ComponentFixture<RectangleAttributesComponent>;
    let event: MatSliderChange;
    let attributesManagerService: AttributesManagerService;
    let shortcutManagerService: ShortcutManagerService;
    const AVERAGE_THICKNESS = (THICKNESS.Min + THICKNESS.Max) / 2;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: MatDialog,
                    useValue: {},
                },
                {
                    provide: MatSnackBar,
                    useValue: {},
                },
            ],
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
            AttributesManagerService,
        );
        shortcutManagerService = fixture.debugElement.injector.get<ShortcutManagerService>(ShortcutManagerService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`onSliderChange should change the value of thickness if event value [${THICKNESS.Min},${THICKNESS.Max}]`, () => {
        event.value = AVERAGE_THICKNESS;
        const SPY = spyOn(component, 'onThicknessChange').and.returnValue();

        component.onSliderChange(event);

        expect(component.rectangleAttributesForm.value.thickness).toBe(AVERAGE_THICKNESS);
        expect(SPY).toHaveBeenCalled();
    });

    it(`onSliderChange should not change the value of thickness if event value  ]${THICKNESS.Min},${THICKNESS.Max}[`, () => {
        const SPY = spyOn(component, 'onThicknessChange').and.returnValue();

        event.value = THICKNESS.Max + AVERAGE_THICKNESS;
        component.onSliderChange(event);
        event.value = THICKNESS.Min - AVERAGE_THICKNESS;
        component.onSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it('onSliderChange should not call onThicknessChange if event value is null', () => {
        const SPY = spyOn(component, 'onThicknessChange').and.returnValue();

        event.value = null;
        component.onSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onThicknessChange should call changeThickness if form thickness value is [${THICKNESS.Min},${THICKNESS.Max}]`, () => {
        const SPY = spyOn(component.attributesManagerService, 'changeThickness').and.returnValue();
        component.rectangleAttributesForm.controls.thickness.setValue(AVERAGE_THICKNESS);

        component.onThicknessChange();

        expect(SPY).toHaveBeenCalled();
    });

    it(`onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness > ${THICKNESS.Max}`, () => {
        component.rectangleAttributesForm.controls.thickness.setValue(THICKNESS.Max + AVERAGE_THICKNESS);
        const SPY = spyOn(attributesManagerService, 'changeThickness').and.returnValue();

        component.onThicknessChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness < ${THICKNESS.Min}`, () => {
        component.rectangleAttributesForm.controls.thickness.setValue(THICKNESS.Min - AVERAGE_THICKNESS);
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

    it('change should call changeStyle when user select a trace type', () => {
        const SPY = spyOn(component.attributesManagerService, 'changeTraceType').and.returnValue();

        component.onTraceTypeChange();

        expect(SPY).toHaveBeenCalled();
    });
});
