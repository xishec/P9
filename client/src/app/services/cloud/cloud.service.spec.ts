import { TestBed } from '@angular/core/testing';

import { CloudService } from './cloud.service';

fdescribe('CloudService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: CloudService = TestBed.get(CloudService);
        expect(service).toBeTruthy();
    });

    it('should be initialize firebase App on call initializeApp', () => {
        const service: CloudService = TestBed.get(CloudService);
        service.initializeApp();
        expect(service.storage).toBeTruthy();
    });

    it('should save file to firebase App on call save', () => {
        const service: CloudService = TestBed.get(CloudService);
        let mockStorageRef = ({ put: () => 'hi' } as unknown) as firebase.storage.Reference;
        service.storage = ({
            ref: () => mockStorageRef,
        } as unknown) as firebase.storage.Storage;

        let spy = spyOn(mockStorageRef, 'put');
        service.save('id', {} as Blob);
        expect(spy).toHaveBeenCalled();
    });

    it('should delete file to firebase App on call delete', () => {
        const service: CloudService = TestBed.get(CloudService);
        let mockStorageRef = ({ delete: () => 'hi' } as unknown) as firebase.storage.Reference;
        service.storage = ({
            ref: () => mockStorageRef,
        } as unknown) as firebase.storage.Storage;

        let spy = spyOn(mockStorageRef, 'delete');
        service.delete('id');
        expect(spy).toHaveBeenCalled();
    });

    it('should download file to firebase App on call download', () => {
        const service: CloudService = TestBed.get(CloudService);
        let mockStorageRef = ({ getDownloadURL: () => 'hi' } as unknown) as firebase.storage.Reference;
        service.storage = ({
            ref: () => mockStorageRef,
        } as unknown) as firebase.storage.Storage;

        expect((service.download('id') as unknown) as string).toEqual('hi');
    });
});
