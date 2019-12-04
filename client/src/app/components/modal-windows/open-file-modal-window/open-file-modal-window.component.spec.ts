import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { BehaviorSubject, of } from 'rxjs';

import { Drawing } from 'src/../../common/communication/Drawing';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { FileManagerService } from 'src/app/services/server/file-manager/file-manager.service';
import { UndoRedoerService } from 'src/app/services/undo-redoer/undo-redoer.service';
import { GIFS, NUMBER_OF_MS } from 'src/constants/constants';
import { SNACKBAR_DURATION } from 'src/constants/tool-constants';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { OpenFileModalWindowComponent } from './open-file-modal-window.component';

describe('OpenFileModalWindowComponent', () => {
    let component: OpenFileModalWindowComponent;
    let fixture: ComponentFixture<OpenFileModalWindowComponent>;

    let drawingLoaderService: DrawingLoaderService;
    let undoRedoerService: UndoRedoerService;
    let fileManagerService: FileManagerService;

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

    const TEST_DRAWING3: Drawing = {
        svg: '<rect _ngcontent-smx-c2="" height="798px" width="586px" style="fill: #ffffffff;"></rect>',
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
                            provide: UndoRedoerService,
                            useValue: {
                                initializeStacks: () => null,
                            },
                        },
                        {
                            provide: FileManagerService,
                            useValue: {
                                deleteDrawing: () => of(500),
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
        undoRedoerService = fixture.debugElement.injector.get(UndoRedoerService);
        fileManagerService = fixture.debugElement.injector.get(FileManagerService);

        const baseTime = new Date('December 03, 2019 16:38:00');
        jasmine.clock().mockDate(baseTime);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should extract the svg code of a htmlcode', () => {
        const expectedValue = '<div><p>HELLO</p></div>';
        const MOCK_CODE = `<svg>${expectedValue}</svg>`;

        expect(component.extractInnerHTML(MOCK_CODE)).toEqual(expectedValue);
    });

    it('should call undoRedoerService initializeStacks and set fromLoader to true', () => {
        const SPY = spyOn(undoRedoerService, 'initializeStacks');

        component.initializeUndoRedoStacks();

        expect(SPY).toHaveBeenCalled();
        expect(undoRedoerService.fromLoader).toBeTruthy();
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

    it('should load the right drawing from local file if file to load exists', () => {
        const SPY = spyOn(drawingLoaderService.currentDrawing, 'next');
        const SPY_DIALOG = spyOn(component, 'closeDialog');

        component.fileToLoad = TEST_DRAWING;

        component.loadLocalFile();

        expect(SPY).toHaveBeenCalledWith(TEST_DRAWING);
        expect(SPY_DIALOG).toHaveBeenCalledWith();
    });

    it('should open a snackBar if there is no file to load', () => {
        const SPY_DIALOG = spyOn(component[`snackBar`], 'open');
        component.fileToLoad = null;

        component.loadLocalFile();

        expect(SPY_DIALOG).toHaveBeenCalledWith(`Veuillez choisir un fichier valide.`, 'OK', {
            duration: SNACKBAR_DURATION,
        });
    });

    it('should call callback method with the right file and reader', () => {
        const mockFile = new File([''], 'filename', { type: 'text/plain' });
        const mockEvent = { target: { files: [mockFile] } };
        const mockReader: FileReader = jasmine.createSpyObj('FileReader', ['readAsText', 'onload']);
        spyOn(window as any, 'FileReader').and.returnValue(mockReader);
        spyOn(component, 'getLocalFileLoadCallback').and.callThrough();

        component.getLocalFileToLoad(mockEvent as any);

        expect((window as any).FileReader).toHaveBeenCalled();
        expect(mockReader.readAsText).toHaveBeenCalledWith(mockFile);
        expect(component.getLocalFileLoadCallback).toHaveBeenCalledWith(mockFile, mockReader);
    });

    it('should set the right drawing information when valid drawing is sent as input', () => {
        const mockReader = { result: JSON.stringify(TEST_DRAWING3) } as FileReader;
        const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
        const callback: () => void = component.getLocalFileLoadCallback(mockFile, mockReader);

        callback();

        expect(component.fileToLoad).toEqual(TEST_DRAWING3);
        expect(component.localFileName).toEqual('test.txt');
    });

    it('should not set any drawing information when drawing input is invalid but instead open a snackBar', () => {
        const mockReader = { result: JSON.stringify(TEST_DRAWING) } as FileReader;
        const mockFile = new File([''], 'filename', { type: 'text/plain' });
        const callback: () => void = component.getLocalFileLoadCallback(mockFile, mockReader);

        const SPY = spyOn(component[`snackBar`], 'open');

        callback();

        expect(component.fileToLoad).toEqual(null);
        expect(component.localFileName).toEqual('');
        expect(SPY).toHaveBeenCalledWith('Le fichier choisi n\'est pas valide, veuillez réessayer.', 'OK', {
            duration: SNACKBAR_DURATION,
        });
    });

    it('should return a valid GIF image path', () => {
        component.randomGifIndex = Math.floor(Math.random() * GIFS.length);
        const returnedFilePath = component.getGifSource();

        expect(GIFS).toContain(returnedFilePath);
    });

    it('should open a success snackBar if drawing has successfully been deleted', () => {
        const SPY = spyOn(component[`snackBar`], 'open');

        component.drawingsFromServer = [TEST_DRAWING, TEST_DRAWING2];
        component.selectedOption = 500;

        component.onDelete();

        expect(SPY).toHaveBeenCalledWith('Suppression réussie!', 'OK', {
            duration: SNACKBAR_DURATION,
        });
    });

    it('should open a failure snackBar if drawing deletion fails', () => {
        const SPY = spyOn(component[`snackBar`], 'open');

        spyOn(fileManagerService, 'deleteDrawing').and.returnValue(of(400));

        component.drawingsFromServer = [TEST_DRAWING, TEST_DRAWING2];
        component.selectedOption = 500;

        component.onDelete();

        expect(SPY).toHaveBeenCalledWith('Erreur de suppression du côté serveur!', 'OK', {
            duration: SNACKBAR_DURATION,
        });
    });

    it('should return the size of the viewbox of the svg to display of the first file that contains the searched name', () => {
        component.drawingsFromServer = [TEST_DRAWING, TEST_DRAWING2];

        expect(component.getViewBox(500)).toEqual('0 0 50 40');
    });

    it('should return the width of the svg to display of the first file that contains the searched name', () => {
        component.drawingsFromServer = [TEST_DRAWING, TEST_DRAWING2];

        expect(component.getWidth(500)).toEqual('100%');
    });

    it('should return the height of the svg to display of the first file that contains the searched name', () => {
        component.drawingsFromServer = [TEST_DRAWING, TEST_DRAWING2];

        expect(component.getHeight(500)).toEqual('60px');
    });

    it('should return the svg of the first file that contains the searched name', () => {
        component.drawingsFromServer = [TEST_DRAWING, TEST_DRAWING2];

        expect(component.getSVG(500)).toEqual('test-svg2');
    });

    it('should return the index of the first file that contains the searched name', () => {
        component.drawingsFromServer = [TEST_DRAWING, TEST_DRAWING2];

        expect(component.findIndexByName(500)).toEqual(1);
    });

    it('should load the right drawing from local file when loadLocalFile is called', () => {
        component.nameFilter = '';

        component.unmaskAll();

        expect(component.nameFilter).toEqual('$tout');
    });

    it('should modify the value of the name filter to $tout', () => {
        const SPY = spyOn(drawingLoaderService.currentDrawing, 'next');
        component.fileToLoad = TEST_DRAWING;
        component.loadLocalFile();

        expect(SPY).toHaveBeenCalledWith(TEST_DRAWING);
    });

    it('should correctly return the number of days between two values in milliseconds', () => {
        const firstValue = 3 * NUMBER_OF_MS.day + 7 * NUMBER_OF_MS.hours;
        const secondValue = 9 * NUMBER_OF_MS.day + 1 * NUMBER_OF_MS.minutes;

        expect(component.numberOfDaysBetween(firstValue, secondValue)).toEqual(6);
    });

    it('should correctly convert a timestamp into a date message when drawing has been created more than 7 days ago', () => {
        const timestamp = new Date('November 20, 2019 03:24:00').getTime();
        const expectedResult = 'Créé le 2019/11/20 à 03:24:00';

        expect(component.convertTimeStampToDate(timestamp)).toEqual(expectedResult);
    });

    // tslint:disable-next-line: max-line-length
    it('should correctly convert a timestamp into a message relative to current time when drawing has been created less than 7 days ago', () => {
        const timestamp = new Date('December 01, 2019 03:24:00').getTime();
        const expectedResult = 'Créé il y a 2 jours, 13 heures et 14 minutes';

        expect(component.convertTimeStampToDate(timestamp)).toEqual(expectedResult);
    });

    it('should correctly convert number of ms to days, hours and minutes format', () => {
        const expectedResult = '1 jour, 3 heures et 24 minutes';
        const numberOfMs = 1 * NUMBER_OF_MS.day + 3 * NUMBER_OF_MS.hours + 24 * NUMBER_OF_MS.minutes;

        expect(component.msToDaysHoursMinutes(numberOfMs)).toEqual(expectedResult);
    });
});
