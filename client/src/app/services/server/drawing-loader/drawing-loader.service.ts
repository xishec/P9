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

    constructor() {}
}
