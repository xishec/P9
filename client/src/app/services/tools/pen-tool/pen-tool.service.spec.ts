import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PenToolService } from './pen-tool.service';
import { provideAutoMock } from '../../../../classes/test.helper.msTeams.spec';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { createMockSVGCircle } from 'src/classes/test-helpers.spec';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { PEN_WIDTH_FACTOR } from 'src/constants/tool-constants';

const X = 10;
const Y = 10;

fdescribe('PenToolService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [
                provideAutoMock(ElementRef),
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: (warp: any, svg: any) => null,
                    },
                },
                provideAutoMock(DrawStackService),
            ],
        }),
    );

    it('should be created', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        expect(service).toBeTruthy();
    });

    it('should call createSVGCircle of super on createSVGCircle', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        const spyOnSuperCreateCircle = spyOn(TracingToolService.prototype, 'createSVGCircle').and.returnValue(
            createMockSVGCircle(),
        );

        service.createSVGCircle(X, Y);

        expect(spyOnSuperCreateCircle).toHaveBeenCalled();
    });

    it('should set default value on calculateSpeed initially', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        service.oldTimeStamp = -1;
        let mockLeftButton = {
            screenX: 10,
            screenY: 10,
        };

        service.calculateSpeed(mockLeftButton as MouseEvent);

        expect(service.speedX).toEqual(0);
        expect(service.speedY).toEqual(0);
        expect(service.lastMouseX).toEqual(10);
        expect(service.lastMouseY).toEqual(10);
    });

    it('should not set default value on calculateSpeed initially', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        service.oldTimeStamp = 1;
        let mockLeftButton = {
            screenX: 10,
            screenY: 10,
        };

        service.calculateSpeed(mockLeftButton as MouseEvent);

        expect(service.speedX).not.toEqual(0);
        expect(service.speedY).not.toEqual(0);
        expect(service.lastMouseX).toEqual(10);
        expect(service.lastMouseY).toEqual(10);
    });

    it('should change speed to max on calculateSpeed with a speed greater than max speed', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        service.oldTimeStamp = Date.now();
        service.lastMouseX = 0;
        service.lastMouseY = 0;
        let mockLeftButton = {
            screenX: 10000,
            screenY: 10000,
        };
        service.maxThickness = 7;
        service.minThickness = 2;
        service[`currentWidth`] = 0;

        service.calculateSpeed(mockLeftButton as MouseEvent);

        let totalSpeed = PEN_WIDTH_FACTOR;
        let targetWidth = 7 * (1 - totalSpeed / PEN_WIDTH_FACTOR) + 2;
        let currentWidth = (targetWidth - 0) / (2 * PEN_WIDTH_FACTOR);

        expect(service[`currentWidth`]).toEqual(currentWidth);
    });

    it('should call onMouseMove of super on onMouseMove', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        let mouseEvent = {
            screenX: 10,
            screenY: 10,
        };
        const spyOnSuperOnMouseMove = spyOn(TracingToolService.prototype, 'onMouseMove');
        service.onMouseMove(mouseEvent as MouseEvent);

        expect(spyOnSuperOnMouseMove).toHaveBeenCalled();
    });

    it('should call calculateSpeed on onMouseMove', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        let mouseEvent = {
            screenX: 10,
            screenY: 10,
        };
        const spyOnSuperCalculateSpeed = spyOn(service, 'onMouseMove');
        service.onMouseMove(mouseEvent as MouseEvent);

        expect(spyOnSuperCalculateSpeed).toHaveBeenCalled();
    });

    it('should not change current path on onMouseMove if not isDrawing', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        let mouseEvent = {
            screenX: 10,
            screenY: 10,
        };
        service[`isDrawing`] = false;
        service[`currentPath`] = '';

        service.onMouseMove(mouseEvent as MouseEvent);

        expect(service[`currentPath`]).toEqual('');
    });

    it('should change current path on onMouseMove if isDrawing', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        let mouseEvent = {
            screenX: 10,
            screenY: 10,
        };
        service[`isDrawing`] = true;
        service[`getXPos`] = (x: number) => 10;
        service[`getYPos`] = (y: number) => 11;

        service.onMouseMove(mouseEvent as MouseEvent);

        expect(service[`currentPath`]).not.toEqual('');
    });

    it('should change attributesManagerService on initializeAttributesManagerService', () => {
        const service: PenToolService = TestBed.get(PenToolService);

        let attributesManagerService = new AttributesManagerService();

        service.initializeAttributesManagerService(attributesManagerService as AttributesManagerService);

        expect(service[`attributesManagerService`]).toEqual(attributesManagerService);
    });
});
