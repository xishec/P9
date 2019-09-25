import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from '../../../../classes/Color';

interface IconStyle {
  backgroundColor: string;
  opacity: string;
}

@Component({
    selector: 'app-color-queue',
    templateUrl: './color-queue.component.html',
    styleUrls: ['./color-queue.component.scss'],
})
export class ColorQueueComponent implements OnInit {
    colorQueue: Color[] = [];
    @Output() clickedColorButton = new EventEmitter<Color>();

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit(): void {
      this.colorToolService.colorQueueBSubject.subscribe((colorQueue) => {
        this.colorQueue = colorQueue;
      });
    }

    onClickColorButton(color: Color): void {
      this.clickedColorButton.emit(color);
    }

    getColorIcon(color: Color): IconStyle {
      return { backgroundColor: '#' + color.hex, opacity: '1' };
  }
}
