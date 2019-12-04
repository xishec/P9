import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { DrawingSavingInfo } from 'src/classes/DrawingSavingInfo';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../drawing-loader/drawing-loader.service';
import { FileManagerService } from '../file-manager/file-manager.service';
import { DrawingSaverService } from './drawing-saver.service';

describe('DrawingSaverService', () => {
    let injector: TestBed;
    let service: DrawingSaverService;
    let drawStackMock: DrawStackService;
    let drawingLoaderService: DrawingLoaderService;
    let elementRefMock: ElementRef<SVGElement>;

    const TEST_DRAWING_SAVING_INFO: DrawingSavingInfo = {
            name: 'mona lisa',
            drawingLabels: ['Italy', 'Louvre', 'Paris'],
            createdAt: 1000,
            lastModified: 1500,
    } as DrawingSavingInfo;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DrawingSaverService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                    },
                },
                {
                    provide: DomSanitizer,
                    useValue: {
                        bypassSecurityTrustResourceUrl: () => 'safeString',
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            innerHTML: '',
                        },
                    },
                },
                {
                    provide: DrawingModalWindowService,
                    useValue: {
                        drawingInfo: new BehaviorSubject({
                            name: '',
                            createdAt: 0,
                            lastModified: 0,
                            labels: [],
                            idStack: [],
                            width: 0,
                            height: 0,
                            color: '',
                        } as DrawingInfo),
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {
                        idStack: ['1', '2', '3'],
                    },
                },
                {
                    provide: DrawingLoaderService,
                    useValue: {
                        emptyDrawStack: new BehaviorSubject(true),
                    },
                },
                {
                    provide: FileManagerService,
                    useValue: {
                        postDrawing: () => null,
                    },
                },
            ],
        });
        service = TestBed.get(DrawingSaverService);
        injector = getTestBed();
        service = injector.get(DrawingSaverService);
        drawingLoaderService = injector.get(DrawingLoaderService);
        drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);

        service.initializeDrawingSaverService(elementRefMock, drawStackMock);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create and return a url to download drawing file', () => {
        const url = service.getLocalFileDownloadUrl(TEST_DRAWING_SAVING_INFO);

        expect(url).toEqual('safeString');
    });

    it('should display error message if draw stack is empty on sendFileToServer call', () => {
        const drawingSavingInfo = { name: 'name', drawingLabels: ['label1', 'label2'] } as DrawingSavingInfo;
        drawingLoaderService.emptyDrawStack.next(true);

        service.sendFileToServer(drawingSavingInfo);

        expect(service.currentErrorMessage.value).toEqual('Aucun dessin dans la zone de travail!');
    });

    it('should post valid name and labels if draw stack is not empty on sendFileToServer call', () => {
        const SPY = spyOn(service, 'postDrawing');

        const drawingSavingInfo = { name: 'name', drawingLabels: ['label1', 'label2'] } as DrawingSavingInfo;
        drawingLoaderService.emptyDrawStack.next(false);

        service.sendFileToServer(drawingSavingInfo);

        expect(SPY).toHaveBeenCalledWith(drawingSavingInfo);
    });

    it('should do nothing if draw stack is not empty and name and lables is not valid on sendFileToServer call', () => {
        const SPY = spyOn(service, 'postDrawing');

        const drawingSavingInfo = { name: '', drawingLabels: ['label1', 'label2'] } as DrawingSavingInfo;
        drawingLoaderService.emptyDrawStack.next(false);

        service.sendFileToServer(drawingSavingInfo);

        expect(SPY).not.toHaveBeenCalled();
    });
});
