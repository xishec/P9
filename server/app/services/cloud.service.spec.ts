import { expect } from 'chai';
import * as sinon from 'sinon';

import { CloudService } from './cloud.service';

describe('CloudService', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should initialize connection on call initialize', () => {
        const cloudService = new CloudService();
        expect(cloudService).eql(cloudService);
    });

    it('should save test string to firebase on call save', () => {
        const cloudService = new CloudService();
        cloudService.save('test', 'test');
        expect(cloudService).eql(cloudService);
    });

    it('should download test string from firebase on call download', () => {
        const cloudService = new CloudService();
        cloudService.download('test');
        expect(cloudService).eql(cloudService);
    });

    it('should delete test string from firebase on call delete', () => {
        const cloudService = new CloudService();
        cloudService.save('test', 'test');
        setTimeout(() => {
            cloudService.delete('test');
        }, 1000);
        expect(cloudService).eql(cloudService);
    });
});
