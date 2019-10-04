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
  drawingInfos = []

  constructor() { }

  ngOnInit() {
  }

}
