import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';

@Component({
    selector: 'app-pencil-attributes',
    templateUrl: './pencil-attributes.component.html',
    styleUrls: ['./pencil-attributes.component.scss'],
})
export class PencilAttributesComponent implements OnInit {
    toolName = 'Crayon';

    myForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private attributesManagerService: AttributesManagerService) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.myForm = this.formBuilder.group({
            thickness: ['2', [Validators.required, Validators.min(0), Validators.max(100)]],
        });
    }

    onThicknessChange() {
        this.attributesManagerService.changeThickness(10);
    }

    onSubmit() {}
}
