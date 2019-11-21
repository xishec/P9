import { expect } from 'chai';
import * as sinon from 'sinon';

import { Drawing } from '../../../common/communication/Drawing';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';
import { Post } from '../model/post';
import { FileManagerService } from './file-manager.service';

let fileManagerService: FileManagerService;

let getAllDrawingsStub: sinon.SinonStub<[], any>;

const TEST_DRAWING: Drawing = {
    name: 'La Cene',
    labels: ['Italie', 'Leonardo', 'De Vinci'],
    svg: '{"svg":"<rect _ngcontent-oyl-c2="" height="916px" width="1560px" }',
    idStack: ['0', '1', '2', '3', '4', '5'],
    drawingInfo: { width: 1560, height: 916, color: 'f9fff7ff' } as DrawingInfo,
    timeStamp: 0,
} as Drawing;

describe('FileManagerService', () => {
    fileManagerService = new FileManagerService();

    afterEach(() => {
        sinon.restore();
    });

    it('should return a list of documents when getAllDrawings is called', async () => {
        getAllDrawingsStub = sinon.stub(fileManagerService, 'getAllDrawings');

        fileManagerService.addDrawing(TEST_DRAWING);
        getAllDrawingsStub.resolves([TEST_DRAWING]);

        const result = await fileManagerService.getAllDrawings();
        expect(result).to.eql([TEST_DRAWING]);
    });

    it('should return a list of documents when database sends valid documents on getAllDrawings', async () => {
        fileManagerService.addDrawing(TEST_DRAWING);
        const postFind = sinon.fake.resolves([TEST_DRAWING]);
        sinon.replace(Post, 'find', postFind);

        const result = await fileManagerService.getAllDrawings();
        expect(result).to.eql([TEST_DRAWING]);
    });

    it('should return an error when database cannot retrieve documents on getAllDrawings', async () => {
        const error: Error = new Error();
        fileManagerService.addDrawing(TEST_DRAWING);
        const postFind = sinon.fake.rejects(error);
        sinon.replace(Post, 'find', postFind);

        const result = await fileManagerService.getAllDrawings().catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });

    it('should return a drawing when addDrawing is called with a valid message', async () => {
        const postUpdate = sinon.fake.resolves([TEST_DRAWING]);
        sinon.replace(Post, 'findOneAndUpdate', postUpdate);

        const result = await fileManagerService.addDrawing(TEST_DRAWING);
        expect(result).to.eql([TEST_DRAWING]);
    });

    it('should return an error when database cannot retrieve documents on addDrawing', async () => {
        const error: Error = new Error();
        const postUpdate = sinon.fake.rejects(error);
        sinon.replace(Post, 'findOneAndUpdate', postUpdate);

        const result = await fileManagerService.addDrawing(TEST_DRAWING).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });

    it('should return an error when addDrawing is called with an invalid message', () => {
        const badDrawing = TEST_DRAWING;
        badDrawing.name = '';

        fileManagerService.addDrawing(badDrawing).catch((err) => {
            expect(err).to.eql(new Error('Invalid Drawing'));
        });
    });

    it('should return a drawing when deleteDrawing is called with a valid message', async () => {
        fileManagerService.addDrawing(TEST_DRAWING);
        const postDelete = sinon.fake.resolves([TEST_DRAWING]);
        sinon.replace(Post, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawing(TEST_DRAWING.name);
        expect(result).to.eql([TEST_DRAWING]);
    });

    it('should return an error when database cannot retrieve document on deleteDrawing', async () => {
        const error: Error = new Error();
        const postDelete = sinon.fake.rejects(error);
        sinon.replace(Post, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawing(TEST_DRAWING.name).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });
});
