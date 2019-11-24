import { expect } from 'chai';
import * as sinon from 'sinon';

import { DrawingInfo } from '../../../common/communication/DrawingInfo';
import { DrawingModel } from '../model/post';
import { FileManagerService } from './file-manager.service';

let fileManagerService: FileManagerService;

let getAllDrawingsStub: sinon.SinonStub<[], any>;

const TEST_DRAWINGINFO: DrawingInfo = {
    name: 'La Cene',
    labels: ['Italie', 'Leonardo', 'De Vinci'],
    idStack: ['0', '1', '2', '3', '4', '5'],
    width: 1560,
    height: 916,
    color: 'f9fff7ff',
    createdOn: 0,
    lastModified: 0,
} as DrawingInfo;

describe('FileManagerService', () => {
    fileManagerService = new FileManagerService();

    afterEach(() => {
        sinon.restore();
    });

    it('should return a list of documents when getAllDrawings is called', async () => {
        getAllDrawingsStub = sinon.stub(fileManagerService, 'getAllDrawings');

        fileManagerService.addDrawing(TEST_DRAWINGINFO);
        getAllDrawingsStub.resolves([TEST_DRAWINGINFO]);

        const result = await fileManagerService.getAllDrawings();
        expect(result).to.eql([TEST_DRAWINGINFO]);
    });

    it('should return a list of documents when database sends valid documents on getAllDrawings', async () => {
        fileManagerService.addDrawing(TEST_DRAWINGINFO);
        const postFind = sinon.fake.resolves([TEST_DRAWINGINFO]);
        sinon.replace(DrawingModel, 'find', postFind);

        const result = await fileManagerService.getAllDrawings();
        expect(result).to.eql([TEST_DRAWINGINFO]);
    });

    it('should return an error when database cannot retrieve documents on getAllDrawings', async () => {
        const error: Error = new Error();
        fileManagerService.addDrawing(TEST_DRAWINGINFO);
        const postFind = sinon.fake.rejects(error);
        sinon.replace(DrawingModel, 'find', postFind);

        const result = await fileManagerService.getAllDrawings().catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });

    it('should return a drawing when addDrawing is called with a valid message', async () => {
        const postUpdate = sinon.fake.resolves([TEST_DRAWINGINFO]);
        sinon.replace(DrawingModel, 'findOneAndUpdate', postUpdate);

        const result = await fileManagerService.addDrawing(TEST_DRAWINGINFO);
        expect(result).to.eql([TEST_DRAWINGINFO]);
    });

    it('should return an error when database cannot retrieve documents on addDrawing', async () => {
        const error: Error = new Error();
        const postUpdate = sinon.fake.rejects(error);
        sinon.replace(DrawingModel, 'findOneAndUpdate', postUpdate);

        const result = await fileManagerService.addDrawing(TEST_DRAWINGINFO).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });

    it('should return an error when addDrawing is called with an invalid message', () => {
        const badDrawing = TEST_DRAWINGINFO;
        badDrawing.name = '';

        fileManagerService.addDrawing(badDrawing).catch((err) => {
            expect(err).to.eql(new Error('Invalid Drawing'));
        });
    });

    it('should return a drawing when deleteDrawing is called with a valid message', async () => {
        fileManagerService.addDrawing(TEST_DRAWINGINFO);
        const postDelete = sinon.fake.resolves([TEST_DRAWINGINFO]);
        sinon.replace(DrawingModel, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawing(TEST_DRAWINGINFO.name);
        expect(result).to.eql([TEST_DRAWINGINFO]);
    });

    it('should return an error when database cannot retrieve document on deleteDrawing', async () => {
        const error: Error = new Error();
        const postDelete = sinon.fake.rejects(error);
        sinon.replace(DrawingModel, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawing(TEST_DRAWINGINFO.name).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });
});
