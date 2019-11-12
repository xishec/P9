import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { Drawing } from '../../../../../../common/communication/Drawing';
import { OpenFileModalWindowComponent } from './open-file-modal-window.component';

fdescribe('OpenFileModalWindowComponent', () => {
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

    const TEST_DRAWING2: Drawing = {
        name: 'harry potter',
        labels: ['Englang', 'JK Rowling', 'novel'],
        svg: 'test_svg2',
        idStack: ['work-zone', 'background', 'ellipse'],
        drawingInfo: {
            width: 50,
            height: 40,
            color: '000000',
        },
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

    it('should return 100% when width of a drawing sent from the server is bigger than its height', () => {
        component.drawingsFromServer = [TEST_DRAWING];

        const i = 0;
        component.drawingsFromServer[i].drawingInfo.height = 50;
        component.drawingsFromServer[i].drawingInfo.width = 100;

        expect(component.getWidth('mona lisa')).toEqual('100%');
    });

    it('should return 60px when width of a drawing sent from the server is smaller than its height', () => {
        component.drawingsFromServer = [TEST_DRAWING];

        const i = 0;
        component.drawingsFromServer[i].drawingInfo.height = 50;
        component.drawingsFromServer[i].drawingInfo.width = 10;

        expect(component.getHeight('mona lisa')).toEqual('100%');
    });

    it('should load the right drawing from server when loadServerFile is called', () => {
        const SPY = spyOn(drawingLoaderService.currentDrawing, 'next');
        component.selectedOption = TEST_DRAWING.name;
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
