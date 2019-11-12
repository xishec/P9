import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSliderChange, MatSnackBar } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { Thickness } from 'src/constants/tool-constants';
import { EllipsisAttributesComponent } from './ellipsis-attributes.component';

describe('EllipsisAttributesComponent', () => {
    let component: EllipsisAttributesComponent;
    let fixture: ComponentFixture<EllipsisAttributesComponent>;
    let event: MatSliderChange;
    let shortcutManagerService: ShortcutManagerService;
    const AVERAGE_THICKNESS = 50;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipsisAttributesComponent],
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
            .overrideComponent(EllipsisAttributesComponent, {
                set: {
                    providers: [
                        {
                            provide: AttributesManagerService,
                            useValue: {
                                thickness.next: () => null,
                                traceType.next: () => null,
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
        fixture = TestBed.createComponent(EllipsisAttributesComponent);
        component = fixture.componentInstance;

        event = new MatSliderChange();

        component.ngOnInit();

        shortcutManagerService = fixture.debugElement.injector.get<ShortcutManagerService>(ShortcutManagerService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`onSliderChange should change the value of thickness if event value [${Thickness.Min},${Thickness.Max}]`, () => {
        event.value = AVERAGE_THICKNESS;
        const SPY = spyOn(component, 'onThicknessChange').and.returnValue();

        component.onSliderChange(event);

        expect(component.ellipsisAttributesForm.value.thickness).toBe(AVERAGE_THICKNESS);
        expect(SPY).toHaveBeenCalled();
    });

    it(`onSliderChange should not change the value of thickness if event value  ]${Thickness.Min},${Thickness.Max}[`, () => {
        const SPY = spyOn(component, 'onThicknessChange').and.returnValue();

        event.value = Thickness.Max + AVERAGE_THICKNESS;
        component.onSliderChange(event);
        event.value = Thickness.Min - AVERAGE_THICKNESS;
        component.onSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it('onSliderChange should not call onThicknessChange if event value is null', () => {
        const SPY = spyOn(component, 'onThicknessChange').and.returnValue();

        event.value = null;
        component.onSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onThicknessChange should not call thickness.next if form thickness value is > ${Thickness.Max}`, () => {
        component.ellipsisAttributesForm.controls.thickness.setValue(1000);
        const SPY = spyOn(component.attributesManagerService, 'thickness.next');

        component.onThicknessChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onThicknessChange should call thickness.next if form thickness value is 50`, () => {
        component.ellipsisAttributesForm.controls.thickness.setValue(50);
        const SPY = spyOn(component.attributesManagerService, 'thickness.next').and.returnValue();

        component.onThicknessChange();

        expect(SPY).toHaveBeenCalled();
    });

    it('onFocus should  call changeIsOnInput when user is out of focus', () => {
        const SPY = spyOn(shortcutManagerService, 'changeIsOnInput').and.returnValue();

        component.onFocusOut();

        expect(SPY).toHaveBeenCalled();
    });

    it('attributesManagerService shoudl call traceType.next when onTraceTypeChage', () => {
        const SPY = spyOn(component.attributesManagerService, 'traceType.next');

        component.onTraceTypeChange();

        expect(SPY).toHaveBeenCalled();
    });
});
