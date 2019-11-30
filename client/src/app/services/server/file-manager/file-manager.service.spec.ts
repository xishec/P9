import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { Drawing } from '../../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { FileManagerService } from './file-manager.service';

let service: FileManagerService;

describe('FileManagerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.get(FileManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return a observable on deleteDrawing', () => {
        const answer = service.deleteDrawing(1);
        expect(answer).toBeTruthy();
    });

    it('should return a observable on postDrawing', () => {
        const answer = service.postDrawing({
            drawingInfo: {
                name: '',
                createdAt: 0,
                lastModified: 0,
                labels: [],
                idStack: [],
                width: 0,
                height: 0,
                color: '',
            } as DrawingInfo,
            svg: '',
        } as Drawing);
        expect(answer).toBeTruthy();
    });

    it('should return a observable on getAllDrawings', () => {
        const answer = service.getAllDrawings();
        expect(answer).toBeTruthy();
    });
});
