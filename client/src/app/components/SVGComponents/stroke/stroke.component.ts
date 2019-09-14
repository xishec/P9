import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stroke',
  templateUrl: './stroke.component.html',
  styleUrls: ['./stroke.component.scss']
})
export class StrokeComponent implements OnInit {

  constructor() { }
  private x = 10;
  private y = 10;
  
  right() {
    this.x += 5;
  }

  move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  ngOnInit() {
  }

}
