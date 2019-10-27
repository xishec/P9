import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { FileManagerService } from './file-manager.service';
import { DrawingInfo } from 'src/classes/DrawingInfo';
import { DEFAULT_GRAY_0 } from 'src/constants/color-constants';

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
        let answer = service.deleteDrawing('name');
        expect(answer.subscribe).toBeTruthy();
    });

    it('should return a observable on postDrawing', () => {
        let answer = service.postDrawing('name', [], 'svg', [], new DrawingInfo(0, 0, DEFAULT_GRAY_0));
        expect(answer.subscribe).toBeTruthy();
    });

    it('should return a observable on getAllDrawings', () => {
        let answer = service.getAllDrawings();
        expect(answer.subscribe).toBeTruthy();
    });
});
