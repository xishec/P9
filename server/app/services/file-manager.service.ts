import { injectable } from 'inversify';
import 'reflect-metadata';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';
import { DrawingModel } from '../model/post';

@injectable()
export class FileManagerService {
    async getAllDrawings() {
        return DrawingModel.find({});
    }

    async addDrawing(drawingInfo: DrawingInfo) {
        if (!this.isDrawingValid(drawingInfo)) {
            throw new Error('Invalid Drawing');
        }

        const currentTimestamp = Date.now();
        const newCreatedOn = drawingInfo.createdAt === 0 ? currentTimestamp : drawingInfo.createdAt;

        const query = { createdAt: drawingInfo.createdAt, name: drawingInfo.name };
        const options = { upsert: true, new: true };

        drawingInfo.createdAt = newCreatedOn;
        drawingInfo.lastModified = currentTimestamp;

        return DrawingModel.findOneAndUpdate(query, drawingInfo, options).then(() => {
            return drawingInfo;
        });
    }

    async deleteDrawing(createdAt: string) {
        return DrawingModel.findOneAndDelete({ createdAt: parseInt(createdAt, 10) });
    }

    isDrawingValid(drawingInfo: DrawingInfo): boolean {
        return drawingInfo.name !== '' && drawingInfo.height > 0 && drawingInfo.width > 0;
    }
}
