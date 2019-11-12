import { injectable } from 'inversify';
import 'reflect-metadata';
import { Post } from '../model/post';
import { Message } from '../../../common/communication/Message';
import { Drawing } from '../../../common/communication/Drawing';

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

    async addDrawing(message: Message): Promise<any> {
        const drawing: Drawing = JSON.parse(message.body);

        if (drawing.name === '' || drawing.labels.includes('') || drawing.svg === '') {
            const error: Message = new Message('Invalid Drawing', 'Invalid Drawing');
            throw error;
        }

        const query = { title: message.title };
        const update = { body: message.body };
        const options = { upsert: true, new: true };

        return Post.findOneAndUpdate(query, update, options)
            .then((drawingToUpdate: any) => {
                return drawingToUpdate;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async deleteDrawing(message: Message): Promise<any> {
        const query = { title: { $regex: message.body, $options: 'i' } };
        return Post.findOneAndDelete(query)
            .then((drawing: any) => {
                return drawing;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}
