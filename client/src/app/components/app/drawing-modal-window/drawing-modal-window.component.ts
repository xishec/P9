import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { Info, DrawingInfoService } from "../../../services/drawing-info/drawing-info.service";

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

	constructor(formBuilder: FormBuilder, drawingInfoService: DrawingInfoService) {
		this.formBuilder = formBuilder;
		this.drawingInfoService = drawingInfoService;
	}

	ngOnInit(): void {
		this.myForm = this.formBuilder.group({
			width: "",
			height: "",
		});
	}

	onSubmit() {
		let info: Info = { width: this.myForm.value.width, height: this.myForm.value.height };
		this.drawingInfoService.changeInfo(info);
		this.show = false;
	}
}
