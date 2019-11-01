import { TestBed, getTestBed } from '@angular/core/testing';
import { UndoRedoerService } from './undo-redoer.service';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';
import { ElementRef } from '@angular/core';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DEFAULT_WHITE } from 'src/constants/color-constants';
import { Drawing } from '../../../../../common/communication/Drawing';
import { BehaviorSubject } from 'rxjs';

const MOCK_INNER_HTML = 'expectedInnerHtml';
const MOCK_DRAWING_INFO = new DrawingInfo(0,0,DEFAULT_WHITE);

fdescribe('UndoRedoerService', () => {
    let injector: TestBed;
    let service: UndoRedoerService;
    let mockElementRef : ElementRef<SVGElement>;
    let drawingModalWindowServiceMock : DrawingModalWindowService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers : [
                UndoRedoerService,
                {
                    provide: DrawStackService,
                    useValue : {}
                },
                {
                    provide: DrawingModalWindowService,
                    useValue: {
                        drawingInfo : {},
                    }
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement : {
                            innerHTML : {

                            }
                        }
                    },
                }
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
});
