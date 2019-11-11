import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSliderChange } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { GridOpacity, GridSize } from 'src/constants/tool-constants';
import { GridAttributesComponent } from './grid-attributes.component';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';

describe('GridAttributesComponent', () => {
    let component: GridAttributesComponent;
    let fixture: ComponentFixture<GridAttributesComponent>;
    let event: MatSliderChange;
    let gridAttributeService: GridToolService;
    let shortcutManagerService: ShortcutManagerService;
    let drawingLoaderService: DrawingLoaderService;

    const AVERAGE_SIZE = (GridSize.Min + GridSize.Max) / 2;
    const AVERAGE_OPACITY = (GridOpacity.Min + GridOpacity.Max) / 2;

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
        drawingLoaderService = fixture.debugElement.injector.get<DrawingLoaderService>(DrawingLoaderService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`onSizeSliderChange should change the value of size if event value [${GridSize.Min},${GridSize.Max}]`, () => {
        event.value = AVERAGE_SIZE;
        const SPY = spyOn(component, 'onSizeChange').and.returnValue();

        component.onSizeSliderChange(event);

        expect(component.gridAttributesForm.value.size).toBe(AVERAGE_SIZE);
        expect(SPY).toHaveBeenCalled();
    });

    it(`onSizeSliderChange should not change the value of size if event value  ]${GridSize.Min},${GridSize.Max}[`, () => {
        const SPY = spyOn(component, 'onSizeChange').and.returnValue();

        event.value = GridSize.Max + AVERAGE_SIZE;
        component.onSizeSliderChange(event);
        event.value = GridSize.Min - AVERAGE_SIZE;
        component.onSizeSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it('onSizeSliderChange should not call onSizeChange if event value is null', () => {
        const SPY = spyOn(component, 'onSizeChange').and.returnValue();

        event.value = null;
        component.onSizeSliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onSizeChange should call changeSize if form size value is [${GridSize.Min},${GridSize.Max}]`, () => {
        component.gridAttributesForm.controls.size.setValue(AVERAGE_SIZE);
        const SPY = spyOn(gridAttributeService, 'changeSize').and.returnValue();

        component.onSizeChange();

        expect(SPY).toHaveBeenCalled();
    });

    it(`onSizeChange should not call changeSize of GridToolService if form size > ${GridSize.Max}`, () => {
        component.gridAttributesForm.controls.size.setValue(GridSize.Max + AVERAGE_SIZE);
        const SPY = spyOn(gridAttributeService, 'changeSize').and.returnValue();

        component.onSizeChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onSizeChange should not call changeSize of GridToolService if form size < ${GridSize.Min}`, () => {
        component.gridAttributesForm.controls.size.setValue(GridSize.Min - AVERAGE_SIZE);
        const SPY = spyOn(gridAttributeService, 'changeSize').and.returnValue();

        component.onSizeChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onOpacitySliderChange should change the value of opacity if event value [${GridOpacity.Min},${GridOpacity.Max}]`, () => {
        event.value = AVERAGE_OPACITY;
        const SPY = spyOn(component, 'onOpacityChange').and.returnValue();

        component.onOpacitySliderChange(event);

        expect(component.gridAttributesForm.value.opacity).toBe(AVERAGE_OPACITY);
        expect(SPY).toHaveBeenCalled();
    });

    it(`onOpacitySliderChange should not change the value of opacity if event value  ]${GridOpacity.Min},${GridOpacity.Max}[`, () => {
        const SPY = spyOn(component, 'onOpacityChange').and.returnValue();

        event.value = GridOpacity.Max + AVERAGE_OPACITY;
        component.onOpacitySliderChange(event);
        event.value = GridOpacity.Min - AVERAGE_OPACITY;
        component.onOpacitySliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it('onOpacitySliderChange should not call onOpacityChange if event value is null', () => {
        const SPY = spyOn(component, 'onOpacityChange').and.returnValue();

        event.value = null;
        component.onOpacitySliderChange(event);

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onOpacityChange should call changeOpacity if form opacity value is [${GridOpacity.Min},${GridOpacity.Max}]`, () => {
        component.gridAttributesForm.controls.opacity.setValue(AVERAGE_OPACITY);
        const SPY = spyOn(gridAttributeService, 'changeOpacity').and.returnValue();

        component.onOpacityChange();

        expect(SPY).toHaveBeenCalled();
    });

    it(`onOpacityChange should not call changeOpacity of GridToolService if form opacity > ${GridOpacity.Max}`, () => {
        component.gridAttributesForm.controls.opacity.setValue(GridOpacity.Max + AVERAGE_OPACITY);
        const SPY = spyOn(gridAttributeService, 'changeOpacity').and.returnValue();

        component.onOpacityChange();

        expect(SPY).not.toHaveBeenCalled();
    });

    it(`onOpacityChange should not call changeOpacity of GridToolService if form opacity < ${GridOpacity.Min}`, () => {
        component.gridAttributesForm.controls.opacity.setValue(GridOpacity.Min - AVERAGE_OPACITY);
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
        drawingLoaderService.emptyDrawStack.next(false);

        component.enableSlider();

        expect(component.gridAttributesForm.controls.state.enabled).toBeTruthy();
    });

    it('enableSlider should not enable the slider if workzone is empty', () => {
        drawingLoaderService.emptyDrawStack.next(true);

        component.enableSlider();

        expect(component.gridAttributesForm.controls.state.enabled).toBeFalsy();
    });
});
