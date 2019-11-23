import { injectable } from 'inversify';
import 'reflect-metadata';
import { DrawingModel } from '../model/post';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';

@injectable()
export class FileManagerService {
    async getAllDrawings(){
        return DrawingModel.find({});
    }

    async addDrawing(drawingInfo: DrawingInfo) {
        if (!this.isDrawingValid(drawingInfo)) {
            throw new Error('Invalid Drawing');
        }

        const currentTimestamp = Date.now();
        const newCreatedOn = drawingInfo.createdOn === 0 ? currentTimestamp : drawingInfo.createdOn;

        const query = { createdOn: drawingInfo.createdOn, name: drawingInfo.name };
        const options = { upsert: true, new: true };

        drawingInfo.createdOn = newCreatedOn;
        drawingInfo.lastModified = currentTimestamp;

        return DrawingModel.findOneAndUpdate(query, drawingInfo, options).then(() => {
            return drawingInfo;
        });
    }

    async deleteDrawing(createdOn: string) {
        return DrawingModel.findOneAndDelete({ createdOn: parseInt(createdOn) });
    }

    isDrawingValid(drawingInfo: DrawingInfo): boolean {
        return drawingInfo.name !== '' && drawingInfo.height > 0 && drawingInfo.width > 0;
    }
}
