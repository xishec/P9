import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Message} from '../../../../../common/communication/message';
import {IndexService} from '../../services/index/index.service';
import { PencilComponent } from '../pencil/pencil.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  readonly title: string = 'LOG2990';
  message = new BehaviorSubject<string>('');

  // Remove Before Merging from there ... 
  @ViewChild('svgpad', {static: true}) svgReference: ElementRef<SVGElement>;
  private currentTool: PencilComponent;

  ngOnInit(): void {
    this.currentTool = new PencilComponent();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent): void {
    this.currentTool.mouseDown(e);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent): void {
    this.currentTool.mouseMove(e);
  }

  @HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent): void {
    this.currentTool.mouseUp(e);
  }
  // To there

  constructor(private basicService: IndexService) {
    this.basicService.basicGet()
      .pipe(
        map((message: Message) => `${message.title} ${message.body}`),
      )
      .subscribe(this.message);
  }
}
