import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-attribute-panel',
    templateUrl: './attribute-panel.component.html',
    styleUrls: ['./attribute-panel.component.scss'],
})
export class AttributePanelComponent {
    toolName = 'Crayon';

    myForm: FormGroup;
    formBuilder: FormBuilder;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.myForm = this.formBuilder.group({
            thickness: ['5', [Validators.required, Validators.min(0), Validators.max(100)]],
        });
    }

    // onInput(event: any) {
    //     this.thickness = event.target.value;
    // }
}
