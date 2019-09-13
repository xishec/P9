import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stroke',
  templateUrl: './stroke.component.html',
  styleUrls: ['./stroke.component.scss']
})
export class StrokeComponent implements OnInit {

  constructor() { }
  private x = 10;
  right() {
    this.x += 5;
  }

  ngOnInit() {
  }

}
