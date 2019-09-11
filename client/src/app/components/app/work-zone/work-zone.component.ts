import { Component, OnInit } from "@angular/core";

import { Info, DrawingModalWindow } from "../../../services/drawing-modal-window/drawing-modal-window.service";

@Component({
	selector: "app-work-zone",
	templateUrl: "./work-zone.component.html",
	styleUrls: ["./work-zone.component.scss"],
})
export class WorkZoneComponent implements OnInit {
	DrawingModalWindow: DrawingModalWindow;
	info: Info;

	constructor(DrawingModalWindow: DrawingModalWindow) {
		this.DrawingModalWindow = DrawingModalWindow;
	}

	ngOnInit() {
		this.DrawingModalWindow.currentInfo.subscribe((info) => {
			this.info = info;
		});
	}

	changeStyle() {
		return {
			fill: "#" + this.info.color.hex,
			"fill-opacity": this.info.opacity,
			height: this.info.height,
			width: this.info.width,
		};
	}
}
