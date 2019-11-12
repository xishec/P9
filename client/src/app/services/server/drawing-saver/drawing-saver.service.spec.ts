import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../drawing-loader/drawing-loader.service';
import { FileManagerService } from '../file-manager/file-manager.service';
import { DrawingSaverService } from './drawing-saver.service';

let service: DrawingSaverService;

describe('DrawingSaverService', () => {
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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
