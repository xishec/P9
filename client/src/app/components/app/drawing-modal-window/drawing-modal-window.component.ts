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

	submitCount: number = 0;

	constructor(formBuilder: FormBuilder, drawingInfoService: DrawingInfoService) {
		this.formBuilder = formBuilder;
		this.drawingInfoService = drawingInfoService;
		this.colors = drawingInfoService.colors;
		this.activeColor = drawingInfoService.colors[0];
	}

	ngOnInit(): void {
		this.myForm = this.formBuilder.group({
			hex: [this.activeColor.hex, [Validators.pattern("^[0-9A-Fa-f]{6}$")]],
			R: [
				parseInt(this.activeColor.hex.slice(0, 2), 16),
				[Validators.required, Validators.min(0), Validators.max(255)],
			],
			G: [
				parseInt(this.activeColor.hex.slice(2, 4), 16),
				[Validators.required, Validators.min(0), Validators.max(255)],
			],
			B: [
				parseInt(this.activeColor.hex.slice(4, 6), 16),
				[Validators.required, Validators.min(0), Validators.max(255)],
			],
			A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
			confirm: this.submitCount == 0,
			width: [window.innerWidth - 360, [Validators.required, Validators.min(0), Validators.max(10000)]],
			height: [window.innerHeight, [Validators.required, Validators.min(0), Validators.max(10000)]],
		});
	}

	onSubmit() {
		let info: Info = {
			width: this.myForm.value.width,
			height: this.myForm.value.height,
			color: this.activeColor,
			opacity: this.myForm.value.A,
		};
		this.drawingInfoService.changeInfo(info);
		this.show = false;

		this.submitCount++;
	}

	@HostListener("window:resize", ["$event"])
	onResize() {
		if (!this.myForm.dirty) {
			this.myForm.controls["width"].setValue(window.innerWidth - 360);
			this.myForm.controls["height"].setValue(window.innerHeight);
		}
	}

	changeColor(i: number) {
		this.activeColor = this.colors[i];
		this.myForm.controls["hex"].setValue(this.activeColor.hex);
		this.myForm.controls["R"].setValue(parseInt(this.activeColor.hex.slice(0, 2), 16));
		this.myForm.controls["G"].setValue(parseInt(this.activeColor.hex.slice(2, 4), 16));
		this.myForm.controls["B"].setValue(parseInt(this.activeColor.hex.slice(4, 6), 16));
	}

	onUserColorHex() {
		this.activeColor = { hex: this.myForm.value.hex };
		this.myForm.controls["R"].setValue(parseInt(this.activeColor.hex.slice(0, 2), 16));
		this.myForm.controls["G"].setValue(parseInt(this.activeColor.hex.slice(2, 4), 16));
		this.myForm.controls["B"].setValue(parseInt(this.activeColor.hex.slice(4, 6), 16));
	}
	onUserColorRGB() {
		let r = Number(this.myForm.value.R).toString(16);
		let g = Number(this.myForm.value.G).toString(16);
		let b = Number(this.myForm.value.B).toString(16);
		if (r.length == 1) {
			r = "0" + r;
		}
		if (g.length == 1) {
			g = "0" + g;
		}
		if (b.length == 1) {
			b = "0" + b;
		}
		this.activeColor = { hex: r + g + b };
		this.myForm.controls["hex"].setValue(this.activeColor.hex);
	}

	getColorIcon(color: Color) {
		return { "background-color": "#" + color.hex };
	}
	getUserColorIcon() {
		return { "background-color": "#" + this.activeColor.hex, opacity: String(this.myForm.value.A) };
	}
}
