import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawStackService {
    private drawStack_: SVGElement[];
    private drawCount_: number;

    constructor() {
        this.drawStack_ = new Array<SVGElement>();
        this.drawCount_ = 0;
    }

    push(el: SVGElement): void{
        this.drawStack_.push(el);
        this.drawCount_++;
    }

    pop(): void{
        this.drawStack_.pop();
        this.drawCount_--;
    }

    reset(): SVGElement[]{
        const ret = this.drawStack_.splice(0, this.drawStack_.length);
        this.drawCount_ = 0;
        return ret;
    }

    get drawCount(): number{
        return this.drawCount_;
    }
}
