import { ElementRef, Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { MatDialog, MatSnackBar } from '@angular/material';

import { BehaviorSubject } from 'rxjs';
import { Coords2D } from 'src/classes/Coords2D';
import { Selection } from 'src/classes/selection/selection';
import { createMockSVGElement } from 'src/classes/test-helpers.spec';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { GRID_SIZE } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { MagnetismToolService } from './magnetism-tool.service';

describe('MagnetismToolService', () => {
    let injector: TestBed;
    let service: MagnetismToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MagnetismToolService,
                {
                    provide: MatDialog,
                    useValue: {},
                },
                {
                    provide: Renderer2,
                    useValue: {
                        setAttribute: () => null,
                        createElement: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                    },
                },
                {
                    provide: MatSnackBar,
                    useValue: {
                        open: () => null,
                    },
                },
                provideAutoMock(ElementRef),
                provideAutoMock(DrawStackService),
                provideAutoMock(Selection),
            ],
        });

        injector = getTestBed();
        service = injector.get(MagnetismToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('changeState should not change isMagnetic if untouchedWorkZone is true', () => {
        service.drawingLoaderService.untouchedWorkZone = new BehaviorSubject(true);

        service.changeState(true);

        expect(service.isMagnetic.value).toEqual(false);
    });

    it('changeState should change isMagnetic to true if untouchedWorkZone is false', () => {
        service.drawingLoaderService.untouchedWorkZone = new BehaviorSubject(false);

        service.changeState(true);

        expect(service.isMagnetic.value).toEqual(true);
    });

    it('switchState should change isMagnetic to true if it is false', () => {
        service.drawingLoaderService.untouchedWorkZone = new BehaviorSubject(false);
        service.isMagnetic = new BehaviorSubject(false);

        service.switchState();

        expect(service.isMagnetic.value).toEqual(true);
    });

    it('switchState should change isMagnetic to false if it is true', () => {
        service.drawingLoaderService.untouchedWorkZone = new BehaviorSubject(false);
        service.isMagnetic = new BehaviorSubject(true);

        service.switchState();

        expect(service.isMagnetic.value).toEqual(false);
    });

    it('needToAlign should return true if isFirstSelection is true', () => {
        expect(service.needToAlign(true)).toEqual(true);
    });

    it('needToAlign should return false if isFirstSelection is false and all other elments did not change', () => {
        service.lastControlPoint = 0;
        service.lastGridSize = GRID_SIZE.Default;

        expect(service.needToAlign(false)).toEqual(false);
    });

    it('magnetizeXY should change lastControlPoint to the currentPoint', () => {
        const spyOnNeedToAlign = spyOn(service, 'needToAlign').and.returnValue(true);
        const spyOnupdateControlPointPosition = spyOn(service, 'updateControlPointPosition');
        service.lastControlPoint = 0;
        service.currentPoint = 10;

        service.magnetizeXY(1, 1, true);

        expect(service.lastControlPoint).toEqual(service.currentPoint);
        expect(spyOnNeedToAlign).toHaveBeenCalled();
        expect(spyOnupdateControlPointPosition).toHaveBeenCalled();
    });

    it('magnetizeXY should return a new Coords2D with x and y elements equal to (currentGridSize - remainder)', () => {
        const spyOnNeedToAlign = spyOn(service, 'needToAlign').and.returnValue(true);
        const spyOnupdateControlPointPosition = spyOn(service, 'updateControlPointPosition');

        service.currentGridSize = 10;
        service.currentPointPosition.x = 9;
        service.currentPointPosition.y = 9;

        expect(service.magnetizeXY(1, 1, true)).toEqual(
            new Coords2D(service.currentGridSize - 9, service.currentGridSize - 9),
        );
        expect(spyOnNeedToAlign).toHaveBeenCalled();
        expect(spyOnupdateControlPointPosition).toHaveBeenCalled();
    });

    it('magnetizeXY should return a new Coords2D with 0,0 if totalDelta < currentGridSize', () => {
        const spyOnNeedToAlign = spyOn(service, 'needToAlign').and.returnValue(false);
        const spyOnupdateControlPointPosition = spyOn(service, 'updateControlPointPosition');
        service.currentGridSize = 10;

        expect(service.magnetizeXY(1, 1, true)).toEqual(new Coords2D(0, 0));
        expect(spyOnNeedToAlign).toHaveBeenCalled();
        expect(spyOnupdateControlPointPosition).toHaveBeenCalled();
    });

    it('magnetizeXY should return a new Coords2D with 10,10 if totalDelta >= currentGridSize', () => {
        const spyOnNeedToAlign = spyOn(service, 'needToAlign').and.returnValue(false);
        const spyOnupdateControlPointPosition = spyOn(service, 'updateControlPointPosition');
        service.currentGridSize = 10;

        expect(service.magnetizeXY(10, 10, true)).toEqual(new Coords2D(10, 10));
        expect(spyOnNeedToAlign).toHaveBeenCalled();
        expect(spyOnupdateControlPointPosition).toHaveBeenCalled();
    });

    it('magnetizeXY should return a new Coords2D with -10,-10 if delta X and Y are -10', () => {
        const spyOnNeedToAlign = spyOn(service, 'needToAlign').and.returnValue(false);
        const spyOnupdateControlPointPosition = spyOn(service, 'updateControlPointPosition');
        service.currentGridSize = 10;

        expect(service.magnetizeXY(-10, -10, true)).toEqual(new Coords2D(-10, -10));
        expect(spyOnNeedToAlign).toHaveBeenCalled();
        expect(spyOnupdateControlPointPosition).toHaveBeenCalled();
    });

    it('magnetizeXY should change the totalDelta X and Y to grid size - totalDelta', () => {
        const spyOnNeedToAlign = spyOn(service, 'needToAlign').and.returnValue(false);
        const spyOnupdateControlPointPosition = spyOn(service, 'updateControlPointPosition');
        service.currentGridSize = 10;
        service.totalDeltaX = 15;
        service.totalDeltaY = 15;
        const tempTotalDeltaX = service.totalDeltaX;
        const tempTotalDeltaY = service.totalDeltaY;

        expect(service.magnetizeXY(0, 0, true)).toEqual(new Coords2D(service.currentGridSize, service.currentGridSize));

        expect(spyOnNeedToAlign).toHaveBeenCalled();
        expect(service.totalDeltaX).toEqual(tempTotalDeltaX - service.currentGridSize);
        expect(service.totalDeltaY).toEqual(tempTotalDeltaY - service.currentGridSize);
        expect(spyOnupdateControlPointPosition).toHaveBeenCalled();
    });

    it('initializeService should ', () => {
        service.initializeService(createMockSVGElement());

        expect(service.selection).toBeDefined();
    });
});
