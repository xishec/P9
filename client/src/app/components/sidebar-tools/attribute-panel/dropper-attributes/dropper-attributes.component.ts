import { Component } from '@angular/core';

import { ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-dropper-attributes',
    templateUrl: './dropper-attributes.component.html',
    styleUrls: ['./dropper-attributes.component.scss'],
})
export class DropperAttributesComponent {
    toolName = ToolName.Dropper;
}
