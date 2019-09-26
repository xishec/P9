import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Message } from '../../../../../common/communication/message';
import { WelcomeModalWindowComponent } from '../../components/welcome-modal-window/welcome-modal-window.component';
import { IndexService } from '../../services/index/index.service';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';
import { ToolName } from '../../services/constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    readonly title = 'LOG2990';
    message = new BehaviorSubject<string>('');
    displayNewDrawingModalWindow = false;
    displayWelcomeModalWindow = false;

    constructor(
        private basicService: IndexService,
        private welcomeModalWindowService: WelcomeModalWindowService,
        private dialog: MatDialog,
        private toolSelectorService: ToolSelectorService,
        private drawingModalWindowService: DrawingModalWindowService,
    ) {
        this.basicService
            .basicGet()
            .pipe(map((message: Message) => `${message.title} ${message.body}`))
            .subscribe(this.message);
    }

    ngOnInit(): void {
        this.openWelcomeModalWindow();
        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe(
            (displayNewDrawingModalWindow: boolean) => {
                this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
            },
        );
        this.displayWelcomeModalWindow = this.welcomeModalWindowService.getValueFromLocalStorage();
    }

    openWelcomeModalWindow(): void {
        if (this.welcomeModalWindowService.getValueFromLocalStorage()) {
            const dialogRef = this.dialog.open(WelcomeModalWindowComponent, {
                panelClass: 'myapp-max-width-dialog',
                disableClose: true,
            });
            dialogRef.afterClosed().subscribe((displayWelcomeModalWindow) => {
                displayWelcomeModalWindow = displayWelcomeModalWindow.toString();
                this.welcomeModalWindowService.setValueToLocalStorage(displayWelcomeModalWindow);
            });
        }
    }

    @HostListener('window:contextmenu', ['$event']) onRightClick(event: MouseEvent) {
        event.preventDefault();
    }

    @HostListener('window:keydown.control.s', ['$event']) onControlS(event: KeyboardEvent) {
        event.preventDefault();
        if (!this.displayNewDrawingModalWindow && !this.displayWelcomeModalWindow) {
        }
    }

    @HostListener('window:keydown.control.o', ['$event']) onControlO(event: KeyboardEvent) {
        event.preventDefault();
        if (!this.displayNewDrawingModalWindow && !this.displayWelcomeModalWindow) {
            this.toolSelectorService.changeTool(ToolName.NewDrawing);
        }
    }

    @HostListener('window:keydown.c', ['$event']) onC(event: KeyboardEvent) {
        event.preventDefault();
        if (!this.displayNewDrawingModalWindow && !this.displayWelcomeModalWindow) {
            this.toolSelectorService.changeTool(ToolName.Pencil);
        }
    }

    @HostListener('window:keydown.p', ['$event']) onP(event: KeyboardEvent) {
        event.preventDefault();
        if (!this.displayNewDrawingModalWindow && !this.displayWelcomeModalWindow) {
            this.toolSelectorService.changeTool(ToolName.Brush);
        }
    }

    @HostListener('window:keydown.1', ['$event']) on1(event: KeyboardEvent) {
        event.preventDefault();
        if (!this.displayNewDrawingModalWindow && !this.displayWelcomeModalWindow) {
            this.toolSelectorService.changeTool(ToolName.Rectangle);
        }
    }
}
