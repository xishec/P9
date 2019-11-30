import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import { Drawing } from 'src/../../common/communication/Drawing';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { OpenFileModalWindowComponent } from './open-file-modal-window.component';

describe('OpenFileModalWindowComponent', () => {
    let component: OpenFileModalWindowComponent;
    let fixture: ComponentFixture<OpenFileModalWindowComponent>;

    let drawingLoaderService: DrawingLoaderService;

    const TEST_DRAWING: Drawing = {
        svg: 'test-svg',
        drawingInfo: {
            width: 100,
            height: 100,
            color: 'ffffff',
            name: 'mona lisa',
            labels: ['Italy', 'Louvre', 'Paris'],
            idStack: ['work-zone', 'background', 'rect1'],
            createdAt: 1000,
            lastModified: 1500,
        } as DrawingInfo,
    };

    const TEST_DRAWING2: Drawing = {
        svg: 'test-svg2',
        drawingInfo: {
            width: 50,
            height: 40,
            color: '000000',
            name: 'harry potter',
            labels: ['England', 'JK Rowling', 'novel'],
            idStack: ['work-zone', 'background', 'ellipse'],
            createdAt: 500,
            lastModified: 2500,
        } as DrawingInfo,
    };

    const dialogMock = {
        close: () => null,
    };

    @Pipe({ name: 'mySlice' })
    class MockMySlicePipe implements PipeTransform {
        transform(value: number): number {
            return value;
        }
    }

    // tslint:disable-next-line: max-classes-per-file
    @Pipe({ name: 'labelFilter' })
    class MockLabelFilterPipe implements PipeTransform {
        transform(value: number): number {
            return value;
        }
    }

    // tslint:disable-next-line: max-classes-per-file
    @Pipe({ name: 'nameFilter' })
    class MockNameFilterPipe implements PipeTransform {
        transform(value: number): number {
            return value;
        }
    }

    // tslint:disable-next-line: max-classes-per-file
    @Pipe({ name: 'toTrustHtml' })
    class MockToTrustHtmlPipe implements PipeTransform {
        transform(value: number): number {
            return value;
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OpenFileModalWindowComponent,
                MockMySlicePipe,
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
                            useValue: {
                                currentDrawing: new BehaviorSubject<Drawing>(TEST_DRAWING),
                            },
                        },
                        {
                            provide: MatSnackBar,
                            useValue: {
                                open: () => null,
                            },
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

    it('should close modal when submit button has been clicked', () => {
        const SPY = spyOn(component[`dialogRef`], 'close');

        drawingLoaderService.currentDrawing = new BehaviorSubject(TEST_DRAWING);
        component.closeDialog();
        expect(SPY).toHaveBeenCalled();
    });

    it('should load the right drawing from server when loadServerFile is called', () => {
        const SPY = spyOn(drawingLoaderService.currentDrawing, 'next');
        component.selectedOption = TEST_DRAWING.drawingInfo.createdAt;
        component.drawingsFromServer = [TEST_DRAWING2, TEST_DRAWING];
        component.loadServerFile();

        expect(SPY).toHaveBeenCalledWith(TEST_DRAWING);
    });

    it('should load the right drawing from local file when loadLocalFile is called', () => {
        const SPY = spyOn(drawingLoaderService.currentDrawing, 'next');
        component.fileToLoad = TEST_DRAWING;
        component.loadLocalFile();

        expect(SPY).toHaveBeenCalledWith(TEST_DRAWING);
    });
});
