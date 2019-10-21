import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';

@Component({
    selector: 'app-welcome-modal-window',
    templateUrl: './welcome-modal-window.component.html',
    styleUrls: ['./welcome-modal-window.component.scss'],
})
export class WelcomeModalWindowComponent {
    displayWelcomeModalWindow = false;

    constructor(
        private dialogRef: MatDialogRef<WelcomeModalWindowComponent>,
        private modalManagerService: ModalManagerService,
    ) {}

    submitForm(): void {
        this.dialogRef.close(!this.displayWelcomeModalWindow);
        this.modalManagerService.setModalIsDisplayed(false);
    }
}
