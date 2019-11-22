import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { MongoError } from 'mongodb';

import { FileManagerService } from '../services/file-manager.service';
import { Message } from '../../../common/communication/Message';
import Types from '../types';
import { Drawing } from '../../../common/communication/Drawing';

@injectable()
export class FileManagerController {
    router: Router;

    constructor(
        @inject(Types.FileManagerService)
        private fileManagerService: FileManagerService,
    ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            const drawings = await this.fileManagerService.getAllDrawings();
            res.json(drawings);
        });

        this.router.post('/save', (req: Request, res: Response, next: NextFunction) => {
            this.fileManagerService
                .addDrawing(req.body)
                .then((newDrawing: Drawing) => {
                    res.json(newDrawing);
                })
                .catch((error: MongoError) => {
                    throw error;
                });
        });

        this.router.delete('/:id', async (req: Request, res: Response, nex: NextFunction) => {
            let id = req.params.id;
            this.fileManagerService
                .deleteDrawing(id)
                .then((deletedDrawing: any) => {
                    res.json({ title: 'Delete', body: 'Success' } as Message);
                })
                .catch((error: MongoError) => {
                    throw error;
                });
        });
    }
}
