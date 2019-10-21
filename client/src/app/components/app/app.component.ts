import { Component, HostListener, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';

import { WelcomeModalWindowComponent } from '../../components/modal-windows/welcome-modal-window/welcome-modal-window.component';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    displayWelcomeModalWindow = false;
    modalIsDisplayed = false;
    isOnInput = false;

    constructor(
        private welcomeModalWindowService: WelcomeModalWindowService,
        private dialog: MatDialog,
        private shortcutManagerService: ShortcutManagerService,
        private modalManagerService: ModalManagerService,
    ) {}

    ngOnInit(): void {
        this.modalManagerService.currentModalIsDisplayed.subscribe((modalIsDisplayed) => {
            this.modalIsDisplayed = modalIsDisplayed;
        });
        this.shortcutManagerService.currentIsOnInput.subscribe((isOnInput: boolean) => {
            this.isOnInput = isOnInput;
        });
        this.displayWelcomeModalWindow = this.welcomeModalWindowService.getValueFromLocalStorage();
        if (!this.modalIsDisplayed) {
            this.openWelcomeModalWindow();
        }
    }

    openWelcomeModalWindow(): void {
        if (this.displayWelcomeModalWindow) {
            const dialogRef = this.dialog.open(WelcomeModalWindowComponent, {
                panelClass: 'myapp-max-width-dialog',
                disableClose: true,
                autoFocus: false,
            });
            this.modalManagerService.setModalIsDisplayed(true);
            dialogRef.afterClosed().subscribe((displayWelcomeModalWindow) => {
                if (!displayWelcomeModalWindow) {
                    displayWelcomeModalWindow = displayWelcomeModalWindow.toString();
                    this.welcomeModalWindowService.setValueToLocalStorage(displayWelcomeModalWindow);
                }
                this.modalManagerService.setModalIsDisplayed(false);
            });
        }
    }

    shouldAllowShortcut(): boolean {
        return !this.modalIsDisplayed && !this.isOnInput;
    }

    @HostListener('window:contextmenu', ['$event']) onRightClick(event: MouseEvent) {
        event.preventDefault();
    }

}
