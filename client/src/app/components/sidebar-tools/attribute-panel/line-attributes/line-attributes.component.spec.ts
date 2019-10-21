import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineAttributesComponent } from './line-attributes.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';

fdescribe('LineAttributesComponent', () => {
    let component: LineAttributesComponent;
    let fixture: ComponentFixture<LineAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LineAttributesComponent ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: MatDialog,
                    useValue: {},
                }
            ],
        }).overrideComponent(LineAttributesComponent, {
            set: {
                providers: [
                    {
                        provide:AttributesManagerService,
                        useValue: {},
                    },
                    {
                        provide: ShortcutManagerService,
                        useValue: {},
                    },
                ],
            },
        }).compileComponents();

        fixture = TestBed.createComponent(LineAttributesComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
