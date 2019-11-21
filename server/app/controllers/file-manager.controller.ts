import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { MongoError } from 'mongodb';

import { FileManagerService } from '../services/file-manager.service';
import Types from '../types';

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
                .then((drawing: any) => {
                    res.json(drawing);
                })
                .catch((error: MongoError) => {
                    throw error;
                });
        });

        this.router.delete('/:name', async (req: Request, res: Response, nex: NextFunction) => {
            this.fileManagerService
                .deleteDrawing(name)
                .then((drawing: any) => {
                    res.json({ title: 'Delete', body: 'Success' });
                })
                .catch((error: MongoError) => {
                    throw error;
                });
        });
    }
}
