import { injectable } from 'inversify';
import 'reflect-metadata';
import { Drawing } from '../../../common/communication/Drawing';
import { DrawingModel } from '../model/post';

@injectable()
export class FileManagerService {
    async getAllDrawings(): Promise<any> {
        const query = {};

        return DrawingModel.find(query)
            .then((drawings: any) => {
                return drawings;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async addDrawing(drawing: Drawing): Promise<any> {
        try {
            if (!this.isDrawingValid(drawing)) {
                throw new Error('Invalid Drawing');
            }
        } catch (error) {
            return error;
        }

        console.log(drawing);
        
        
        const currentTimestamp = Date.now();
        const newCreatedOn = (drawing.createdOn === 0) ? currentTimestamp : drawing.createdOn;

        const query = drawing;
        const update = {
            name: drawing.name,
            labels: drawing.labels,
            svg: drawing.svg,
            idStack: drawing.idStack,
            drawingInfo: drawing.drawingInfo,
            createdOn: newCreatedOn,
            lastModified: currentTimestamp,
        };
        const options = { upsert: true, new: true };

        return DrawingModel.findOneAndUpdate(query, update, options)
            .then((drawingToUpdate: any) => {
                return drawingToUpdate;
            })
            .catch((error: Error) => {
                throw error;
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

    isDrawingValid(drawing: Drawing): boolean {
        return !(drawing.name === '' || drawing.labels.includes('') || drawing.svg === '');
    }
}
