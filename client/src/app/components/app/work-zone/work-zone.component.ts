import { Component, OnInit } from "@angular/core";

import { Info, DrawingInfoService } from "../../../services/drawing-info/drawing-info.service";

@Component({
	selector: "app-work-zone",
	templateUrl: "./work-zone.component.html",
	styleUrls: ["./work-zone.component.scss"],
})
export class WorkZoneComponent implements OnInit {
	drawingInfoService: DrawingInfoService;
	info: Info;

	constructor(drawingInfoService: DrawingInfoService) {
		this.drawingInfoService = drawingInfoService;
	}

	ngOnInit() {
		this.drawingInfoService.currentInfo.subscribe((info) => {
			this.info = info;
		});
	}

	width: number;
	height: number;

	hi() {
		// this.width = this.drawingInfoService.width;
		// this.height = this.drawingInfoService.height;
		console.log(this.info.width, this.info.height);
	}

	getWidth() {}
}
