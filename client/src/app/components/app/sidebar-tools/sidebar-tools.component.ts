import { Component, OnInit } from "@angular/core";

import { ToolsService } from "../../../services/panel-tools/tools.service";

@Component({
	selector: "app-sidebar-tools",
	templateUrl: "./sidebar-tools.component.html",
	styleUrls: ["./sidebar-tools.component.scss"],
})
export class SidebarToolsComponent implements OnInit {
	toolsService: ToolsService;

	toolIds: Array<number>;
	currentToolId: number;

	constructor(toolsService: ToolsService) {
		this.toolsService = toolsService;
		this.toolIds = toolsService.getToolIds();
		this.currentToolId = toolsService.getCurrentToolId();
	}

	ngOnInit() {}

	changeTool(toolId: number) {
		this.toolsService.changeTool(toolId);
	}
}
