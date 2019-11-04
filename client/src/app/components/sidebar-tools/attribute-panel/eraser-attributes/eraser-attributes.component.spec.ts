import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { EraserAttributesComponent } from './eraser-attributes.component';

describe('EraserAttributesComponent', () => {
    let component: EraserAttributesComponent;
    let fixture: ComponentFixture<EraserAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EraserAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: MatDialog,
                    useValue: {},
                },
            ],
        })
            .overrideComponent(EraserAttributesComponent, {
                set: {
                    providers: [
                        {
                            provide: AttributesManagerService,
                            useValue: {},
                        },
                        {
                            provide: ShortcutManagerService,
                            useValue: {},
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(EraserAttributesComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
