import { Component, OnInit } from '@angular/core';
import { Stroke } from './pen.stroke';

@Component({
  selector: 'app-pen',
  templateUrl: './pen.component.html',
  styleUrls: ['./pen.component.scss']
})
export class PenComponent implements OnInit {

  // tslint:disable-next-line: no-empty
  constructor() { }

  strokes: Stroke[] = [];
  nbStrokes = 0;
  isDrawing = false;
  currentStrokeWidth = 3; // DEFAULT MAGIC VALUE

  mouseDown(e: MouseEvent): void {
    this.isDrawing = true;
    this.strokes.push(new Stroke(e.offsetX, e.offsetY, this.currentStrokeWidth));
  }

  mouseMove(e: MouseEvent): void {
    if (this.isDrawing) {
      this.strokes[this.nbStrokes].addCoordinate(e.offsetX, e.offsetY);
    }
  }

  mouseUp(e: MouseEvent): void {
    this.nbStrokes += 1;
    this.isDrawing = false;
  }

  // tslint:disable-next-line: no-empty
  ngOnInit() {
  }

}
