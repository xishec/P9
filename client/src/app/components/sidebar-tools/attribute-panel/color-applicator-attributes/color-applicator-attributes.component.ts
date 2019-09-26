import { Component, OnInit } from '@angular/core';
import { ToolName } from 'src/app/services/constants';

@Component({
  selector: 'app-color-applicator-attributes',
  templateUrl: './color-applicator-attributes.component.html',
  styleUrls: ['./color-applicator-attributes.component.scss']
})
export class ColorApplicatorAttributesComponent implements OnInit {
    toolName = ToolName.ColorApplicator;

  constructor() { }

  ngOnInit() {
  }

}
