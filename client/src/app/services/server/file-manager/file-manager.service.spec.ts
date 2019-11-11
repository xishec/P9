import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_GRAY_0 } from 'src/constants/color-constants';
import { FileManagerService } from './file-manager.service';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';

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
        const answer = service.deleteDrawing('name');
        expect(answer).toBeTruthy();
    });

    it('should return a observable on postDrawing', () => {
        const answer = service.postDrawing('name', [], 'svg', [], new DrawingInfo(0, 0, DEFAULT_GRAY_0));
        expect(answer).toBeTruthy();
    });

    it('should return a observable on getAllDrawings', () => {
        const answer = service.getAllDrawings();
        expect(answer).toBeTruthy();
    });
});
