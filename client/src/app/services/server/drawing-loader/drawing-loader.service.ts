import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Drawing } from '../../../../../../common/communication/Drawing';
import { DrawingInfo } from 'src/classes/DrawingInfo';

@Injectable({
    providedIn: 'root',
})
export class DrawingLoaderService {
    currentDrawing: BehaviorSubject<Drawing> = new BehaviorSubject({
        name: '',
        labels: [],
        svg: '',
        idStack: [],
        drawingInfo: new DrawingInfo(0, 0, ''),
    });

    emptyDrawStack: BehaviorSubject<boolean> = new BehaviorSubject(true);

    constructor() {}
}
