import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class ToolsService {
	constructor() {}

	private toolIds: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8];
	private currentToolId: number = -999;

	getToolIds() {
		return this.toolIds;
	}
	getCurrentToolId() {
		return this.currentToolId;
	}

	changeTool(toolId: number) {
		this.currentToolId = toolId;
	}
}
