import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { ExportToolService } from './export-tool.service';
import { FileType } from 'src/constants/tool-constants';

fdescribe('ExportToolService', () => {
    let injector: TestBed;
    let service: ExportToolService;

    let spyCreateSVGBlob: jasmine.Spy;
    let spyLaunchDownload: jasmine.Spy;

    const FAKE_URL = 'http://localhost:4200/';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ExportToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: (elem: string) => {
                            if (elem === 'canvas') {
                                const mockCanvas = {
                                    getContext: (dimention: string) => {
                                        const mockContext = {
                                            drawImage: (img: CanvasImageSource, dx: number, dy: number) => {
                                                null;
                                            },
                                            getImageData: (x: number, y: number, sw: number, sh: number) => {
                                                const mockImageData = {};
                                                return (mockImageData as unknown) as ImageData;
                                            },
                                        };
                                        return (mockContext as unknown) as CanvasRenderingContext2D;
                                    },
                                    toDataURL: () => {
                                        return 'newuri';
                                    },
                                };
                                return (mockCanvas as unknown) as HTMLCanvasElement;
                            } else if (elem === 'img') {
                                const mockImg = {};
                                return mockImg as HTMLImageElement;
                            } else {
                                const mockAnchor = {
                                    click: () => null,
                                };
                                return (mockAnchor as unknown) as HTMLAnchorElement;
                            }
                        },
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                        setProperty: () => null,
                        removeAttribute: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundleft = 0;
                                const boundtop = 0;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
                {
                    provide: CanvasRenderingContext2D,
                    useValue: {
                        drawImage: () => {
                            const mockDrawImage = {};
                            return (mockDrawImage as unknown) as CanvasDrawImage;
                        },
                    },
                },
            ],
        });
        injector = getTestBed();
        service = injector.get(ExportToolService);

        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock);

        spyCreateSVGBlob = spyOn(service, 'createSVGBlob').and.callFake(() => {
            return new Blob();
        });
        spyLaunchDownload = spyOn(service, 'launchDownload').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should launch download as svg if filetype is svg', () => {
        const spySaveAsSVG = spyOn(service, 'saveAsSVG').and.callThrough();
        service.saveFile(FileType.SVG);

        expect(service.fileType).toEqual(FileType.SVG);
        expect(spyCreateSVGBlob).toHaveBeenCalled();
        expect(spyLaunchDownload).toHaveBeenCalled();
        expect(spySaveAsSVG).toHaveBeenCalled();
    });

    it('should launch download as bmp if filetype is bmp and do the compression/decompression of svg', () => {
        const spyOnCompressSVG = spyOn(service, 'compressSVG').and.callThrough();
        const spyOnDecompressSVG = spyOn(service, 'decompressSVG').and.callThrough();
        const spySaveAsOther = spyOn(service, 'saveAsOther').and.callThrough();

        service.saveFile(FileType.BMP);

        expect(service.fileType).toEqual(FileType.BMP);
        expect(spySaveAsOther).toHaveBeenCalled();
        expect(spyOnCompressSVG).toHaveBeenCalled();
        expect(spyCreateSVGBlob).toHaveBeenCalled();
        expect(spyOnDecompressSVG).toHaveBeenCalled();
    });

    it('should launch download as jpeg if filetype is jpeg', () => {
        const spySaveAsOther = spyOn(service, 'saveAsOther').and.callThrough();

        service.saveFile(FileType.JPG);

        expect(service.fileType).toEqual(FileType.JPG);
        expect(spyCreateSVGBlob).toHaveBeenCalled();
        expect(spySaveAsOther).toHaveBeenCalled();
    });

    it('should launch download as png if filetype is png', () => {
        const spySaveAsOther = spyOn(service, 'saveAsOther').and.callThrough();

        service.saveFile(FileType.PNG);

        expect(service.fileType).toEqual(FileType.PNG);
        expect(spyCreateSVGBlob).toHaveBeenCalled();
        expect(spySaveAsOther).toHaveBeenCalled();
    });

    it('shoud call toDataURL from canvas is filetype is JPEG or PNG', () => {
        const spy = spyOn(service.canvas, 'toDataURL').and.returnValue('');

        service.fileType = FileType.PNG;
        service.setUri(FAKE_URL);
        service.fileType = FileType.JPG;
        service.setUri(FAKE_URL);

        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should call toDataURL from CanvasToBMP if filetype is BMP', () => {
        service.fileType = FileType.BMP;
        const spy = spyOn(service.canvasToBMP, 'toDataURL').and.returnValue('');

        service.setUri(FAKE_URL);

        expect(spy).toHaveBeenCalled();
    });
});
