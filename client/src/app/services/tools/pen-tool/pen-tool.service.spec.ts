import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { createMockSVGCircle } from 'src/classes/test-helpers.spec';
import { PEN_WIDTH_FACTOR } from 'src/constants/tool-constants';
import { provideAutoMock } from '../../../../classes/test.helper.msTeams.spec';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { PenToolService } from './pen-tool.service';

const X = 10;
const Y = 10;

let injector: TestBed;
let service: PenToolService;

describe('PenToolService', () => {
    beforeEach(() => {
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
        });

        injector = getTestBed();
        service = TestBed.get(PenToolService);

        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call createSVGCircle of super on createSVGCircle', () => {
        const spyOnSuperCreateCircle = spyOn(TracingToolService.prototype, 'createSVGCircle').and.returnValue(
            createMockSVGCircle(),
        );

        service.createSVGCircle(X, Y);

        expect(spyOnSuperCreateCircle).toHaveBeenCalled();
    });

    it('should set default value on calculateSpeed initially', () => {
        service.oldTimeStamp = -1;
        const mockLeftButton = {
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
        service.oldTimeStamp = 1;
        const mockLeftButton = {
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
        service.oldTimeStamp = Date.now();
        service.lastMouseX = 0;
        service.lastMouseY = 0;
        const mockLeftButton = {
            screenX: 10000,
            screenY: 10000,
        };
        service.maxThickness = 7;
        service.minThickness = 2;
        service[`currentWidth`] = 0;

        service.calculateSpeed(mockLeftButton as MouseEvent);

        const totalSpeed = PEN_WIDTH_FACTOR;
        const targetWidth = 7 * (1 - totalSpeed / PEN_WIDTH_FACTOR) + 2;
        const currentWidth = (targetWidth - 0) / (2 * PEN_WIDTH_FACTOR);

        expect(service[`currentWidth`]).toEqual(currentWidth);
    });

    it('should call onMouseMove of super on onMouseMove', () => {
        const mouseEvent = {
            screenX: 10,
            screenY: 10,
        };
        const spyOnSuperOnMouseMove = spyOn(TracingToolService.prototype, 'onMouseMove');
        service.onMouseMove(mouseEvent as MouseEvent);

        expect(spyOnSuperOnMouseMove).toHaveBeenCalled();
    });

    it('should call calculateSpeed on onMouseMove', () => {
        const mouseEvent = {
            screenX: 10,
            screenY: 10,
        };
        const spyOnSuperCalculateSpeed = spyOn(service, 'onMouseMove');
        service.onMouseMove(mouseEvent as MouseEvent);

        expect(spyOnSuperCalculateSpeed).toHaveBeenCalled();
    });

    it('should not change current path on onMouseMove if not isDrawing', () => {
        const mouseEvent = {
            screenX: 10,
            screenY: 10,
        };
        service[`isDrawing`] = false;
        service[`currentPath`] = '';

        service.onMouseMove(mouseEvent as MouseEvent);

        expect(service[`currentPath`]).toEqual('');
    });

    it('should change current path on onMouseMove if isDrawing', () => {
        const mouseEvent = {
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
        const attributesManagerService = new AttributesManagerService();

        service.initializeAttributesManagerService(attributesManagerService as AttributesManagerService);

        expect(service[`attributesManagerService`]).toEqual(attributesManagerService);
    });
});
