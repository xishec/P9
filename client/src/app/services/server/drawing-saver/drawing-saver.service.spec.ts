import { TestBed, getTestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ElementRef, Type } from '@angular/core';

import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../drawing-loader/drawing-loader.service';
import { FileManagerService } from '../file-manager/file-manager.service';
import { DrawingSaverService } from './drawing-saver.service';
// import { createMockSVGElement } from 'src/classes/test-helpers.spec';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

fdescribe('DrawingSaverService', () => {
    let injector: TestBed;
    let service: DrawingSaverService;    
    // let rendererMock: Renderer2;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DrawingSaverService,
                [DomSanitizer],
                {
                    provide: DrawingModalWindowService,
                    useValue: {},
                },
                {
                    provide: DrawingLoaderService,
                    useValue: {},
                },
                {
                    provide: FileManagerService,
                    useValue: {},
                },
            ],
        });
        service = TestBed.get(DrawingSaverService);
        injector = getTestBed();
        service = injector.get(DrawingSaverService);
        // rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeDrawingSaverService(elementRefMock, drawStackMock);

    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set values retrieved from workzone when initializeDrawingSaverService is called ', () => {
        // const TEST_REF: ElementRef<SVGElement> = createMockSVGElement();

        expect(service).toBeTruthy();
    });
});
