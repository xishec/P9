import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Message } from '../../../../../common/communication/message';
import { WelcomeModalWindowComponent } from '../../components/welcome-modal-window/welcome-modal-window.component';
import { ToolName } from '../../services/constants';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { IndexService } from '../../services/index/index.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';
import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';

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
    welcomeModalWindowClosed = false;
    isOnInput = false;

    constructor(
        private basicService: IndexService,
        private welcomeModalWindowService: WelcomeModalWindowService,
        private dialog: MatDialog,
        private toolSelectorService: ToolSelectorService,
        private drawingModalWindowService: DrawingModalWindowService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.basicService
            .basicGet()
            .pipe(map((message: Message) => `${message.title} ${message.body}`))
            .subscribe(this.message);
    }

    ngOnInit(): void {
        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe(
            (displayNewDrawingModalWindow: boolean) => {
                this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
            },
        );
        this.shortcutManagerService.currentIsOnInput.subscribe((isOnInput: boolean) => {
            this.isOnInput = isOnInput;
        });
        this.welcomeModalWindowService.currentWelcomeModalWindowClosed.subscribe(
            (welcomeModalWindowClosed: boolean) => {
                this.welcomeModalWindowClosed = welcomeModalWindowClosed;
            },
        );
        this.displayWelcomeModalWindow = this.welcomeModalWindowService.getValueFromLocalStorage();
        this.openWelcomeModalWindow();
    }

    openWelcomeModalWindow(): void {
        if (this.displayWelcomeModalWindow) {
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

    checkEventPreventionCondition(): boolean {
        return (
            !this.displayNewDrawingModalWindow &&
            (this.welcomeModalWindowClosed || !this.displayWelcomeModalWindow) &&
            !this.isOnInput
        );
    }

    @HostListener('window:contextmenu', ['$event']) onRightClick(event: MouseEvent) {
        event.preventDefault();
    }

    @HostListener('window:keydown.control.s', ['$event']) onControlS(event: KeyboardEvent) {
        event.preventDefault();
        if (this.checkEventPreventionCondition()) {
            // will be implemented later
        }
    }

    @HostListener('window:keydown.control.o', ['$event']) onControlO(event: KeyboardEvent) {
        event.preventDefault();
        if (this.checkEventPreventionCondition()) {
            this.toolSelectorService.changeTool(ToolName.NewDrawing);
        }
    }

    @HostListener('window:keydown.c', ['$event']) onC(event: KeyboardEvent) {
        if (this.checkEventPreventionCondition()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Pencil);
        }
    }

    @HostListener('window:keydown.w', ['$event']) onP(event: KeyboardEvent) {
        if (this.checkEventPreventionCondition()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Brush);
        }
    }

    @HostListener('window:keydown.1', ['$event']) on1(event: KeyboardEvent) {
        if (this.checkEventPreventionCondition()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Rectangle);
        }
    }

    @HostListener('window:keydown.r', ['$event']) onR(event: KeyboardEvent) {
        if (this.checkEventPreventionCondition()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.ColorApplicator);
        }
    }
}
