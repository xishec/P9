import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-sidebar",
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
	constructor() {}

	ngOnInit() {}

	toolIds: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8];
	toolId: number;

	changeTool(toolId: number) {
		this.toolId = toolId;
	}
}
