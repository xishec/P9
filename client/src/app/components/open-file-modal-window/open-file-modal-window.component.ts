import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-open-file-modal-window',
  templateUrl: './open-file-modal-window.component.html',
  styleUrls: ['./open-file-modal-window.component.scss']
})
export class OpenFileModalWindowComponent implements OnInit {
  openFileModalForm: FormGroup;
  formBuilder: FormBuilder;
  drawingFileInfos = []

  constructor() { }

  ngOnInit() {
  }

    initializeForm(): void {
        this.openFileModalForm = this.formBuilder.group({
          selectedDrawing: ['', Validators.required],
        });
    }

    handleSelection(event: any, ): void {
      if (event.option.selected) {
        event.source.deselectAll();
        event.option._setSelected(true);
        this.selectedOption = event.option.value;
      }
    }

    onCancel(): void {
      this.dialogRef.close();
    }

    onSubmit() {
      console.log(this.selectedOption);
    }
}
