import { expect } from 'chai';
import * as sinon from 'sinon';

import { Drawing } from '../../../common/communication/Drawing';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';
import { Message } from '../../../common/communication/Message';
import { Post } from '../model/post';
import { FileManagerService } from './file-manager.service';

let fileManagerService: FileManagerService;

let getAllDrawingsStub: sinon.SinonStub<[], any>;

const TEST_DRAWING: Drawing = new Drawing(
    'La Cene',
    ['Italie', 'Leonardo', 'De Vinci'],
    '{"svg":"<rect _ngcontent-oyl-c2="" height="916px" width="1560px" }',
    ['0', '1', '2', '3', '4', '5'],
    new DrawingInfo(1560, 916, 'f9fff7ff'),
);

const TEST_MESSAGE: Message = {
    title: 'Add Drawing ' + 'Mona Lisa',
    body: JSON.stringify(TEST_DRAWING),
};

describe('FileManagerService', () => {
    fileManagerService = new FileManagerService();

    afterEach(() => {
        sinon.restore();
    });

    it('should return a list of documents when getAllDrawings is called', async () => {
        getAllDrawingsStub = sinon.stub(fileManagerService, 'getAllDrawings');

        fileManagerService.addDrawing(TEST_MESSAGE);
        getAllDrawingsStub.resolves([TEST_DRAWING]);

        const result = await fileManagerService.getAllDrawings();
        expect(result).to.eql([TEST_DRAWING]);
    });

    it('should return a list of documents when database sends valid documents on getAllDrawings', async () => {
        fileManagerService.addDrawing(TEST_MESSAGE);
        const postFind = sinon.fake.resolves([TEST_DRAWING]);
        sinon.replace(Post, 'find', postFind);

        const result = await fileManagerService.getAllDrawings();
        expect(result).to.eql([TEST_DRAWING]);
    });

    it('should return an error when database cannot retrieve documents on getAllDrawings', async () => {
        const error: Error = new Error();
        fileManagerService.addDrawing(TEST_MESSAGE);
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

        const result = await fileManagerService.addDrawing(TEST_MESSAGE);
        expect(result).to.eql([TEST_DRAWING]);
    });

    it('should return an error when database cannot retrieve documents on addDrawing', async () => {
        const error: Error = new Error();
        const postUpdate = sinon.fake.rejects(error);
        sinon.replace(Post, 'findOneAndUpdate', postUpdate);

        const result = await fileManagerService.addDrawing(TEST_MESSAGE).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });

    it('should return an error when addDrawing is called with an invalid message', () => {
        const badDrawing = TEST_DRAWING;
        const badMessage = TEST_MESSAGE;
        badDrawing.name = '';
        badMessage.body = JSON.stringify(badDrawing);

        fileManagerService.addDrawing(badMessage).catch((err) => {
            expect(err).to.eql(new Error('Invalid Drawing'));
        });
    });

    it('should return a drawing when deleteDrawing is called with a valid message', async () => {
        fileManagerService.addDrawing(TEST_MESSAGE);
        const postDelete = sinon.fake.resolves([TEST_DRAWING]);
        sinon.replace(Post, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawing(TEST_MESSAGE);
        expect(result).to.eql([TEST_DRAWING]);
    });

    it('should return an error when database cannot retrieve document on deleteDrawing', async () => {
        const error: Error = new Error();
        const postDelete = sinon.fake.rejects(error);
        sinon.replace(Post, 'findOneAndDelete', postDelete);

        const result = await fileManagerService.deleteDrawing(TEST_MESSAGE).catch((err) => {
            return err;
        });
        expect(result).to.eql(error);
    });
});
