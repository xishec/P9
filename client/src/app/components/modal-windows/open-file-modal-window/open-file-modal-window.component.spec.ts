import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { OpenFileModalWindowComponent } from './open-file-modal-window.component';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { Drawing } from '../../../../../../common/communication/Drawing';
import { BehaviorSubject } from 'rxjs';

describe('OpenFileModalWindowComponent', () => {
    let component: OpenFileModalWindowComponent;
    let fixture: ComponentFixture<OpenFileModalWindowComponent>;

    let drawingLoaderService: DrawingLoaderService;

    const TEST_DRAWING: Drawing = {
        name: 'mona lisa',
        labels: ['Italy', 'Louvre', 'Paris'],
        svg: 'test_svg',
        idStack: ['work-zone', 'background', 'rect1'],
        drawingInfo: {
            width: 100,
            height: 100,
            color: 'ffffff',
        },
    };

    const dialogMock = {
        close: () => null,
    };

    @Pipe({ name: 'mySlice' })
    class MockMySclicePipe implements PipeTransform {
        transform(value: number): number {
            //
            return value;
        }
    }

    @Pipe({ name: 'labelFilter' })
    class MockLabelFilterPipe implements PipeTransform {
        transform(value: number): number {
            //
            return value;
        }
    }

    @Pipe({ name: 'nameFilter' })
    class MockNameFilterPipe implements PipeTransform {
        transform(value: number): number {
            //
            return value;
        }
    }

    @Pipe({ name: 'toTrustHtml' })
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
        })
            .overrideComponent(OpenFileModalWindowComponent, {
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
                            useValue: {
                                setModalIsDisplayed: () => null,
                            },
                        },
                        {
                            provide: DrawingSaverService,
                            useValue: {},
                        },
                        {
                            provide: DrawingLoaderService,
                            useValue: {},
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(OpenFileModalWindowComponent);
        component = fixture.componentInstance;

        drawingLoaderService = fixture.debugElement.injector.get(DrawingLoaderService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close modal on submit when drawing has been successfully opened', () => {
        const SPY = spyOn(component[`dialogRef`], 'close');

        component.drawingOpenSuccess = true;
        drawingLoaderService.currentDrawing = new BehaviorSubject(TEST_DRAWING);
        component.onSubmit();
        expect(SPY).toHaveBeenCalled();
    });

    it('should return 100% when width of a drawing sent from the server is bigger than its height', () => {
        component.drawingsFromServer = [TEST_DRAWING];

        let i: number = 0;
        component.drawingsFromServer[i].drawingInfo.height = 50;
        component.drawingsFromServer[i].drawingInfo.width = 100;

        expect(component.getWidth('mona lisa')).toEqual('100%');
    });

    it('should return 60px when width of a drawing sent from the server is smaller than its height', () => {
        component.drawingsFromServer = [TEST_DRAWING];

        let i: number = 0;
        component.drawingsFromServer[i].drawingInfo.height = 50;
        component.drawingsFromServer[i].drawingInfo.width = 10;

        expect(component.getHeight('mona lisa')).toEqual('100%');
    });
});
