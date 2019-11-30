import { injectable, inject } from 'inversify';
import 'reflect-metadata';

import { DrawingInfoModel } from '../model/post';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';
import { CloudService } from '../services/cloud.service';
import Types from '../types';
import { Drawing } from '../../../common/communication/Drawing';

@injectable()
export class FileManagerService {
    constructor(@inject(Types.CloudService) private cloudService: CloudService) {}

    async getAllDrawingInfos() {
        let drawingInfos = (await DrawingInfoModel.find({})) as DrawingInfo[];
        let drawings: Drawing[] = [];

        for (const drawingInfo of drawingInfos) {
            await this.downloadSVG(drawings, drawingInfo);
        }

        return drawings;
    }

    async downloadSVG(drawings: any, drawingInfo: any) {
        let buffer: [Buffer] = await this.cloudService.download(drawingInfo.createdAt.toString());
        drawings.push({ drawingInfo: drawingInfo, svg: buffer[0].toString() } as Drawing);
    }

    async addDrawingInfo(drawing: Drawing) {
        if (!this.isDrawingInfoValid(drawing.drawingInfo)) {
            throw new Error('Invalid DrawingInfo');
        }
        let drawingInfo: DrawingInfo = drawing.drawingInfo;

        const currentTimestamp = Date.now();
        const newCreatedOn = drawingInfo.createdAt === 0 ? currentTimestamp : drawingInfo.createdAt;

        const query = { createdAt: drawingInfo.createdAt, name: drawingInfo.name };
        const options = { upsert: true, new: true };

        drawingInfo.createdAt = newCreatedOn;
        drawingInfo.lastModified = currentTimestamp;

        this.cloudService.save(drawing.drawingInfo.createdAt.toString(), drawing.svg);
        return DrawingInfoModel.findOneAndUpdate(query, drawingInfo, options).then(() => {
            return drawingInfo;
        });
    }

    async deleteDrawingInfo(createdAt: string) {
        return DrawingInfoModel.findOneAndDelete({ createdAt: parseInt(createdAt, 10) });
    }

    isDrawingInfoValid(drawingInfo: DrawingInfo): boolean {
        return drawingInfo.name !== '' && drawingInfo.height > 0 && drawingInfo.width > 0;
    }
}
