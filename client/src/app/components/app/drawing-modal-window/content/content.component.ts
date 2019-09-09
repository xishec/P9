import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { DrawingInfoService } from "../../../../services/drawing-info/drawing-info.service";

@Component({
	selector: "app-content",
	templateUrl: "./content.component.html",
	styleUrls: ["./content.component.scss"],
})
export class ContentComponent implements OnInit {
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

		this.myForm.valueChanges.subscribe(console.log);
	}

	onSubmit() {
		this.drawingInfoService.width = this.myForm.value.width;
		this.drawingInfoService.height = this.myForm.value.height;

		console.log(this.drawingInfoService.width, this.drawingInfoService.height);
	}
}
