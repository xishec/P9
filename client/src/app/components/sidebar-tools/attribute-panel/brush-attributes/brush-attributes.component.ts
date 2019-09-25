import { Component, OnInit } from '@angular/core';

import { ToolName } from '../../../../services/constants';

@Component({
    selector: 'app-brush-attributes',
    templateUrl: './brush-attributes.component.html',
    styleUrls: ['./brush-attributes.component.scss'],
})
export class BrushAttributesComponent implements OnInit {
    toolName: string = ToolName.Brush;

    constructor() {}

    ngOnInit() {}
}
