import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { MongoError } from 'mongodb';

import { Drawing } from '../../../common/communication/Drawing';
import { FileManagerService } from '../services/file-manager.service';
import Types from '../types';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';
import { CloudService } from '../services/cloud.service';

@injectable()
export class FileManagerController {
    router: Router;

    constructor(
        @inject(Types.FileManagerService)
        private fileManagerService: FileManagerService,
        @inject(Types.CloudService) private cloudService: CloudService,
    ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            const drawingInfos = (await this.fileManagerService.getAllDrawingInfos()) as DrawingInfo[];
            let drawings: Drawing[] = [];
            drawingInfos.forEach(async (drawingInfo: DrawingInfo) => {
                let buffer: [Buffer] = await this.cloudService.download(drawingInfo.createdAt.toString());
                drawings.push({ drawingInfo: drawingInfo, svg: buffer[0].toString() } as Drawing);
            });
            res.json(drawingInfos);
        });

        this.router.post('/save', (req: Request, res: Response, next: NextFunction) => {
            let drawing: Drawing = req.body;
            this.fileManagerService
                .addDrawingInfo(drawing.drawingInfo)
                .then((newDrawingInfo: DrawingInfo) => {
                    drawing.drawingInfo = newDrawingInfo;
                })
                .catch((error: MongoError) => {
                    throw error;
                });
            this.cloudService.save(drawing.drawingInfo.createdAt.toString(), drawing.svg);
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
