import { injectable } from 'inversify';
import 'reflect-metadata';
import { DrawingModel } from '../model/post';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';

@injectable()
export class FileManagerService {
    async getAllDrawings(): Promise<any> {
        const query = {};

        return DrawingModel.find(query)
            .then((drawingInfos: any) => {
                return drawingInfos;
            })
            .catch((error: Error) => {
                throw error;
            });
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

    async deleteDrawing(id: string): Promise<any> {
        const query = { id: id };

        return DrawingModel.findOneAndDelete(query)
            .then((deletedDrawing: any) => {
                return deletedDrawing;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    isDrawingValid(drawingInfo: DrawingInfo): boolean {
        return drawingInfo.name !== '' && drawingInfo.height > 0 && drawingInfo.width > 0;
    }
}
