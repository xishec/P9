import { Component, OnInit } from '@angular/core';

import { ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-dropper-attributes',
    templateUrl: './dropper-attributes.component.html',
    styleUrls: ['./dropper-attributes.component.scss'],
})
export class DropperAttributesComponent implements OnInit {
    toolName = ToolName.Dropper;

    // tslint:disable-next-line: no-empty
    constructor() {}

    // tslint:disable-next-line: no-empty
    ngOnInit() {}
}
