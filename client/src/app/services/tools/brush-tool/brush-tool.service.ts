import { Injectable } from '@angular/core';

import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    constructor() {
        super();
    }

    onMouseDown(e: MouseEvent){}

    onMouseMove(e: MouseEvent){}
}
