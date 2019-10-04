import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
  providedIn: 'root',
})
export class LineToolService {

    // tslint:disable-next-line: no-empty
    constructor(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {}

}
