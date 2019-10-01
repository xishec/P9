import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { DrawingModalWindowService } from 'src/app/services/drawing-modal-window/drawing-modal-window.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { DrawingModalWindowComponent } from './drawing-modal-window.component';

fdescribe('DrawingModalWindowComponent', () => {
    let component: DrawingModalWindowComponent;
    let fixture: ComponentFixture<DrawingModalWindowComponent>;
    let form: FormGroup;

    let drawingModalService: DrawingModalWindowService;
    let colorToolService: ColorToolService;
    let shortCutManagerService: ShortcutManagerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingModalWindowComponent],
            providers: [{
                provide: MatDialogRef,
                useValue: { },
            }, {
                provide: FormBuilder,
                useValue: { },
            }],
            schemas: [NO_ERRORS_SCHEMA],
        }).overrideComponent(DrawingModalWindowComponent, {
            set: {
                providers: [
                    {
                        provide: DrawingModalWindowService,
                        useValue: {
                        },
                    },
                    {
                        provide: ColorToolService,
                        useValue: {
                        },
                    },
                    {
                        provide: ShortcutManagerService,
                        useValue: {
                        },
                    },
                ],
            },
        })
        .compileComponents();

        fixture = TestBed.createComponent(DrawingModalWindowComponent);
        component = fixture.componentInstance;

        component.initializeForm();
        form = component.drawingModalForm;

        drawingModalService = fixture.debugElement.injector.get(DrawingModalWindowService);
        colorToolService = fixture.debugElement.injector.get(ColorToolService);
        shortCutManagerService = fixture.debugElement.injector.get(ShortcutManagerService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
