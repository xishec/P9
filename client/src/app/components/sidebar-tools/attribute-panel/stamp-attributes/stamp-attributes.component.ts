import { Component, OnInit } from '@angular/core';
import { ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-stamp-attributes',
    templateUrl: './stamp-attributes.component.html',
    styleUrls: ['./stamp-attributes.component.scss'],
})
export class StampAttributesComponent implements OnInit {
    toolName = ToolName.Stamp;

    constructor() {}

    ngOnInit() {}
}
