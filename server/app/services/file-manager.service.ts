import { injectable } from 'inversify';
import 'reflect-metadata';
import { Drawing } from '../../../common/communication/Drawing';
import { DrawingModel } from '../model/post';

@injectable()
export class FileManagerService {
    async getAllDrawings() {
        return DrawingModel.find({});
    }

    async addDrawing(drawing: Drawing) {
        if (!this.isDrawingValid(drawing.drawingInfo)) {
            throw new Error('Invalid Drawing');
        }

        const currentTimestamp = Date.now();
        const newCreatedOn = drawing.drawingInfo.createdAt === 0 ? currentTimestamp : drawing.drawingInfo.createdAt;

        const query = { createdAt: drawing.drawingInfo.createdAt, name: drawing.drawingInfo.name };
        const options = { upsert: true, new: true };

        drawing.drawingInfo.createdAt = newCreatedOn;
        drawing.drawingInfo.lastModified = currentTimestamp;

        return DrawingModel.findOneAndUpdate(query, drawing.drawingInfo, options).then(() => {
            return drawing.drawingInfo;
        });
    }

    async deleteDrawing(createdAt: string) {
        return DrawingModel.findOneAndDelete({ createdAt: parseInt(createdAt, 10) });
    }

    isDrawingValid(drawing: Drawing): boolean {
        return drawing.drawingInfo.name !== '' && drawing.drawingInfo.height > 0 && drawing.drawingInfo.width > 0;
    }
}
