import { Component } from '@angular/core';

import { ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-selection-attributes',
    templateUrl: './selection-attributes.component.html',
    styleUrls: ['./selection-attributes.component.scss'],
})
export class SelectionAttributesComponent {
    toolName = ToolName.Selection;
}
