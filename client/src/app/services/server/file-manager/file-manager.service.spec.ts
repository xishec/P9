import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FileManagerService } from './file-manager.service';

describe('FileManagerService', () => {
    beforeEach(() => 
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        }));

    it('should be created', () => {
        const service: FileManagerService = TestBed.get(FileManagerService);
        expect(service).toBeTruthy();
    });
});
