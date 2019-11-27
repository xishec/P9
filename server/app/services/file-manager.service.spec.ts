import { expect } from 'chai';
import * as sinon from 'sinon';

import { DrawingInfo } from '../../../common/communication/DrawingInfo';
import { DrawingModel } from '../model/post';
import { FileManagerService } from './file-manager.service';

let fileManagerService: FileManagerService;

let getAllDrawingsStub: sinon.SinonStub<[], any>;

const TEST_DRAWING_INFO: DrawingInfo = {
    width: 1560,
    height: 916,
    color: 'f9fff7ff',
    name: 'La Cene',
    labels: ['Italie', 'Leonardo', 'De Vinci'],
    idStack: ['0', '1', '2', '3', '4', '5'],
    createdAt: 0,
    lastModified: 0,
} as DrawingInfo;

describe('FileManagerService', () => {
    fileManagerService = new FileManagerService();

    afterEach(() => {
        sinon.restore();
    });

    it('should return a list of documents when getAllDrawings is called', async () => {
        getAllDrawingsStub = sinon.stub(fileManagerService, 'getAllDrawings');

        fileManagerService.addDrawing(TEST_DRAWING_INFO);
        getAllDrawingsStub.resolves([TEST_DRAWING_INFO]);

        const result = await fileManagerService.getAllDrawings();
        expect(result).to.eql([TEST_DRAWING_INFO]);
    });

    it('should return a list of documents when database sends valid documents on getAllDrawings', async () => {
        fileManagerService.addDrawing(TEST_DRAWING_INFO);
        const postFind = sinon.fake.resolves([TEST_DRAWING_INFO]);
        sinon.replace(DrawingModel, 'find', postFind);

        const result = await fileManagerService.getAllDrawings();
        expect(result).to.eql([TEST_DRAWING_INFO]);
    });

    it('should return an error when database cannot retrieve documents on getAllDrawings', async () => {
        const error: Error = new Error();
        fileManagerService.addDrawing(TEST_DRAWING_INFO);
        const postFind = sinon.fake.rejects(error);
        sinon.replace(DrawingModel, 'find', postFind);

        const result = await fileManagerService.getAllDrawings().catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });

    it('should return a drawing when addDrawing is called with a valid message', async () => {
        const postUpdate = sinon.fake.resolves([TEST_DRAWING_INFO]);
        sinon.replace(DrawingModel, 'findOneAndUpdate', postUpdate);

        const result = await fileManagerService.addDrawing(TEST_DRAWING_INFO);
        expect(result).to.eql(TEST_DRAWING_INFO);
    });

    it('should return an error when database cannot retrieve documents on addDrawing', async () => {
        const error: Error = new Error();
        const postUpdate = sinon.fake.rejects(error);
        sinon.replace(DrawingModel, 'findOneAndUpdate', postUpdate);

        const result = await fileManagerService.addDrawing(TEST_DRAWING_INFO).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });

    it('should return an error when addDrawing is called with an invalid message', () => {
        const badDrawing = TEST_DRAWING_INFO;
        badDrawing.name = '';

        fileManagerService.addDrawing(badDrawing).catch((err) => {
            expect(err.message).to.eql(new Error('Invalid Drawing').message);
        });
    });

    it('should return a drawing when deleteDrawing is called with a valid message', async () => {
        TEST_DRAWING_INFO.name = 'hi';
        fileManagerService.addDrawing(TEST_DRAWING_INFO);
        const postDelete = sinon.fake.resolves([TEST_DRAWING_INFO]);
        sinon.replace(DrawingModel, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawing(TEST_DRAWING_INFO.createdAt.toString());
        expect(result).to.eql([TEST_DRAWING_INFO]);
    });

    it('should return an error when database cannot retrieve document on deleteDrawing', async () => {
        const error: Error = new Error();
        const postDelete = sinon.fake.rejects(error);
        sinon.replace(DrawingModel, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawing(TEST_DRAWING_INFO.name).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });
});
