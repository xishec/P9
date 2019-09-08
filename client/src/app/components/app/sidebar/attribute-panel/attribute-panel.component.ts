import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-attribute-panel",
	templateUrl: "./attribute-panel.component.html",
	styleUrls: ["./attribute-panel.component.scss"],
})
export class AttributePanelComponent implements OnInit {
	constructor() {}

	ngOnInit() {}

	@Input() toolId: number;
}
