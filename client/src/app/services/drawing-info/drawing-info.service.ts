import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export class Info {
	width: number;
	height: number;
	color: Color;
}

export class Color {
	hex: string;
}

@Injectable({
	providedIn: "root",
})
export class DrawingInfoService {
	constructor() {}

	colors: Array<Color> = [
		{ hex: "#FFFFFF" },
		{ hex: "#eb7070" },
		{ hex: "#fec771" },
		{ hex: "#e6e56c" },
		{ hex: "#64e291" },
		{ hex: "#64c4ed" },
		{ hex: "#077bf0" },
	];

	private infoSource: BehaviorSubject<Info> = new BehaviorSubject({ width: 0, height: 0, color: this.colors[0] });
	currentInfo = this.infoSource.asObservable();

	changeInfo(info: Info) {
		this.infoSource.next(info);
	}
}
