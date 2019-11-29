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
            const drawing = (await this.fileManagerService.getAllDrawingInfos()) as Drawing[];
            res.json(drawing);
        });

        this.router.post('/save', (req: Request, res: Response, next: NextFunction) => {
            let drawing: Drawing = req.body;
            this.fileManagerService
                .addDrawingInfo(drawing)
                .then((newDrawingInfo: DrawingInfo) => {
                    drawing.drawingInfo = newDrawingInfo;
                })
                .catch((error: MongoError) => {
                    throw error;
                });
            res.json(drawing);
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
