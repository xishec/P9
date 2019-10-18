import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Drawing } from '../../../../../../common/communication/Drawing';

@Injectable({
    providedIn: 'root',
})
export class DrawingLoaderService {
    currentRefSVG: BehaviorSubject<Drawing> = new BehaviorSubject({
        name: '',
        labels: [''],
        svg: '',
        idStack: [''],
    });

    currentHeight: BehaviorSubject<number> = new BehaviorSubject(0);
    currentWidth: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor() {}
}
