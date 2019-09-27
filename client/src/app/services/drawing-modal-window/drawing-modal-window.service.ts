import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Color } from 'src/classes/Color';
import { DrawingInfo } from 'src/classes/DrawingInfo';

@Injectable({
    providedIn: 'root',
})
export class DrawingModalWindowService {
    infoSource: BehaviorSubject<DrawingInfo> = new BehaviorSubject({
        width: 0,
        height: 0,
        color: new Color(),
        opacity: 1,
    });
    blankDrawingZone = new BehaviorSubject(true);

    changeInfo(drawingInfo: DrawingInfo): void {
        this.infoSource.next(drawingInfo);
    }

    updateDrawingZoneState(isBlank: boolean): void {
        this.blankDrawingZone.next(isBlank);
    }
}
