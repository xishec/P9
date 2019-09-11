import { Component } from '@angular/core';
import { TracingTool } from 'src/classes/TracingTool/tracing-tool';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent extends TracingTool {

  constructor() {
    super();
  }

}
