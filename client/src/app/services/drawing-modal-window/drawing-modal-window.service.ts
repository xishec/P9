import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DEFAULT_WHITE } from 'src/constants/color-constants';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';

@Injectable({
    providedIn: 'root',
})
export class DrawingModalWindowService {
    drawingInfo: BehaviorSubject<DrawingInfo> = new BehaviorSubject<DrawingInfo>({
        width: 0,
        height: 0,
        color: DEFAULT_WHITE,
    } as DrawingInfo);

    changeDrawingInfo(width: number, height: number, color: string) {
        this.drawingInfo.value.width = width;
        this.drawingInfo.value.height = height;
        this.drawingInfo.value.color = color;
        this.drawingInfo.next(this.drawingInfo.value);
    }
}
