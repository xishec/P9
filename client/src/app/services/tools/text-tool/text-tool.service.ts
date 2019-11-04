import { Injectable } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';

@Injectable({
    providedIn: 'root',
})

export class TextToolService extends AbstractToolService {
    
    constructor() { }

    initializeService(): void {
        throw new Error("Method not implemented.");
    }
    onMouseMove(event: MouseEvent): void {
        
    }
    onMouseDown(event: MouseEvent): void {
        // create the 
    }
    onMouseUp(event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onMouseEnter(event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onMouseLeave(event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onKeyDown(event: KeyboardEvent): void {
        throw new Error("Method not implemented.");
    }
    onKeyUp(event: KeyboardEvent): void {
        throw new Error("Method not implemented.");
    }
    cleanUp(): void {
        throw new Error("Method not implemented.");
    }

    

    
}
