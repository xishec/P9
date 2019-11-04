import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { DEFAULT_WHITE } from 'src/constants/color-constants';

interface IconStyle {
    backgroundColor: string;
}

@Component({
    selector: 'app-color-queue',
    templateUrl: './color-queue.component.html',
    styleUrls: ['./color-queue.component.scss'],
})
export class ColorQueueComponent implements OnInit {
    colorQueue: string[] = [];
    @Output() clickedColorButton = new EventEmitter<string>();

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit(): void {
        this.colorToolService.colorQueue.subscribe((colorQueue) => {
            this.colorQueue = colorQueue;
        });
        this.colorToolService.colorQueue.next([DEFAULT_WHITE]);
    }

    onClickColorButton(color: string): void {
        this.clickedColorButton.emit(color);
    }

    getColorIcon(color: string): IconStyle {
        return { backgroundColor: '#' + color };
    }
}
