import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { ContentComponent } from "./content/content.component";

@Component({
	selector: "app-drawing-modal-window",
	templateUrl: "./drawing-modal-window.component.html",
	styleUrls: ["./drawing-modal-window.component.scss"],
})
export class DrawingModalWindowComponent implements OnInit {
	modalWindow: MatDialog;

	ngOnInit() {
		this.openModalWindow();
	}

	constructor(modalWindow: MatDialog) {
		this.modalWindow = modalWindow;
	}

	openModalWindow() {
		this.modalWindow.open(ContentComponent);
	}
}
