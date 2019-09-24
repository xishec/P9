import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';

@Component({
    selector: 'app-pencil-attributes',
    templateUrl: './pencil-attributes.component.html',
    styleUrls: ['./pencil-attributes.component.scss'],
})
export class PencilAttributesComponent implements OnInit {
    toolName: string = 'Crayon';

    myForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private attributesManagerService: AttributesManagerService) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onThicknessChange();
    }

    initializeForm(): void {
        this.myForm = this.formBuilder.group({
            thickness: ['20', [Validators.required, Validators.min(0), Validators.max(100)]],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        this.myForm.controls.thickness.setValue(event.value);
        this.onThicknessChange();
    }
    onThicknessChange(): void {
        const thickness = this.myForm.value.thickness;
        this.attributesManagerService.changeThickness(thickness);
    }
}
