import { ElementRef } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawingState } from '../../../classes/DrawingState';
import { DEFAULT_WHITE } from '../../../constants/color-constants';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';
import { UndoRedoerService } from './undo-redoer.service';

const MOCK_INNER_HTML = 'expectedInnerHtml';
const MOCK_DRAWING_INFO = new DrawingInfo(0, 0, DEFAULT_WHITE);

const MOCK_DRAWING: Drawing = {
    idStack: [],
    labels: [],
    name: '',
    svg: MOCK_INNER_HTML,
    drawingInfo: MOCK_DRAWING_INFO,
};

const MOCK_DRAWING_STATE: DrawingState = {
    drawing: MOCK_DRAWING,
};

describe('UndoRedoerService', () => {
    let injector: TestBed;
    let service: UndoRedoerService;
    let mockElementRef: ElementRef<SVGElement>;
    let drawingModalWindowServiceMock: DrawingModalWindowService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers : [
                UndoRedoerService,
                {
                    provide: DrawStackService,
                    useValue : {},
                },
                {
                    provide: DrawingModalWindowService,
                    useValue: {
                        drawingInfo : {},
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement : {
                            innerHTML : {

                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        injector = getTestBed();
        service = injector.get(UndoRedoerService);

        mockElementRef = injector.get(ElementRef);
        service.workzoneRef = injector.get(ElementRef);
        drawingModalWindowServiceMock = injector.get(DrawingModalWindowService);

        drawingModalWindowServiceMock.drawingInfo = new BehaviorSubject<DrawingInfo>(MOCK_DRAWING_INFO);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeService should set workzoneRef', () => {
        const mockExpectedInnerHTML = 'new expected string';
        mockElementRef.nativeElement.innerHTML = mockExpectedInnerHTML;

        service.initializeService(mockElementRef);

        expect(service.workzoneRef.nativeElement.innerHTML).toEqual(mockExpectedInnerHTML);
    });

    it('initializeStacks should reset undos and redos', () => {
        service.initializeStacks();

        expect(service.undos).toEqual([]);
        expect(service.redos).toEqual([]);
    });

    it('createDrawing should return a drawing with the innerHTML', () => {
        service.workzoneRef.nativeElement.innerHTML = MOCK_INNER_HTML;
        service.currentDrawingInfos = MOCK_DRAWING_INFO;

        const resDrawing = service.createDrawing([]);

        expect(resDrawing.svg).toEqual(MOCK_INNER_HTML);
    });

    it('saveStateAndDuplicateOffset should create a DrawingState with the duplicateOffSet and saveState', () => {
        service.workzoneRef.nativeElement.innerHTML = MOCK_INNER_HTML;
        service.currentDrawingInfos = MOCK_DRAWING_INFO;
        const spyOnSaveState = spyOn(service, 'saveState').and.callThrough();

        service.saveStateAndDuplicateOffset([], 10);

        expect(spyOnSaveState).toHaveBeenCalled();
        const state = service.undos.pop() as DrawingState;
        expect(state.duplicateOffset).toEqual(10);
    });

    it('saveStateFromPaste should create a DrawingState with the pasteOffset and saveState', () => {
        service.workzoneRef.nativeElement.innerHTML = MOCK_INNER_HTML;
        service.currentDrawingInfos = MOCK_DRAWING_INFO;
        const spyOnSaveState = spyOn(service, 'saveState').and.callThrough();

        service.saveStateFromPaste([], 10, new Set<SVGElement>());

        expect(spyOnSaveState).toHaveBeenCalled();
        const state = service.undos.pop() as DrawingState;
        expect(state.pasteOffset).toEqual(10);
    });

    it('saveCurrentState should creaye a DrawingState with no pasteOffset and duplicateOffset and call saveState', () => {
        service.workzoneRef.nativeElement.innerHTML = MOCK_INNER_HTML;
        service.currentDrawingInfos = MOCK_DRAWING_INFO;
        const spyOnSaveState = spyOn(service, 'saveState').and.callThrough();

        service.saveCurrentState([]);

        expect(spyOnSaveState).toHaveBeenCalled();
        const state = service.undos.pop() as DrawingState;
        expect(state.pasteOffset).toBeUndefined();
        expect(state.duplicateOffset).toBeUndefined();
    });

    it('saveState should push DrawingState on undos', () => {
        service.saveState(MOCK_DRAWING_STATE);

        const resDrawingState = service.undos.pop() as DrawingState;
        expect(resDrawingState).toEqual(MOCK_DRAWING_STATE);
    });

    it('saveState should reset redos if redos.length > 0', () => {
        service.redos.push(MOCK_DRAWING_STATE);

        service.saveState(MOCK_DRAWING_STATE);

        expect(service.redos).toEqual([]);
    });

    it('undo should pop undos and push this to redos if undos.length > 1', () => {
        const initDrawing: Drawing = {
            name: '1',
            labels: [],
            svg: '1',
            idStack: [],
            drawingInfo: MOCK_DRAWING_INFO,
        };

        const mockDrawing: Drawing = {
            name: '2',
            labels: [],
            svg: '2',
            idStack: [],
            drawingInfo: MOCK_DRAWING_INFO,
        };

        const mockState1: DrawingState = {
            drawing: initDrawing,
        };
        const mockState2: DrawingState = {
            drawing: mockDrawing,
        };

        service.undos.push(mockState1);
        service.undos.push(mockState2);

        service.undo();

        expect(service.redos[0]).toEqual(mockState2);
    });

    it('undo should not do anything if undos.length <= 1', () => {
        service.undos = [];
        service.redos = [];

        service.undo();

        expect(service.undos).toEqual([]);
        expect(service.redos).toEqual([]);
    });

    it('undo should change the value of duplicateOffset if stateToLoad has one', () => {

        const mockDrawingState: DrawingState = {
            drawing: MOCK_DRAWING,
            duplicateOffset: 10,
        };
        service.undos.push(mockDrawingState);
        service.undos.push(MOCK_DRAWING_STATE);

        service.undo();

        expect(service.duplicateOffset.value).toEqual(10);
    });

    it('undo should change the value of pasteOffset if stateToLoad has one', () => {
        const mockDrawingState: DrawingState = {
            drawing: MOCK_DRAWING,
            pasteOffset: 10,
            clippings: new Set<SVGElement>(),
        };

        service.undos.push(mockDrawingState);
        service.undos.push(MOCK_DRAWING_STATE);

        service.undo();

        expect(service.pasteOffset.value).toEqual(10);
    });

    it('redo should change the value of duplicateOffset if stateToLoad has one', () => {
        const mockDrawingState: DrawingState = {
            drawing: MOCK_DRAWING,
            duplicateOffset: 10,
        };
        service.redos.push(mockDrawingState);

        service.redo();

        expect(service.duplicateOffset.value).toEqual(10);
    });

    it('redo should change the value of pasteOffset if stateToLoad has one', () => {
        const mockDrawingState: DrawingState = {
            drawing: MOCK_DRAWING,
            pasteOffset: 10,
        };
        service.redos.push(mockDrawingState);

        service.redo();

        expect(service.pasteOffset.value).toEqual(10);
    });

    it('redo should pop redos and push this to undos if length > 0', () => {
        service.redos.push(MOCK_DRAWING_STATE);

        service.redo();

        expect(service.undos[0]).toEqual(MOCK_DRAWING_STATE);
    });

    it('redo should not do anything if redos.length <= 0', () => {
        service.undos = [];
        service.redos = [];

        service.redo();

        expect(service.undos).toEqual([]);
        expect(service.redos).toEqual([]);
    });
});
