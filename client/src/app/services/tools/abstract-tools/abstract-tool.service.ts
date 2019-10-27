import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractToolService {

  // tslint:disable-next-line: no-empty
  constructor() { }

  abstract onMouseMove(event: MouseEvent): void;
  abstract onMouseDown(event: MouseEvent): void;
  abstract onMouseUp(event: MouseEvent): void;
  abstract onMouseEnter(event: MouseEvent): void;
  abstract onMouseLeave(event: MouseEvent): void;
  abstract onKeyDown(event: KeyboardEvent): void;
  abstract onKeyUp(event: KeyboardEvent): void;
  abstract cleanUp(): void;
}

export interface MouseCoords {
    x: number;
    y: number;
}
