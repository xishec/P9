import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSliderChange } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { GRID_OPACITY, GRID_SIZE } from 'src/constants/tool-constants';
import { GridAttributesComponent } from './grid-attributes.component';

describe('GridAttributesComponent', () => {
    let component: GridAttributesComponent;
    let fixture: ComponentFixture<GridAttributesComponent>;
    let event: MatSliderChange;
    let gridAttributeService: GridToolService;
    let shortcutManagerService: ShortcutManagerService;

    const AVERAGE_SIZE = (GRID_SIZE.Min + GRID_SIZE.Max) / 2;
    const AVERAGE_OPACITY = (GRID_OPACITY.Min + GRID_OPACITY.Max) / 2;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GridAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: MatDialog,
                    useValue: {},
                },
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        event = new MatSliderChange();

        component.ngOnInit();

        gridAttributeService = fixture.debugElement.injector.get<GridToolService>(GridToolService);
        shortcutManagerService = fixture.debugElement.injector.get<ShortcutManagerService>(ShortcutManagerService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`onSizeSliderChange should change the value of size if event value [${GRID_SIZE.Min},${GRID_SIZE.Max}]`, () => {
        event.value = AVERAGE_SIZE;
        const SPY = spyOn(component, 'onSizeChange').and.returnValue();

        component.onSizeSliderChange(event);

        expect(component.gridAttributesForm.value.size).toBe(AVERAGE_SIZE);
        expect(SPY).toHaveBeenCalled();
    });

    it(`onSizeSliderChange should not change the value of size if event value  ]${GRID_SIZE.Min},${GRID_SIZE.Max}[`, () => {
        const SPY = spyOn(component, 'onSizeChange').and.returnValue();

        event.value = GRID_SIZE.Max + AVERAGE_SIZE;
        component.onSizeSliderChange(event);
        event.value = GRID_SIZE.Min - AVERAGE_SIZE;
        component.onSizeSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it('onSizeSliderChange should not call onSizeChange if event value is null', () => {
        const SPY = spyOn(component, 'onSizeChange').and.returnValue();

        event.value = null;
        component.onSizeSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onSizeChange should call changeSize if form size value is [${GRID_SIZE.Min},${GRID_SIZE.Max}]`, () => {
        component.gridAttributesForm.controls.size.setValue(AVERAGE_SIZE);
        const SPY = spyOn(gridAttributeService, 'changeSize').and.returnValue();

        component.onSizeChange();

        expect(SPY).toHaveBeenCalled();
    });

    it(`onSizeChange should not call changeSize of GridToolService if form size > ${GRID_SIZE.Max}`, () => {
        component.gridAttributesForm.controls.size.setValue(GRID_SIZE.Max + AVERAGE_SIZE);
        const SPY = spyOn(gridAttributeService, 'changeSize').and.returnValue();

        component.onSizeChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onSizeChange should not call changeSize of GridToolService if form size < ${GRID_SIZE.Min}`, () => {
        component.gridAttributesForm.controls.size.setValue(GRID_SIZE.Min - AVERAGE_SIZE);
        const SPY = spyOn(gridAttributeService, 'changeSize').and.returnValue();

        component.onSizeChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onOpacitySliderChange should change the value of opacity if event value [${GRID_OPACITY.Min},${GRID_OPACITY.Max}]`, () => {
        event.value = AVERAGE_OPACITY;
        const SPY = spyOn(component, 'onOpacityChange').and.returnValue();

        component.onOpacitySliderChange(event);

        expect(component.gridAttributesForm.value.opacity).toBe(AVERAGE_OPACITY);
        expect(SPY).toHaveBeenCalled();
    });

    it(`onOpacitySliderChange should not change the value of opacity if event value  ]${GRID_OPACITY.Min},${GRID_OPACITY.Max}[`, () => {
        const SPY = spyOn(component, 'onOpacityChange').and.returnValue();

        event.value = GRID_OPACITY.Max + AVERAGE_OPACITY;
        component.onOpacitySliderChange(event);
        event.value = GRID_OPACITY.Min - AVERAGE_OPACITY;
        component.onOpacitySliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it('onOpacitySliderChange should not call onOpacityChange if event value is null', () => {
        const SPY = spyOn(component, 'onOpacityChange').and.returnValue();

        event.value = null;
        component.onOpacitySliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onOpacityChange should call changeOpacity if form opacity value is [${GRID_OPACITY.Min},${GRID_OPACITY.Max}]`, () => {
        component.gridAttributesForm.controls.opacity.setValue(AVERAGE_OPACITY);
        const SPY = spyOn(gridAttributeService, 'changeOpacity').and.returnValue();

        component.onOpacityChange();

        expect(SPY).toHaveBeenCalled();
    });

    it(`onOpacityChange should not call changeOpacity of GridToolService if form opacity > ${GRID_OPACITY.Max}`, () => {
        component.gridAttributesForm.controls.opacity.setValue(GRID_OPACITY.Max + AVERAGE_OPACITY);
        const SPY = spyOn(gridAttributeService, 'changeOpacity').and.returnValue();

        component.onOpacityChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onOpacityChange should not call changeOpacity of GridToolService if form opacity < ${GRID_OPACITY.Min}`, () => {
        component.gridAttributesForm.controls.opacity.setValue(GRID_OPACITY.Min - AVERAGE_OPACITY);
        const SPY = spyOn(gridAttributeService, 'changeOpacity').and.returnValue();

        component.onOpacityChange();

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

    it('changeState should call changeState when user toggle slider', () => {
        const SPY = spyOn(gridAttributeService, 'changeState').and.returnValue();

        component.onStateChange();

        expect(SPY).toHaveBeenCalled();
    });

    it('enableSlider should enable the slider if workzone is not empty', () => {
        gridAttributeService.workzoneIsEmpty.next(false);

        component.enableSlider();

        expect(component.gridAttributesForm.controls.state.enabled).toBeTruthy();
    });

    it('enableSlider should not enable the slider if workzone is empty', () => {
        gridAttributeService.workzoneIsEmpty.next(true);

        component.enableSlider();

        expect(component.gridAttributesForm.controls.state.enabled).toBeFalsy();
    });
});
