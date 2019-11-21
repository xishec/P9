import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Drawing } from '../../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';

@Injectable({
    providedIn: 'root',
})
export class DrawingLoaderService {
    currentDrawing: BehaviorSubject<Drawing> = new BehaviorSubject({
        name: '',
        labels: [],
        svg: '',
        idStack: [],
        drawingInfo: { width: 0, height: 0, color: '' } as DrawingInfo,
        timeStamp: 0,
    } as Drawing);

    emptyDrawStack: BehaviorSubject<boolean> = new BehaviorSubject(true);
    untouchedWorkZone: BehaviorSubject<boolean> = new BehaviorSubject(true);
}
