import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { createKeyBoardEvent, createMockSVGCircle, createMockSVGGElement, createMockSVGLine, createMouseEvent } from 'src/classes/test-helpers';
import { Keys, Mouse } from 'src/constants/constants';
import { LineJointType, LineStrokeType } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { LineToolService } from './line-tool.service';

describe('LineToolService', () => {

    let injector: TestBed;
    let service: LineToolService;
    let mockLeftButton: MouseEvent;
    let rendererMock: Renderer2;
    let drawStackMock: DrawStackService;

    const BOUNDLEFT = 0;
    const BOUNDTOP = 0;

    const MOCK_LINE = createMockSVGLine();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => MOCK_LINE,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {
                        getDrawStackLength: () => 1,
                        push: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundleft = BOUNDLEFT;
                                const boundtop = BOUNDTOP;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(LineToolService);

        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);

        mockLeftButton = createMouseEvent(0, 0, Mouse.LeftButton);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeAttributesManagerService should set strokeWidth, strokeType, jointType and circleJointDiameter', () => {
        const attributeManagerService: AttributesManagerService = new AttributesManagerService();
        const strokeWidth: BehaviorSubject<number> = attributeManagerService[`_thickness`];
        const strokeType: BehaviorSubject<number> = attributeManagerService[`lineStrokeType`];
        const jointType: BehaviorSubject<number> = attributeManagerService[`lineJointType`];
        const jointDiameter: BehaviorSubject<number> = attributeManagerService[`circleJointDiameter`];

        service.initializeAttributesManagerService(new AttributesManagerService());

        expect(service.currentStrokeWidth).toEqual(strokeWidth.value);
        expect(service.currentStrokeType).toEqual(strokeType.value);
        expect(service.currentJointType).toEqual(jointType.value);
        expect(service.currentCircleJointDiameter).toEqual(jointDiameter.value);
    });

    it('getXPos should return clientX - BOUNDLEFT', () => {
        const clientX = 10;

        const resXPos = service.getXPos(clientX);

        expect(resXPos).toBe(clientX - BOUNDLEFT);
    });

    it('getYPos should return clientY - BOUNDTOP', () => {
        const clientY = 10;

        const resYPos = service.getYPos(clientY);

        expect(resYPos).toBe(clientY - BOUNDTOP);
    });

    it('should call startLine onMouseDown if Mouse.LeftButton and !isDrawing', () => {
        const spyOnStartLine = spyOn(service, 'startLine');
        service.isDrawing = false;

        service.onMouseDown(mockLeftButton);

        expect(spyOnStartLine).toHaveBeenCalled();
    });

    it('should call appendLine onMouseDown if Mouse.LeftButton and isDrawing', () => {
        const spyOnAppendLine = spyOn(service, 'appendLine');
        service.isDrawing = true;

        service.onMouseDown(mockLeftButton);

        expect(spyOnAppendLine).toHaveBeenCalled();
    });

    it('should call appendCircle onMouseDown if Mouse.LeftButton and currentJointType is Circle', () => {
        const spyOnAppendCircle = spyOn(service, 'appendCircle');
        service.currentJointType = LineJointType.Circle;

        service.onMouseDown(mockLeftButton);

        expect(spyOnAppendCircle).toHaveBeenCalled();
    });

    it('isMouseDown should be true when onMouseDown', () => {
        service.isMouseDown = false;

        service.onMouseDown(mockLeftButton);

        expect(service.isMouseDown).toBeTruthy();
    });

    it('isMouseDown should be false when onMouseUp', () => {
        service.isMouseDown = true;

        service.onMouseUp(mockLeftButton);

        expect(service.isMouseDown).toBeFalsy();
    });

    it('should call previewLine when onMouseMove with isDrawing and !isMouseDown', () => {
        service.isDrawing = true;
        service.isMouseDown = false;
        const spyOnPreviewLine = spyOn(service, 'previewLine');

        service.onMouseMove(mockLeftButton);

        expect(spyOnPreviewLine).toHaveBeenCalled();
    });

    it('shouldCloseLine should be true when onKeyDown with shift', () => {
        const mockShift = createKeyBoardEvent(Keys.Shift);

        service.onKeyDown(mockShift);

        expect(service.shouldCloseLine).toBeTruthy();
    });

    it('should call renderer.removeChild() when onKeyDown with escape', () => {
        const mockEscape = createKeyBoardEvent(Keys.Escape);
        const spyOnRendererRemoveChild = spyOn(rendererMock, 'removeChild');

        service.onKeyDown(mockEscape);

        expect(spyOnRendererRemoveChild).toHaveBeenCalled();
    });

    it('should remove last point when onKeyDown with Backspace and pointsArray.length > 1', () => {
        service.pointsArray.push('0,0');
        const pointToPop = '1,1';
        service.pointsArray.push(pointToPop);
        const arrayLengthBefore = service.pointsArray.length;

        const mockBackspace = createKeyBoardEvent(Keys.Backspace);

        service.onKeyDown(mockBackspace);

        const arrayLengthAfter = service.pointsArray.length;
        expect(arrayLengthAfter).toBe(arrayLengthBefore - 1);
        expect(service.pointsArray).not.toContain(pointToPop);
    });

    it('should remove last jointCircle when onKeyDown with Backspace and pointsArray.length > 1 and jointType is circle', () => {
        const circle1 = createMockSVGCircle();
        const circle2 = createMockSVGCircle();
        service.pointsArray.push('0,0');
        service.pointsArray.push('1,1');
        service.jointCircles.push(circle1);
        service.jointCircles.push(circle2);
        service.currentJointType = LineJointType.Circle;

        const mockBackspace = createKeyBoardEvent(Keys.Backspace);

        service.onKeyDown(mockBackspace);

        expect(service.jointCircles).not.toContain(circle2);
    });

    it('shouldCloseLine should be true when onKeyUp with shift', () => {
        const mockShift = createKeyBoardEvent(Keys.Shift);
        service.shouldCloseLine = true;

        service.onKeyUp(mockShift);

        expect(service.shouldCloseLine).toBeFalsy();
    });

    it('should push to the drawStack the gWrap when onDblClick if isDrawing', () => {
        service.isDrawing = true;
        const spyOnDrawStackPush = spyOn(drawStackMock, 'push');

        service.onDblClick(mockLeftButton);

        expect(spyOnDrawStackPush).toHaveBeenCalled();
    });

    it('should vall pointsArray.push when onDblClick if isDrawing and shouldCloseLine and pointsArray.length > 3', () => {
        service.isDrawing = true;
        service.shouldCloseLine = true;
        service.pointsArray.push('0,0');
        service.pointsArray.push('1,1');
        service.pointsArray.push('2,2');
        service.pointsArray.push('3,3');
        const spyOnPointsArrayPush = spyOn(service.pointsArray, 'push');

        service.onDblClick(mockLeftButton);

        expect(spyOnPointsArrayPush).toHaveBeenCalled();
    });

    // tslint:disable-next-line: max-line-length
    it('should call renderer.setAttribute with currentLine, stroke-dasharray, currentStrokeWidth when startLine if LineStroke is Dotted_line', () => {
        service.currentStrokeType = LineStrokeType.Dotted_line;
        service.currentJointType = LineJointType.Straight;
        const mockCurrentStrokeWidth = 10;
        service.currentStrokeWidth = mockCurrentStrokeWidth;
        const spyOnSetAttribute = spyOn(rendererMock, 'setAttribute');

        service.startLine(0, 0);

        // tslint:disable-next-line: max-line-length
        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_LINE, 'stroke-dasharray', `${mockCurrentStrokeWidth}, ${mockCurrentStrokeWidth / 2}`);
    });

    it('should call renderer.setAttribute with currentLine, stroke-linecap, round when startLine if LineStroke is Dotted_circle', () => {
        service.currentStrokeType = LineStrokeType.Dotted_circle;
        service.currentJointType = LineJointType.Straight;
        const spyOnSetAttribute = spyOn(rendererMock, 'setAttribute');

        service.startLine(0, 0);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_LINE, 'stroke-linecap', 'round');
    });

    it('should call renderer.setAttribute with currentLine, stroke-linejoin, round when startLine if jointType is Circle', () => {
        service.currentJointType = LineJointType.Circle;
        const spyOnSetAttribute = spyOn(rendererMock, 'setAttribute');

        service.startLine(0, 0);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_LINE, 'stroke-linejoin', 'round');
    });

    it('should call renderer.setAttribute with currentLine, points, arrayToStringLine + currentMousePosition when previewLine', () => {
        const x = 10;
        const y = 10;
        const mousePosition = `${x.toString()},${y.toString()}`;
        const spyOnRendererSetAttribute = spyOn(rendererMock, 'setAttribute');
        service.pointsArray.push('0,0');
        const stringPointsArray = service.arrayToStringLine();
        service.currentLine = MOCK_LINE;

        service.previewLine(x, y);

        expect(spyOnRendererSetAttribute).toHaveBeenCalledWith(MOCK_LINE, 'points', `${stringPointsArray} ${mousePosition}`);
    });

    it('should call renderer.setAttribute with currentLine, points, arrayToStringLine when appendLine', () => {
        const spyOnRendererSetAttribute = spyOn(rendererMock, 'setAttribute');
        service.pointsArray.push('0,0');
        service.currentLine = MOCK_LINE;

        service.appendLine(10, 10);

        const stringPointsArray = service.arrayToStringLine();
        expect(spyOnRendererSetAttribute).toHaveBeenCalledWith(MOCK_LINE, 'points', `${stringPointsArray}`);
    });

    it('should call renderer.appendChild when appendCircle', () => {
        const spyOnRendererSetAttribute = spyOn(rendererMock, 'setAttribute');

        service.appendCircle(0, 0);

        expect(spyOnRendererSetAttribute).toHaveBeenCalled();
    });

    it('should return all points join with space when arrayToString', () => {
        service.pointsArray.push('0,0');
        service.pointsArray.push('1,1');
        const expectedString = '0,0 1,1';

        const resultString = service.arrayToStringLine();

        expect(resultString).toBe(expectedString);
    });

    it('should call renderer.removeChild when cleanUp if !isLineInStack', () => {
        service.isLineInStack = false;
        const spyOnRemoveChild = spyOn(rendererMock, 'removeChild');
        service.gWrap = createMockSVGGElement();

        service.cleanUp();

        expect(spyOnRemoveChild).toHaveBeenCalled();
    });

});
