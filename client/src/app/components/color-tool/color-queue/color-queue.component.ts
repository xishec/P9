import { Component } from '@angular/core';

import { Color } from '../../../../classes/Color';

@Component({
    selector: 'app-color-queue',
    templateUrl: './color-queue.component.html',
    styleUrls: ['./color-queue.component.scss'],
})
export class ColorQueueComponent {
    colorQueue: Color[] = [];

    constructor() {}

    
}
