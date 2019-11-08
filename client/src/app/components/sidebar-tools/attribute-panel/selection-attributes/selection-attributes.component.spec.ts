import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionAttributesComponent } from './selection-attributes.component';

describe('SelectionAttributesComponent', () => {
    let fixture: ComponentFixture<SelectionAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectionAttributesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionAttributesComponent);
        fixture.detectChanges();
    });
});
