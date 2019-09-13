import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { RectangleTool } from "src/app/classes/RectangleTool/rectangle-tool";
import { Keys } from "src/app/keys.enum";
import { Message } from "../../../../../common/communication/message";
import { IndexService } from "../../services/index/index.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	readonly title: string = "LOG2990";
	message = new BehaviorSubject<string>("");

	// DELETE BEFORE MERGING //
	@ViewChild("svgpad", { static: true }) svgReference: ElementRef<SVGElement>;
	private currentTool: RectangleTool;
	// ---------------------//

	constructor(private basicService: IndexService) {
		this.basicService
			.basicGet()
			.pipe(map((message: Message) => `${message.title} ${message.body}`))
			.subscribe(this.message);
	}

	ngOnInit(): void {
		// DELETE BEFORE MERGING //
		this.currentTool = new RectangleTool(this.svgReference);
		// DELETE BEFORE MERGING //
	}

	// DELETE BEFORE MERGING //
	@HostListener("mousemove", ["$event"]) onMouseMove(event: MouseEvent): void {
		this.currentTool.onMouseMove(event);
	}

	@HostListener("mousedown", ["$event"]) onMouseClick(event: MouseEvent): void {
		this.currentTool.onMouseDown(event);
	}

	@HostListener("mouseup", ["$event"]) onMouseUp(event: MouseEvent): void {
		this.currentTool.onMouseUp(event);
	}

	@HostListener("mouseenter", ["$event"]) onMouseEnter(event: MouseEvent): void{
		this.currentTool.onMouseEnter(event);
	}

	@HostListener("mouseleave", ["$event"]) onMouseLeave(event: MouseEvent): void{
		this.currentTool.onMouseLeave(event);
	}

	@HostListener("window:keydown", ["$event"]) onKeyPress(event: KeyboardEvent): void {
		this.currentTool.onKeyDown(event);

		if (event.key == Keys.Backspace) {
			console.log(event.key + " -> Erasing last child");
			if (this.svgReference.nativeElement.lastChild != null) {
				this.svgReference.nativeElement.removeChild(this.svgReference.nativeElement.lastChild);
			}
		}
	}

	@HostListener("window:keyup", ["$event"]) onKeyRelease(event: KeyboardEvent): void {
		this.currentTool.onKeyUp(event);
	}
	// DELETE BEFORE MERGING //
}
