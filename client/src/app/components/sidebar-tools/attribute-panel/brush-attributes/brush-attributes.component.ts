import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-brush-attributes',
    templateUrl: './brush-attributes.component.html',
    styleUrls: ['./brush-attributes.component.scss'],
})
export class BrushAttributesComponent implements OnInit {
    toolName: string = 'Pinceau';

    constructor() {}

    ngOnInit() {}
}
