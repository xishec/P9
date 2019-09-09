import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Component({
	selector: "app-drawing-modal-window",
	templateUrl: "./drawing-modal-window.component.html",
	styleUrls: ["./drawing-modal-window.component.scss"],
})
export class DrawingModalWindowComponent implements OnInit {
	ngOnInit() {
		this.openModalWindow();
	}

	modalWindow: MatDialog;

	constructor(modalWindow: MatDialog) {
		this.modalWindow = modalWindow;
	}

	openModalWindow() {
		this.modalWindow.open(DrawingModalWindowContent);
	}
}

@Component({
	templateUrl: "drawing-modal-window-content.html",
})
export class DrawingModalWindowContent {}
