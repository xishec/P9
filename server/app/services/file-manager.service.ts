import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { Drawing } from '../../../common/communication/Drawing';
import { DrawingInfo } from '../../../common/communication/DrawingInfo';
import { DrawingInfoModel } from '../model/post';
import { CloudService } from '../services/cloud.service';
import Types from '../types';

@injectable()
export class FileManagerService {
    constructor(@inject(Types.CloudService) private cloudService: CloudService) {}

    async getAllDrawingInfos() {
        const drawingInfos = (await DrawingInfoModel.find({})) as DrawingInfo[];
        const drawings: Drawing[] = [];

        for (const drawingInfo of drawingInfos) {
            await this.downloadSVG(drawings, drawingInfo);
        }

        return drawings;
    }

    async downloadSVG(drawings: any, drawingInfo: any) {
        const buffer: [Buffer] = (await this.cloudService.download(drawingInfo.createdAt.toString())) as [Buffer];
        drawings.push({ drawingInfo, svg: buffer[0].toString() } as Drawing);
    }

    async addDrawingInfo(drawing: Drawing) {
        if (!this.isDrawingInfoValid(drawing.drawingInfo)) {
            throw new Error('Invalid DrawingInfo');
        }
        const drawingInfo: DrawingInfo = drawing.drawingInfo;

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
