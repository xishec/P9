import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';
import { MIN_THICKNESS, DEFAULT_THICKNESS, MAX_THICKNESS } from '../../../../services/constants';

@Component({
    selector: 'app-rectangle-attributes',
    templateUrl: './rectangle-attributes.component.html',
    styleUrls: ['./rectangle-attributes.component.scss'],
})
export class RectangleAttributesComponent implements OnInit {
    toolName: string = 'Carré';

    readonly MIN_THICKNESS: number = MIN_THICKNESS;
    readonly MAX_THICKNESS: number = MAX_THICKNESS;

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
            thickness: [
                DEFAULT_THICKNESS,
                [Validators.required, Validators.min(MIN_THICKNESS), Validators.max(MAX_THICKNESS)],
            ],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        this.myForm.controls.thickness.setValue(event.value);
        this.onThicknessChange();
    }
    onThicknessChange(): void {
        const thickness = this.myForm.value.thickness;
        if (thickness >= MIN_THICKNESS && thickness <= MAX_THICKNESS) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }
}
