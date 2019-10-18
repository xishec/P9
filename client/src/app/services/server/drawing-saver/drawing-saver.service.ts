import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NameAndLabels } from 'src/classes/NameAndLabels';

@Injectable({
    providedIn: 'root',
})
export class DrawingSaverService {
    currentDrawingLabels: BehaviorSubject<NameAndLabels> = new BehaviorSubject(new NameAndLabels('', ['']));

    constructor() {}
}
