import { Component, OnInit } from '@angular/core';

import { ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-dropper-attributes',
    templateUrl: './dropper-attributes.component.html',
    styleUrls: ['./dropper-attributes.component.scss'],
})
export class EyedropperAttributesComponent implements OnInit {
    toolName = ToolName.Dropper;

    constructor() {}

    ngOnInit() {}
}
