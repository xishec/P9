import { Component } from '@angular/core';
import { TracingTool } from 'src/classes/TracingTool/tracing-tool';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent extends TracingTool {

  paths: string[];

  constructor() {
    super();
    this.paths = [];
  }

  mouseDown(e: MouseEvent) {
    super.mouseDown(e);
    this.paths.push(`M${e.offsetX} ${e.offsetY}`);
  }

  mouseMove(e: MouseEvent) {
    super.mouseMove(e);
    if (this.isDrawing) {
      this.paths[this.nbStrokes] += ` L${e.offsetX} ${e.offsetY}`;
    }
  }

}
