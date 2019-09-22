import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-welcome-modal-window',
  templateUrl: './welcome-modal-window.component.html',
  styleUrls: ['./welcome-modal-window.component.scss'],
})
export class WelcomeModalWindowComponent {
  displayWelcomeModalWindow = false;

  constructor(private dialogRef: MatDialogRef<WelcomeModalWindowComponent>) {}

  submitForm() {
    this.dialogRef.close(!this.displayWelcomeModalWindow);
  }
}
