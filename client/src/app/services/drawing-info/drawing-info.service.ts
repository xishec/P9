import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export class Info {
	width: number;
	height: number;
}

@Injectable({
	providedIn: "root",
})
export class DrawingInfoService {
	constructor() {}

	private infoSource: BehaviorSubject<Info> = new BehaviorSubject({ width: 0, height: 0 });
	currentInfo = this.infoSource.asObservable();

	changeInfo(info: Info) {
		this.infoSource.next(info);
	}
}
