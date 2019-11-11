import { NextFunction, Request, Response, Router } from 'express';
import { injectable } from 'inversify';

import { Drawing } from '../../../common/communication/Drawing';
import { Message } from '../../../common/communication/Message';
// tslint:disable-next-line
const Post = require('../model/post');

@injectable()
export class FileManagerController {
    router: Router;

    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/get-all-drawing', async (req: Request, res: Response, next: NextFunction) => {
            const query = { title: /Add Drawing/i };

            Post.find(query)
                .then((ans: Message) => {
                    res.json(ans);
                })
                .catch((error: Error) => {
                    res.json(error);
                });
        });

        this.router.post('/save', (req: Request, res: Response, next: NextFunction) => {
            const message: Message = req.body;

            const drawing: Drawing = JSON.parse(message.body);
            if (drawing.name === '' || drawing.labels.includes('') || drawing.svg === '') {
                const error: Message = new Message('Invalid Drawing', 'Invalid Drawing');
                res.json(error);
            }

            const query = { title: message.title };
            const update = { body: message.body };
            const options = { upsert: true, new: true };

            Post.findOneAndUpdate(query, update, options)
                .then((ans: Message) => {
                    res.json(ans);
                })
                .catch((error: Error) => {
                    res.json(error);
                });
        });

        this.router.post('/delete', async (req: Request, res: Response, next: NextFunction) => {
            const message: Message = req.body;

            const query = { title: { $regex: message.body, $options: 'i' } };

            Post.findOneAndDelete(query)
                .then((ans: Message) => {
                    res.json(ans);
                })
                .catch((error: Error) => {
                    res.json(error);
                });
        });
    }
}
