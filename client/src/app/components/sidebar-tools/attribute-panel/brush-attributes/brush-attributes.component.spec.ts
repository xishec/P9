import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSliderChange, MatSnackBar } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { THICKNESS } from 'src/constants/tool-constants';
import { BrushAttributesComponent } from './brush-attributes.component';

describe('BrushAttributesComponent', () => {
    let component: BrushAttributesComponent;
    let fixture: ComponentFixture<BrushAttributesComponent>;
    let event: MatSliderChange;
    let attributesManagerService: AttributesManagerService;
    let shortcutManagerService: ShortcutManagerService;
    const AVERAGE_THICKNESS = (THICKNESS.Min + THICKNESS.Max) / 2;
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
                {
                    provide: MatSnackBar,
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
                                thickness: { next: () => null },
                                style: { next: () => null },
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

    it(`onSliderChange should change the value of thickness if event value [${THICKNESS.Min},${THICKNESS.Max}]`, () => {
        event.value = AVERAGE_THICKNESS;
        const SPY = spyOn(component, 'onThicknessChange').and.returnValue();

        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(AVERAGE_THICKNESS);
        expect(SPY).toHaveBeenCalled();
    });

    it(`onSliderChange should not change the value of thickness if event value  ]${THICKNESS.Min},${THICKNESS.Max}[`, () => {
        const SPY = spyOn(component, 'onThicknessChange');

        event.value = THICKNESS.Max + AVERAGE_THICKNESS;
        component.onSliderChange(event);
        event.value = THICKNESS.Min - AVERAGE_THICKNESS;
        component.onSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it('onSliderChange should not call onThicknessChange if event value is null', () => {
        const SPY = spyOn(component, 'onThicknessChange');

        event.value = null;
        component.onSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onThicknessChange should call changeThickness if form thickness value is [${THICKNESS.Min},${THICKNESS.Max}]`, () => {
        component.brushAttributesForm.controls.thickness.setValue(AVERAGE_THICKNESS);
        const SPY = spyOn(attributesManagerService.thickness, 'next').and.returnValue();

        component.onThicknessChange();

        expect(SPY).toHaveBeenCalled();
    });

    it(`onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness > ${THICKNESS.Max}`, () => {
        component.brushAttributesForm.controls.thickness.setValue(THICKNESS.Max + AVERAGE_THICKNESS);
        const SPY = spyOn(attributesManagerService.thickness, 'next').and.returnValue();

        component.onThicknessChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onThicknessChange should not call changeThickness of AttibuteManagerService if form thickness < ${THICKNESS.Min}`, () => {
        component.brushAttributesForm.controls.thickness.setValue(THICKNESS.Min - AVERAGE_THICKNESS);
        const SPY = spyOn(attributesManagerService.thickness, 'next').and.returnValue();

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

    it('change should call style.next when user select a brush style', () => {
        const SPY = spyOn(attributesManagerService.style, 'next').and.returnValue();

        component.change(1);

        expect(SPY).toHaveBeenCalled();
    });
});
