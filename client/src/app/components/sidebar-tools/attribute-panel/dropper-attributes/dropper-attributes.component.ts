import { Component } from '@angular/core';

import { TOOL_NAME } from 'src/constants/tool-constants';

@Component({
    selector: 'app-dropper-attributes',
    templateUrl: './dropper-attributes.component.html',
    styleUrls: ['./dropper-attributes.component.scss'],
})
export class DropperAttributesComponent {
    toolName = TOOL_NAME.Dropper;
}
