import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { MongoError } from 'mongodb';

import { FileManagerService } from '../services/file-manager.service';
import Types from '../types';

@injectable()
export class FileManagerController {
    router: Router;

    constructor(@inject(Types.FileManagerService) private fileManagerService: FileManagerService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            this.fileManagerService
                .getAllDrawings()
                .then(async (drawings: any) => {
                    res.json(drawings);
                })
                .catch((error: MongoError) => {
                    throw error;
                });
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

        this.router.post('/delete', async (req: Request, res: Response, next: NextFunction) => {
            this.fileManagerService
                .deleteDrawing(req.body)
                .then((drawing: any) => {
                    res.json('Success!');
                })
                .catch((error: MongoError) => {
                    res.json(error);
                });
        });
    }
}
