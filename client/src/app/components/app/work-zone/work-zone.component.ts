import { Component, OnInit } from "@angular/core";

import { DrawingInfoService } from "../../../services/drawing-info/drawing-info.service";

@Component({
	selector: "app-work-zone",
	templateUrl: "./work-zone.component.html",
	styleUrls: ["./work-zone.component.scss"],
})
export class WorkZoneComponent implements OnInit {
	drawingInfoService: DrawingInfoService;

	constructor(drawingInfoService: DrawingInfoService) {
		this.drawingInfoService = drawingInfoService;
	}

	ngOnInit() {}

	width: number;
	height: number;

	hi() {
		// this.width = this.drawingInfoService.width;
		// this.height = this.drawingInfoService.height;
		console.log(this.width, this.height);
	}

	getWidth() {
		this.drawingInfoService.getWidth();
	}

	getHeight() {
		this.drawingInfoService.getHeight();
	}
}
