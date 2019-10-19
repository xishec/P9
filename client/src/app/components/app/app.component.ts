import { Component, HostListener, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';

import { WelcomeModalWindowComponent } from '../../components/welcome-modal-window/welcome-modal-window.component';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    displayNewDrawingModalWindow = false;
    displayWelcomeModalWindow = false;
    welcomeModalWindowClosed = false;
    isOnInput = false;

    constructor(
        private welcomeModalWindowService: WelcomeModalWindowService,
        private dialog: MatDialog,
        private drawingModalWindowService: DrawingModalWindowService,
        private shortcutManagerService: ShortcutManagerService,
    ) {}

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

    shouldAllowShortcut(): boolean {
        return (
            !this.displayNewDrawingModalWindow &&
            (this.welcomeModalWindowClosed || !this.displayWelcomeModalWindow) &&
            !this.isOnInput
        );
    }

    @HostListener('window:contextmenu', ['$event']) onRightClick(event: MouseEvent) {
        event.preventDefault();
    }

}
