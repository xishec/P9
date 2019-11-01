import { ElementRef } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_WHITE } from 'src/constants/color-constants';
import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';
import { UndoRedoerService } from './undo-redoer.service';

const MOCK_INNER_HTML = 'expectedInnerHtml';
const MOCK_DRAWING_INFO = new DrawingInfo(0, 0, DEFAULT_WHITE);

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

    it('saveCurrentState should push the currentState to undos and have the same innerHTML', () => {
        service.workzoneRef.nativeElement.innerHTML = MOCK_INNER_HTML;
        service.currentDrawingInfos = MOCK_DRAWING_INFO;

        service.saveCurrentState([]);

        expect(service.undos[0].svg).toEqual(MOCK_INNER_HTML);
        expect(service.undos[0].drawingInfo).toEqual(MOCK_DRAWING_INFO);
    });

    it('saveCurrentState should reset redos if redos.length > 0', () => {
        service.redos.push({name: '', labels: [], svg: '', idStack: [], drawingInfo: MOCK_DRAWING_INFO});

        service.saveCurrentState([]);

        expect(service.redos).toEqual([]);
    });

    it('undo should pop undos and push this to redos if undos.length > 1', () => {
        const initState: Drawing = {
            name: '1',
            labels: [],
            svg: '1',
            idStack: [],
            drawingInfo: MOCK_DRAWING_INFO,
        };

        const mockState: Drawing = {
            name: '2',
            labels: [],
            svg: '2',
            idStack: [],
            drawingInfo: MOCK_DRAWING_INFO,
        };

        service.undos.push(initState);
        service.undos.push(mockState);

        service.undo();

        expect(service.redos[0]).toEqual(mockState);
    });

    it('undo should not do anything if undos.length <= 1', () => {
        service.undos = [];
        service.redos = [];

        service.undo();

        expect(service.undos).toEqual([]);
        expect(service.redos).toEqual([]);
    });

    it('redo should pop redos and push this to undos if length > 0', () => {
        const mockState: Drawing = {
            name: 'mockState',
            labels: [],
            svg: 'mockSVG',
            idStack: [],
            drawingInfo: MOCK_DRAWING_INFO,
        };

        service.redos.push(mockState);

        service.redo();

        expect(service.undos[0]).toEqual(mockState);
    });

    it('redo should not do anything if redos.length <= 0', () => {
        service.undos = [];
        service.redos = [];

        service.redo();

        expect(service.undos).toEqual([]);
        expect(service.redos).toEqual([]);
    });
});
