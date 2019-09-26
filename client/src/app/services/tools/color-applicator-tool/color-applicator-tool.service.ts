import { Injectable } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root'
})
export class ColorApplicatorToolService extends AbstractToolService {

    constructor(private drawStack: DrawStackService) { super(); }

    onMouseMove(event: MouseEvent): void {

    }
    onMouseDown(event: MouseEvent): void {

    }
    onMouseUp(event: MouseEvent): void {

    }
    onMouseEnter(event: MouseEvent): void {

    }
    onMouseLeave(event: MouseEvent): void {

    }
    onKeyDown(event: KeyboardEvent): void {

    }
    onKeyUp(event: KeyboardEvent): void {

    }
}
