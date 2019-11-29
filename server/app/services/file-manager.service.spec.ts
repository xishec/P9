import { expect } from 'chai';
import * as sinon from 'sinon';

import { DrawingInfo } from '../../../common/communication/DrawingInfo';
import { DrawingInfoModel } from '../model/post';
import { FileManagerService } from './file-manager.service';
import { Drawing } from '../../../common/communication/Drawing';
import { CloudService } from './cloud.service';

let fileManagerService: FileManagerService;

let getAllDrawingInfosStub: sinon.SinonStub<[], any>;

const TEST_DRAWING: Drawing = {
    drawingInfo: {
        width: 1560,
        height: 916,
        color: 'f9fff7ff',
        name: 'La Cene',
        labels: ['Italie', 'Leonardo', 'De Vinci'],
        idStack: ['0', '1', '2', '3', '4', '5'],
        createdAt: 0,
        lastModified: 0,
    } as DrawingInfo,
    svg: '',
};

describe('FileManagerService', () => {
    let cloudService = new CloudService();
    fileManagerService = new FileManagerService(cloudService);

    afterEach(() => {
        sinon.restore();
    });

    it('should return a list of documents when getAllDrawingInfos is called', async () => {
        getAllDrawingInfosStub = sinon.stub(fileManagerService, 'getAllDrawingInfos');

        fileManagerService.addDrawingInfo(TEST_DRAWING);
        getAllDrawingInfosStub.resolves([TEST_DRAWING.drawingInfo]);

        const result = await fileManagerService.getAllDrawingInfos();
        expect(result).to.eql([TEST_DRAWING.drawingInfo]);
    });

    it('should return a list of documents when database sends valid documents on getAllDrawingInfos', async () => {
        fileManagerService.addDrawingInfo(TEST_DRAWING);
        const postFind = sinon.fake.resolves([TEST_DRAWING.drawingInfo]);
        sinon.replace(DrawingInfoModel, 'find', postFind);

        const result = await fileManagerService.getAllDrawingInfos();
        expect(result).to.eql([TEST_DRAWING.drawingInfo]);
    });

    it('should return an error when database cannot retrieve documents on getAllDrawingInfos', async () => {
        const error: Error = new Error();
        fileManagerService.addDrawingInfo(TEST_DRAWING);
        const postFind = sinon.fake.rejects(error);
        sinon.replace(DrawingInfoModel, 'find', postFind);

        const result = await fileManagerService.getAllDrawingInfos().catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });

    it('should return a drawing when addDrawingInfo is called with a valid message', async () => {
        const postUpdate = sinon.fake.resolves([TEST_DRAWING.drawingInfo]);
        sinon.replace(DrawingInfoModel, 'findOneAndUpdate', postUpdate);

        const result = await fileManagerService.addDrawingInfo(TEST_DRAWING);
        expect(result).to.eql(TEST_DRAWING.drawingInfo);
    });

    it('should return an error when database cannot retrieve documents on addDrawingInfo', async () => {
        const error: Error = new Error();
        const postUpdate = sinon.fake.rejects(error);
        sinon.replace(DrawingInfoModel, 'findOneAndUpdate', postUpdate);

        const result = await fileManagerService.addDrawingInfo(TEST_DRAWING).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });

    it('should return an error when addDrawingInfo is called with an invalid message', () => {
        TEST_DRAWING.drawingInfo.name = '';

        fileManagerService.addDrawingInfo(TEST_DRAWING).catch((err) => {
            expect(err.message).to.eql(new Error('Invalid Drawing').message);
        });
    });

    it('should return a drawing when deleteDrawingInfo is called with a valid message', async () => {
        TEST_DRAWING.drawingInfo.name = 'hi';
        fileManagerService.addDrawingInfo(TEST_DRAWING);
        const postDelete = sinon.fake.resolves([TEST_DRAWING.drawingInfo]);
        sinon.replace(DrawingInfoModel, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawingInfo(TEST_DRAWING.drawingInfo.createdAt.toString());
        expect(result).to.eql([TEST_DRAWING.drawingInfo]);
    });

    it('should return an error when database cannot retrieve document on deleteDrawingInfo', async () => {
        const error: Error = new Error();
        const postDelete = sinon.fake.rejects(error);
        sinon.replace(DrawingInfoModel, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawingInfo(TEST_DRAWING.drawingInfo.name).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });
});
