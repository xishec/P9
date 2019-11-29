import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { MongoError } from 'mongodb';

import { Drawing } from '../../../common/communication/Drawing';
import { FileManagerService } from '../services/file-manager.service';
import Types from '../types';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';

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
            const drawingInfos = await this.fileManagerService.getAllDrawingInfos();
            res.json(drawingInfos);
        });

        this.router.post('/save', (req: Request, res: Response, next: NextFunction) => {
            this.fileManagerService
                .addDrawingInfo(req.body.drawingInfo)
                .then((newDrawingInfo: DrawingInfo) => {
                    res.json({ drawingInfo: newDrawingInfo, svg: '' } as Drawing);
                })
                .catch((error: MongoError) => {
                    throw error;
                });
        });

        this.router.delete('/:id', async (req: Request, res: Response, nex: NextFunction) => {
            const id: string = req.params.id;
            this.fileManagerService
                .deleteDrawingInfo(id)
                .then(() => {
                    res.json(Number(id));
                })
                .catch((error: MongoError) => {
                    throw error;
                });
        });
    }
}
