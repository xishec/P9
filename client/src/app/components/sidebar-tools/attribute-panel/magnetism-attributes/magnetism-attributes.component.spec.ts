import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { MagnetismAttributesComponent } from './magnetism-attributes.component';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { MagnetismToolService } from 'src/app/services/tools/magnetism-tool/magnetism-tool.service';

describe('MagnetismAttributesComponent', () => {
    let component: MagnetismAttributesComponent;
    let fixture: ComponentFixture<MagnetismAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MagnetismAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [FormBuilder],
        })
            .overrideComponent(MagnetismAttributesComponent, {
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
                        {
                            provide: MatSnackBar,
                            useValue: {},
                        },
                        {
                            provide: DrawingLoaderService,
                            useValue: {},
                        },
                        {
                            provide: MagnetismToolService,
                            useValue: {},
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(MagnetismAttributesComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
