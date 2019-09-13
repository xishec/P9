import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
	selector: "app-attribute-panel",
	templateUrl: "./attribute-panel.component.html",
	styleUrls: ["./attribute-panel.component.scss"],
})
export class AttributePanelComponent implements OnInit {
	@ViewChild("rangeColor", { static: false }) public rangeColorClass: ElementRef;
    
    public nomBoutton: number;

	attributeSettings = new FormGroup({
        thickness : new FormControl("")
    });

	constructor() {}
	ngOnInit() {}

	@Input() toolId: number;

	public displayValue() {
		console.log(this.rangeColorClass.nativeElement.value);
		this.nomBoutton = this.rangeColorClass.nativeElement.value;
	}
}
