import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';

@Component({
    selector: 'app-welcome-modal-window',
    templateUrl: './welcome-modal-window.component.html',
    styleUrls: ['./welcome-modal-window.component.scss'],
})
export class WelcomeModalWindowComponent {
    displayWelcomeModalWindow = false;

    constructor(
        private dialogRef: MatDialogRef<WelcomeModalWindowComponent>,
        private welcomeModalWindowService: WelcomeModalWindowService,
    ) {}

    submitForm(): void {
        this.dialogRef.close(!this.displayWelcomeModalWindow);
        this.welcomeModalWindowService.changeWelcomeModalWindowClosed(true);
    }
}
