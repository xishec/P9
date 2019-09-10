import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export class Info {
	width: number;
	height: number;
	color: Color;
	opacity: number;
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
		{ hex: "ffffff" },
		{ hex: "bbbbbb" },
		{ hex: "888888" },
		{ hex: "000000" },
		{ hex: "a970eb" },
		{ hex: "eb70e9" },
		{ hex: "eb70a7" },
		{ hex: "eb7070" },
		{ hex: "fec771" },
		{ hex: "e6e56c" },
		{ hex: "64e291" },
		{ hex: "07e4f0" },
		{ hex: "077bf0" },
		{ hex: "5057de" },
	];

	private infoSource: BehaviorSubject<Info> = new BehaviorSubject({ width: 0, height: 0, color: this.colors[0] });
	currentInfo = this.infoSource.asObservable();

	changeInfo(info: Info) {
		this.infoSource.next(info);
	}
}
