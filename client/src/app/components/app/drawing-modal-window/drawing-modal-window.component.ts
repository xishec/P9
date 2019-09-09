import { Component, OnInit, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Info, Color, DrawingInfoService } from "../../../services/drawing-info/drawing-info.service";

@Component({
	selector: "app-drawing-modal-window",
	templateUrl: "./drawing-modal-window.component.html",
	styleUrls: ["./drawing-modal-window.component.scss"],
})
export class DrawingModalWindowComponent implements OnInit {
	show: boolean = true;

	myForm: FormGroup;
	formBuilder: FormBuilder;

	drawingInfoService: DrawingInfoService;

	colors: Array<Color>;
	activeColor: Color;

	constructor(formBuilder: FormBuilder, drawingInfoService: DrawingInfoService) {
		this.formBuilder = formBuilder;
		this.drawingInfoService = drawingInfoService;
		this.colors = drawingInfoService.colors;
		this.activeColor = drawingInfoService.colors[0];
	}

	ngOnInit(): void {
		this.myForm = this.formBuilder.group({
			color: this.activeColor.hex,
			width: [window.innerWidth - 360, [Validators.required, Validators.min(0), Validators.max(10000)]],
			height: [window.innerHeight, [Validators.required, Validators.min(0), Validators.max(10000)]],
		});
	}

	onSubmit() {
		let info: Info = { width: this.myForm.value.width, height: this.myForm.value.height, color: this.activeColor };
		this.drawingInfoService.changeInfo(info);
		this.show = false;
		console.log(info);
	}

	@HostListener("window:resize", ["$event"])
	onResize() {
		if (!this.myForm.dirty) {
			this.myForm.setValue({
				width: window.innerWidth - 360,
				height: window.innerHeight,
			});
		}
	}

	changeColor(i: number) {
		this.activeColor = this.colors[i];
		this.myForm.controls["color"].setValue(this.activeColor.hex);
	}

	onUserColor() {
		this.activeColor = { hex: this.myForm.value.color };
	}

	getColorIcon(color: Color) {
		return { "background-color": "#" + color.hex };
	}
	getUserColorIcon() {
		return { "background-color": "#" + this.activeColor.hex };
	}
}
