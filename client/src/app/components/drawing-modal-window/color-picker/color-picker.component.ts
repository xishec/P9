import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { MatSliderChange } from '@angular/material';
import { COLOR_SELECTION_SHIFT } from '../../../services/constants';
import { DrawingModalWindowService } from '../../../services/drawing-modal-window/drawing-modal-window.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    blackLevel = 0;

    @ViewChild('canvas_picker', { static: true }) canvasPicker: ElementRef<HTMLCanvasElement>;
    @ViewChild('currentColor', { static: true }) currentColor: ElementRef<HTMLCanvasElement>;

    constructor(private drawingModalWindowService: DrawingModalWindowService) {}

    ngOnInit() {
        const img = new Image();
        img.src = '../../../assets/color-wheel.png';

        this.canvas = this.canvasPicker.nativeElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        img.onload = () => {
            this.context.drawImage(img, 0, 0);
        };
    }

    onSliderChange(event: MatSliderChange): void {
        if (event.value === null) {
            return;
        }
        this.blackLevel = event.value;
        this.canvasPicker.nativeElement.style.filter = 'brightness(' + (1 - this.blackLevel) * 100 + '%)';
    }

    onCanvasClick(event: MouseEvent): void {
        const x = event.offsetX;
        const y = event.offsetY;

        const pixel = this.context.getImageData(x, y, 1, 1).data;
        if (this.blackLevel === undefined) {
            this.blackLevel = 0;
        }
        if (this.blackLevel !== 1 && pixel[0] + pixel[1] + pixel[2] + pixel[3] === 0) {
            return;
        }

        const newHex = this.drawingModalWindowService.rgbToHex(
            pixel[0] - pixel[0] * this.blackLevel,
            pixel[1] - pixel[1] * this.blackLevel,
            pixel[2] - pixel[2] * this.blackLevel,
        );
        this.drawingModalWindowService.changeActiveColor({ hex: newHex });

        this.currentColor.nativeElement.style.display = 'inline';
        this.currentColor.nativeElement.style.top = (event.y - COLOR_SELECTION_SHIFT).toString() + 'px';
        this.currentColor.nativeElement.style.left = (event.x - COLOR_SELECTION_SHIFT).toString() + 'px';
        this.currentColor.nativeElement.style.backgroundColor = '#' + newHex;
    }
}
