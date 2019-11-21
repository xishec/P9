import { injectable } from 'inversify';
import 'reflect-metadata';
import { Drawing } from '../../../common/communication/Drawing';
import { Post } from '../model/post';

@injectable()
export class FileManagerService {
    async getAllDrawings(): Promise<any> {
        const query = { title: /Add Drawing/i };

        return Post.find(query)
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

        const query = { name: drawing.name };
        const update = { body: drawing };
        const options = { upsert: true, new: true };

        return Post.findOneAndUpdate(query, update, options)
            .then((drawingToUpdate: any) => {
                return drawingToUpdate;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async deleteDrawing(name: string): Promise<any> {
        const query = { name: { $regex: name, $options: 'i' } };

        return Post.findOneAndDelete(query)
            .then((drawing: any) => {
                return drawing;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    isDrawingValid(drawing: Drawing): boolean {
        return !(drawing.name === '' || drawing.labels.includes('') || drawing.svg === '');
    }
}
