import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

import { OpenFileModalWindowComponent } from './open-file-modal-window.component';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { HttpClientModule } from '@angular/common/http';

describe('OpenFileModalWindowComponent', () => {
    let component: OpenFileModalWindowComponent;
    let fixture: ComponentFixture<OpenFileModalWindowComponent>;

    const dialogMock = {
        close: () => null,
    };

    @Pipe({name: 'mySlice'})
    class MockMySclicePipe implements PipeTransform {
        transform(value: number): number {
            //
            return value;
        }
    }

    @Pipe({name: 'labelFilter'})
    class MockLabelFilterPipe implements PipeTransform {
        transform(value: number): number {
            //
            return value;
        }
    }

    @Pipe({name: 'nameFilter'})
    class MockNameFilterPipe implements PipeTransform {
        transform(value: number): number {
            //
            return value;
        }
    }

    @Pipe({name: 'toTrustHtml'})
    class MockToTrustHtmlPipe implements PipeTransform {
        transform(value: number): number {
            //
            return value;
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ 
            OpenFileModalWindowComponent, 
            MockMySclicePipe, 
            MockLabelFilterPipe, 
            MockNameFilterPipe,
            MockToTrustHtmlPipe,
        ],
        imports: [HttpClientModule],
        providers: [
            FormBuilder,
            {
                provide: MatDialogRef,
                useValue: {},
            },
        ],
        schemas: [NO_ERRORS_SCHEMA],
        }).overrideComponent(OpenFileModalWindowComponent, {
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

        fixture = TestBed.createComponent(OpenFileModalWindowComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
