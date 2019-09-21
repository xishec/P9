import { Component, ElementRef, OnInit, ViewChild, Renderer2, HostListener } from '@angular/core';

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
    blackLevel: number = 0;

    @ViewChild('canvas_picker', { static: true }) canvasPicker: ElementRef<HTMLCanvasElement>;
    @ViewChild('currentColor', { static: true }) currentColor: ElementRef<HTMLElement>;

    constructor(private drawingModalWindowService: DrawingModalWindowService, private renderer: Renderer2) {}

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
        let brightness = 'brightness(' + (1 - this.blackLevel) * 100 + '%)';
        this.renderer.setStyle(this.canvasPicker.nativeElement, 'filter', brightness);
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
            pixel[2] - pixel[2] * this.blackLevel
        );
        this.drawingModalWindowService.changeActiveColor({ hex: newHex });

        this.renderer.setStyle(this.currentColor.nativeElement, 'display', 'inline');
        this.renderer.setStyle(
            this.currentColor.nativeElement,
            'top',
            (event.y - COLOR_SELECTION_SHIFT).toString() + 'px'
        );
        this.renderer.setStyle(
            this.currentColor.nativeElement,
            'left',
            (event.x - COLOR_SELECTION_SHIFT).toString() + 'px'
        );
        this.renderer.setStyle(this.currentColor.nativeElement, 'background-color', '#' + newHex);
    }
}
