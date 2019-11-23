import { injectable } from 'inversify';
import 'reflect-metadata';
import { Drawing } from '../../../common/communication/Drawing';
import { DrawingModel } from '../model/post';

@injectable()
export class FileManagerService {
    async getAllDrawings(){
        return DrawingModel.find({});
    }

    async addDrawing(drawing: Drawing){
            if (!this.isDrawingValid(drawing)) {
                throw new Error('Invalid Drawing');
            }

        const currentTimestamp = Date.now();
        const newCreatedOn = (drawing.createdOn === 0) ? currentTimestamp : drawing.createdOn;

        const query = { createdOn: drawing.createdOn, name: drawing.name };
        const newDrawing = {
            name: drawing.name,
            labels: drawing.labels,
            svg: drawing.svg,
            idStack: drawing.idStack,
            drawingInfo: drawing.drawingInfo,
            createdOn: newCreatedOn,
            lastModified: currentTimestamp,
        };
        const options = { upsert: true, new: true };

        return DrawingModel.findOneAndUpdate(query, newDrawing, options).then(() => {
            return newDrawing as Drawing;
        });
    }

    async deleteDrawing(createdOn: string) {
        return DrawingModel.findOneAndDelete({ createdOn: parseInt(createdOn) });
    }

    isDrawingValid(drawing: Drawing): boolean {
        return !(drawing.name === '' || drawing.labels.includes('') || drawing.svg === '');
    }
}
