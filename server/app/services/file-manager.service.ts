import { injectable } from 'inversify';
import 'reflect-metadata';
import { DrawingInfoModel } from '../model/post';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';

@injectable()
export class FileManagerService {
    async getAllDrawingInfos() {
        return DrawingInfoModel.find({});
    }

    async addDrawingInfo(drawingInfo: DrawingInfo) {
        if (!this.isDrawingInfoValid(drawingInfo)) {
            throw new Error('Invalid DrawingInfo');
        }

        const currentTimestamp = Date.now();
        const newCreatedOn = drawingInfo.createdAt === 0 ? currentTimestamp : drawingInfo.createdAt;

        const query = { createdAt: drawingInfo.createdAt, name: drawingInfo.name };
        const options = { upsert: true, new: true };

        drawingInfo.createdAt = newCreatedOn;
        drawingInfo.lastModified = currentTimestamp;

        return DrawingInfoModel.findOneAndUpdate(query, drawingInfo, options).then(() => {
            return drawingInfo;
        });
    }

    async deleteDrawingInfo(createdAt: string) {
        return DrawingInfoModel.findOneAndDelete({ createdAt: parseInt(createdAt, 10) });
    }

    isDrawingInfoValid(drawingInfo: DrawingInfo): boolean {
        return drawingInfo.name !== '' && drawingInfo.height > 0 && drawingInfo.width > 0;
    }
}
