import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { Drawing } from '../../../../../../common/communication/Drawing';

@Injectable({
    providedIn: 'root',
})
export class DrawingLoaderService {
    currentDrawing: BehaviorSubject<Drawing> = new BehaviorSubject({
        svg: '',
        drawingInfo: {
            name: '',
            labels: [],
            idStack: [],
            createdOn: 0,
            lastModified: 0,
            width: 0,
            height: 0,
            color: '',
        } as DrawingInfo,
    } as Drawing);

    emptyDrawStack: BehaviorSubject<boolean> = new BehaviorSubject(true);
    untouchedWorkZone: BehaviorSubject<boolean> = new BehaviorSubject(true);
}
