import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class DrawingInfoService {
	constructor() {}

	width: number;
	height: number;

	getWidth() {
		console.log("w");
		return this.width;
	}

	getHeight() {
		console.log("h");
		return this.height;
	}
}
