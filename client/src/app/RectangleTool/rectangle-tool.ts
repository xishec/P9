import { ElementRef } from '@angular/core';
import { Keys } from 'src/app/keys.enum';

export class RectangleTool {
  protected currentMouseX : number;
  protected currentMouseY : number;
  protected initialMouseX : number;
  protected initialMouseY : number;
  private previewRect : SVGRectElement;
  private isPreviewing : boolean;
  private fillColor : string;
  private strokeColor : string;
  private strokeWidth : number;
  private svgReference : ElementRef<SVGElement>;

  constructor(elRef : ElementRef<SVGElement>) {
    this.svgReference = elRef;
    this.fillColor = "red";
    this.strokeColor = "black";
    this.strokeWidth = 1;
    this.isPreviewing = false;
  }

  onMouseDown(event: MouseEvent): void {
    let button = event.button;

    switch(button){
      case 0:
        this.isPreviewing = true;
        this.initialMouseX = this.currentMouseX;
        this.initialMouseY = this.currentMouseY;
        this.buildPreviewRect();
        this.svgReference.nativeElement.appendChild(this.previewRect);
        break;

      case 1:
        break;

      default:
        break;
    }
  }

  onMouseUp(event: MouseEvent): void {
    let button = event.button;

    switch(button){
      case 0:
          this.createSVG();
          this.isPreviewing = false;
          this.svgReference.nativeElement.removeChild(this.previewRect);
          break;

      case 1:
        break;

      default:
        break;
    }
  }
  onMouseMove(event: MouseEvent): void {
    this.currentMouseX = event.offsetX;
    this.currentMouseY = event.offsetY;
    if(this.isPreviewing){
      this.updatePreviewRect();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    let key = event.key;
    switch(key){
      case Keys.Shift:
        console.log(key + " -> Adjusting rectangle to a square");
        if(this.isPreviewing){
          let minLen = Math.min(this.previewRect.width.baseVal.value, this.previewRect.height.baseVal.value);
          this.previewRect.setAttribute("width", minLen.toString());
          this.previewRect.setAttribute("height", minLen.toString());
        }
        break;

      default:
        console.log(key + " -> Key not handled");
        break;
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    let key = event.key;

    switch(key){
      case Keys.Shift:
        if(this.isPreviewing){
          this.updatePreviewRect();
        }
        break;
      default:

        break;
    }
  }

  createSVG() : void{
    let el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    el.setAttribute("x", this.previewRect.x.baseVal.valueAsString);
    el.setAttribute("y", this.previewRect.y.baseVal.valueAsString);
    el.setAttribute("width", this.previewRect.width.baseVal.valueAsString);
    el.setAttribute("height", this.previewRect.height.baseVal.valueAsString);
    el.setAttribute("fill", this.fillColor.toString());
    el.setAttribute("stroke", this.strokeColor.toString());
    el.setAttribute("stroke-width", this.strokeWidth.toString());
    el.addEventListener("mousedown", ()=>{el.setAttribute("fill", "blue")});
    this.svgReference.nativeElement.appendChild(el);
  };

  private buildPreviewRect() : void{
    this.previewRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.updatePreviewRect();
  }

  private updatePreviewRect() : void{
    let x = this.initialMouseX;
    let y = this.initialMouseY;
    let w = (this.currentMouseX - this.initialMouseX);
    let h = (this.currentMouseY - this.initialMouseY);
    // adjust x
    if(w < 0){
      w *= -1;
      this.previewRect.setAttribute("x", (x - w).toString());
      this.previewRect.setAttribute("width", w.toString());
    }else{
      this.previewRect.setAttribute("x", x.toString());
      this.previewRect.setAttribute("width", w.toString());
    }
    // adjust y
    if(h < 0){
      h *= -1;
      this.previewRect.setAttribute("y", (y - h).toString());
      this.previewRect.setAttribute("height", h.toString());
    }else{
      this.previewRect.setAttribute("y", y.toString());
      this.previewRect.setAttribute("height", h.toString());
    }
    this.previewRect.setAttribute("fill", "white");
    this.previewRect.setAttribute("fill-opacity", "0.3");
    this.previewRect.setAttribute("stroke", "black");
  }
}
