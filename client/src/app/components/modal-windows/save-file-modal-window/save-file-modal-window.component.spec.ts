import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveFileModalWindowComponent } from './save-file-modal-window.component';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';

describe('SaveFileModalWindowComponent', () => {
    let component: SaveFileModalWindowComponent;
    let fixture: ComponentFixture<SaveFileModalWindowComponent>;

    const dialogMock = {
        close: () => null,
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ SaveFileModalWindowComponent ],
        providers: [
            FormBuilder,
            {
                provide: MatDialogRef,
                useValue: {},
            },
        ],
        schemas: [NO_ERRORS_SCHEMA],
        }).overrideComponent(SaveFileModalWindowComponent, {
            set: {
                providers: [
                    FormBuilder,
                    FormsModule,
                    {
                        provide: MatDialogRef,
                        useValue: dialogMock,
                    },
                    {
                        provide: ModalManagerService,
                        useValue: {},
                    },
                    {
                        provide: DrawingSaverService,
                        useValue: {},
                    },
                    {
                        provide: DrawingLoaderService,
                        useValue: {},
                    }
                ]
            }
        })
        .compileComponents();

        fixture = TestBed.createComponent(SaveFileModalWindowComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
