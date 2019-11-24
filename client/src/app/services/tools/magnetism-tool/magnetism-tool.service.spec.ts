import { ElementRef, Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { MatDialog, MatSnackBar } from '@angular/material';

import { BehaviorSubject } from 'rxjs';
import { Coords2D } from 'src/classes/Coords2D';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { GRID_SIZE } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { MagnetismToolService } from './magnetism-tool.service';

// import { Selection } from 'src/classes/selection/selection';
// import { CONTROL_POINTS } from 'src/constants/tool-constants';

fdescribe('MagnetismToolService', () => {
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
                    useValue: {},
                },
                provideAutoMock(ElementRef),
                provideAutoMock(DrawStackService),
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
});
