import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-attribute-panel',
    templateUrl: './attribute-panel.component.html',
    styleUrls: ['./attribute-panel.component.scss'],
})
export class AttributePanelComponent {
    @Input() currentToolId = 0;
    thickness: number = 0;
    borderThickness: number = 0;
    toolName: string[] = ['Sélecteur', 'Crayon', 'Paint'];

    onInput(event: any) {
        this.thickness = event.target.value;
    }
}
