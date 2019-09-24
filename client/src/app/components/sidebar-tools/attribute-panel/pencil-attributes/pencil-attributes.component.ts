import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-pencil-attributes',
    templateUrl: './pencil-attributes.component.html',
    styleUrls: ['./pencil-attributes.component.scss'],
})
export class PencilAttributesComponent implements OnInit {
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
}
