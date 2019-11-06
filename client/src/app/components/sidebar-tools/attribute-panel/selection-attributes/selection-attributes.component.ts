import { Component } from '@angular/core';

import { ToolName, CLIPBOARD_BUTTON_INFO } from 'src/constants/tool-constants';

@Component({
    selector: 'app-selection-attributes',
    templateUrl: './selection-attributes.component.html',
    styleUrls: ['./selection-attributes.component.scss'],
})
export class SelectionAttributesComponent {
    readonly CLIPBOARD_BUTTONS = CLIPBOARD_BUTTON_INFO;
    toolName = ToolName.Selection;



    onButtonTrigger(): void {

    }
}
