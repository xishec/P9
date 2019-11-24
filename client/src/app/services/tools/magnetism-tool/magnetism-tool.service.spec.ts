import { ElementRef, Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { MatDialog, MatSnackBar } from '@angular/material';

import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { MagnetismToolService } from './magnetism-tool.service';

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
});
